'use client';

import { Music, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  advanceBall,
  type Ball,
  type Board,
  layoutBoard,
  MAX_ROWS,
  MIN_ROWS,
  type Peg,
  payoutsFor,
  RISKS,
  type Risk,
  spawnBall,
} from '@/lib/plinko/board';
import { cn } from '@/lib/utils';

const STARTING_BALANCE = 1000;
const REBUY = 1000;
/** Physics substeps per frame. One frame of travel is wider than a peg. */
const SUBSTEPS = 4;

/** Blown glass, one picked per drop. */
const ORNAMENTS = [
  { hi: '#ff9b86', tint: '#c8352f', dark: '#5f120f' }, // cranberry
  { hi: '#ffe9a8', tint: '#d8ae4a', dark: '#6d4e11' }, // gold
  { hi: '#9fe7c2', tint: '#2f8f68', dark: '#123e29' }, // spruce
  { hi: '#ffffff', tint: '#b9c7cf', dark: '#54636c' }, // frost
  { hi: '#a9cdf2', tint: '#3a6ea8', dark: '#162c47' }, // midnight
];

/** Ash in the dead centre, brass through the shoulders, crimson at the edges. */
const RAMP = [
  [122, 139, 127],
  [226, 166, 58],
  [224, 69, 60],
];

function slotColor(index: number, slots: number): string {
  const half = (slots - 1) / 2;
  const t = Math.abs(index - half) / half;
  const [from, to] = t < 0.5 ? [RAMP[0], RAMP[1]] : [RAMP[1], RAMP[2]];
  const k = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const mix = (from ?? []).map((v, i) =>
    Math.round(v + ((to?.[i] ?? 0) - v) * k),
  );
  return `rgb(${mix.join(',')})`;
}

const money = (n: number) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const label = (m: number) =>
  `${m >= 100 ? String(m) : m.toFixed(m % 1 ? 1 : 0)}x`;

/**
 * The repo's own mp3s, decoded once into buffers and replayed cheap. A peg ping
 * per collision means dozens a second, which an <audio> element per hit cannot
 * keep up with.
 */
class Sound {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private ready: Promise<void> | null = null;
  private lastPing = 0;
  private voices = 0;
  private band: HTMLAudioElement | null = null;
  enabled = true;

  async wake() {
    try {
      this.ready ??= this.boot();
      await this.ready;
      if (this.ctx?.state === 'suspended') await this.ctx.resume();
    } catch {
      this.enabled = false; // Silence beats a broken game.
    }
  }

  private async boot() {
    this.ctx = new AudioContext();
    for (const [name, url] of [
      ['peg', '/bumper.mp3'],
      ['win', '/ending.mp3'],
    ] as const) {
      const bytes = await (await fetch(url)).arrayBuffer();
      this.buffers.set(name, await this.ctx.decodeAudioData(bytes));
    }
  }

  play(name: 'peg' | 'win', rate = 1, gain = 1) {
    const buffer = this.buffers.get(name);
    if (!this.enabled || !this.ctx || !buffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    const volume = this.ctx.createGain();
    volume.gain.value = gain;
    source.connect(volume).connect(this.ctx.destination);
    source.start();
    this.voices++;
    source.onended = () => this.voices--;
  }

  /** Pegs ping in bursts; throttle and cap polyphony or it turns to mud. */
  ping(impact: number) {
    const now = performance.now();
    if (now - this.lastPing < 18 || this.voices > 10) return;
    this.lastPing = now;
    this.play(
      'peg',
      1.15 + Math.random() * 0.5,
      Math.min(0.25, impact * 0.0004),
    );
  }

  toggleBand(): boolean {
    this.band ??= Object.assign(new Audio('/wii-sports-intro.mp3'), {
      loop: true,
      volume: 0.35,
    });
    const play = this.band.paused;
    if (play) void this.band.play().catch(() => {});
    else this.band.pause();
    return play;
  }

  stop() {
    this.band?.pause();
    void this.ctx?.close().catch(() => {});
  }
}

/**
 * `stake` rides along so a payout uses the bet the ornament was dropped at,
 * not whatever the box says a second and a half later.
 */
type Ornament = Ball & { glass: number; stake: number; fade: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };
type Pop = { x: number; y: number; text: string; color: string; life: number };

export default function Plinko() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const [bet, setBet] = useState(1);
  const [risk, setRisk] = useState<Risk>('medium');
  const [rows, setRows] = useState(12);
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [staked, setStaked] = useState(STARTING_BALANCE);
  const [drops, setDrops] = useState(0);
  const [best, setBest] = useState(0);
  const [history, setHistory] = useState<{ mult: number; color: string }[]>([]);
  const [auto, setAuto] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bandOn, setBandOn] = useState(false);
  const [flash, setFlash] = useState(false);

  // Everything the animation loop touches lives in refs: it runs 60 times a
  // second and must never re-render or be re-created by React.
  const board = useRef<Board | null>(null);
  const balls = useRef<Ornament[]>([]);
  const sparks = useRef<Spark[]>([]);
  const pops = useRef<Pop[]>([]);
  const hits = useRef(new Map<Peg, number>());
  const bumps = useRef<number[]>([]);
  const background = useRef<HTMLCanvasElement | null>(null);
  const glass = useRef<CanvasGradient[]>([]);
  const slotFont = useRef('600 14px ui-monospace, Menlo, monospace');
  /** The risk the current board was laid out for; its labels depend on it. */
  const built = useRef<Risk | null>(null);
  const sound = useRef<Sound | null>(null);
  const settings = useRef({ bet, risk, rows });
  settings.current = { bet, risk, rows };

  /**
   * The authoritative balance. Two drops can happen between renders — holding
   * space fires every 140ms — so state alone would let you overdraw.
   */
  const cash = useRef(STARTING_BALANCE);
  const pay = useCallback((delta: number) => {
    cash.current += delta;
    setBalance(cash.current);
  }, []);

  /** Repaint the felt, rails and 170-odd pegs into an offscreen layer. */
  const paintBackground = useCallback((b: Board, dpr: number) => {
    const layer = document.createElement('canvas');
    layer.width = b.width * dpr;
    layer.height = b.height * dpr;
    const c = layer.getContext('2d');
    if (!c) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    const felt = c.createRadialGradient(
      b.width / 2,
      b.slotTop * 0.45,
      10,
      b.width / 2,
      b.height * 0.5,
      b.width * 0.85,
    );
    felt.addColorStop(0, '#16382a');
    felt.addColorStop(1, '#071612');
    c.fillStyle = felt;
    c.fillRect(0, 0, b.width, b.height);

    const right = b.slotLeft + b.slots * b.slotWidth;
    c.strokeStyle = 'rgba(216,174,74,0.3)';
    c.lineWidth = 2;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(b.width / 2 - b.gap, b.topPad);
    c.lineTo(b.slotLeft, b.lastRowY);
    c.lineTo(b.slotLeft, b.slotTop);
    c.moveTo(b.width / 2 + b.gap, b.topPad);
    c.lineTo(right, b.lastRowY);
    c.lineTo(right, b.slotTop);
    c.moveTo(b.width / 2 - b.gap * 0.75, 0);
    c.lineTo(b.width / 2 - b.gap * 0.75, b.topPad * 0.5);
    c.moveTo(b.width / 2 + b.gap * 0.75, 0);
    c.lineTo(b.width / 2 + b.gap * 0.75, b.topPad * 0.5);
    c.stroke();

    c.fillStyle = '#cfd8d2';
    for (const peg of b.pegs) {
      c.beginPath();
      c.arc(peg.x, peg.y, b.pegRadius, 0, Math.PI * 2);
      c.fill();
    }
    background.current = layer;
  }, []);

  /** Size the board to its container and rebuild everything that depends on it. */
  const relayout = useCallback(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !shell || !ctx) return;

    const width = Math.max(280, shell.clientWidth);
    const { rows: wantRows, risk: wantRisk } = settings.current;

    // ResizeObserver fires once as soon as it starts observing, and again for
    // anything that nudges the layout. Rebuilding on a no-op would refund and
    // wipe every ornament still falling, so only rebuild on a real change.
    const current = board.current;
    if (current && current.width === width && current.rows === wantRows) {
      if (built.current === wantRisk) return;
    }
    built.current = wantRisk;

    const b = layoutBoard(width, wantRows);
    board.current = b;

    // In-flight ornaments belong to the old geometry; refunding is fairer than
    // teleporting them.
    const refund = balls.current.reduce(
      (sum, ball) => sum + (ball.landed ? 0 : ball.stake),
      0,
    );
    if (refund > 0) pay(refund);
    balls.current = [];
    sparks.current = [];
    pops.current = [];
    hits.current.clear();
    bumps.current = [];

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = b.width * dpr;
    canvas.height = b.height * dpr;
    canvas.style.height = `${b.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fit the slot labels once. At 16 rows the slots are narrow and "1000x"
    // overflows a fixed size, so shrink until the longest one fits.
    const labels = payoutsFor(settings.current.risk, b.rows).map(label);
    let size = Math.min(b.slotWidth * 0.36, 15);
    const face = (px: number) =>
      `600 ${px.toFixed(1)}px ui-monospace, Menlo, monospace`;
    ctx.font = face(size);
    const longest = Math.max(...labels.map((l) => ctx.measureText(l).width));
    if (longest > b.slotWidth - 6) size *= (b.slotWidth - 6) / longest;
    slotFont.current = face(size);

    glass.current = ORNAMENTS.map((o) => {
      const r = b.ballRadius;
      const g = ctx.createRadialGradient(
        -r * 0.36,
        -r * 0.42,
        r * 0.06,
        0,
        0,
        r * 1.05,
      );
      g.addColorStop(0, o.hi);
      g.addColorStop(0.45, o.tint);
      g.addColorStop(1, o.dark);
      return g;
    });

    paintBackground(b, dpr);
  }, [paintBackground, pay]);

  // Rebuild when the shape of the board changes, and whenever it is resized.
  // rows and risk are dependencies because relayout reads them off the ref.
  useEffect(() => {
    relayout();
    const observer = new ResizeObserver(relayout);
    const shell = shellRef.current;
    if (shell) observer.observe(shell);
    return () => observer.disconnect();
  }, [relayout, rows, risk]);

  useEffect(() => {
    sound.current = new Sound();
    return () => sound.current?.stop();
  }, []);

  const drop = useCallback(
    (atX?: number) => {
      const b = board.current;
      const stake = settings.current.bet;
      if (!b || stake <= 0 || cash.current < stake) {
        setAuto(false);
        return;
      }
      void sound.current?.wake();
      const from =
        atX === undefined
          ? b.width / 2
          : Math.max(b.width * 0.3, Math.min(b.width * 0.7, atX));
      balls.current.push({
        ...spawnBall(b, from, Math.random),
        glass: Math.floor(Math.random() * ORNAMENTS.length),
        stake,
        fade: 1,
      });
      pay(-stake);
      setDrops((d) => d + 1);
    },
    [pay],
  );

  const land = useCallback(
    (b: Board, slot: number, stake: number) => {
      const mult = payoutsFor(settings.current.risk, b.rows)[slot] ?? 0;
      const payout = stake * mult;
      pay(payout);
      setBest((v) => Math.max(v, mult));
      setHistory((prev) =>
        [{ mult, color: slotColor(slot, b.slots) }, ...prev].slice(0, 16),
      );
      bumps.current[slot] = 1;

      const x = b.slotLeft + (slot + 0.5) * b.slotWidth;
      pops.current.push({
        x,
        y: b.slotTop - 6,
        text: `${mult >= 1 ? '+' : ''}${money(payout - stake)}`,
        color: payout >= stake ? '#4bbf8a' : '#e0453c',
        life: 1,
      });

      if (mult >= 10) {
        sound.current?.play('win', 1, 0.5);
        setFlash(true);
        setTimeout(() => setFlash(false), 90);
        for (let i = 0; i < 40; i++) {
          sparks.current.push({
            x,
            y: b.slotTop,
            vx: (Math.random() - 0.5) * 420,
            vy: -Math.random() * 520 - 60,
            life: 1,
          });
        }
      } else {
        sound.current?.play('peg', 0.62, 0.22);
      }
    },
    [pay],
  );

  // The animation loop. Mounted once; reads everything mutable through refs.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let last = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const b = board.current;
      const layer = background.current;
      if (!b || !layer) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      for (let s = 0; s < SUBSTEPS; s++) {
        for (const ball of balls.current) {
          if (ball.landed) continue;
          const { pegHit, slot } = advanceBall(
            ball,
            b,
            dt / SUBSTEPS,
            Math.random,
          );
          if (pegHit) {
            hits.current.set(pegHit, 1);
            sound.current?.ping(Math.abs(ball.vy));
          }
          if (slot !== null) land(b, slot, ball.stake);
        }
      }

      // Landed ornaments sink into the slot and fade out.
      balls.current = balls.current.filter((ball) => {
        if (!ball.landed) return true;
        ball.y += 260 * dt;
        ball.rot += ball.spin * dt;
        ball.spin *= Math.max(0, 1 - 4 * dt);
        ball.fade -= dt * 2.4;
        return ball.fade > 0;
      });

      for (const [peg, life] of hits.current) {
        const next = life - dt * 5;
        if (next <= 0) hits.current.delete(peg);
        else hits.current.set(peg, next);
      }
      for (let i = 0; i < bumps.current.length; i++) {
        bumps.current[i] = Math.max(0, (bumps.current[i] ?? 0) - dt * 3.2);
      }
      sparks.current = sparks.current.filter((s) => {
        s.vy += 1400 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt * 0.9;
        return s.life > 0;
      });
      pops.current = pops.current.filter((p) => {
        p.y -= 42 * dt;
        p.life -= dt * 1.1;
        return p.life > 0;
      });

      ctx.drawImage(layer, 0, 0, b.width, b.height);

      const labels = payoutsFor(settings.current.risk, b.rows).map(label);
      ctx.font = slotFont.current;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < b.slots; i++) {
        const squash = bumps.current[i] ?? 0;
        const x = b.slotLeft + i * b.slotWidth;
        const y = b.slotTop + squash * 7;
        const h = b.slotHeight - squash * 7;
        ctx.fillStyle = slotColor(i, b.slots);
        ctx.globalAlpha = 0.9;
        roundRect(ctx, x + 1.5, y, b.slotWidth - 3, h, 3);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(12,16,10,0.85)';
        ctx.fillText(labels[i] ?? '', x + b.slotWidth / 2, y + h / 2);
      }

      // Only struck pegs need redrawing; the rest are in the blitted layer.
      ctx.lineWidth = 1.5;
      for (const [peg, life] of hits.current) {
        ctx.beginPath();
        ctx.arc(
          peg.x,
          peg.y,
          b.pegRadius * (1 + (1 - life) * 2.6),
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(216,174,74,${life * 0.5})`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, b.pegRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff4d6';
        ctx.fill();
      }

      const r = b.ballRadius;
      for (const ball of balls.current) {
        ctx.globalAlpha = Math.max(0, Math.min(1, ball.fade));
        ctx.save();
        ctx.translate(ball.x, ball.y);
        ctx.rotate(reduced.matches ? 0 : ball.rot);

        ctx.strokeStyle = '#caa64f';
        ctx.lineWidth = Math.max(1, r * 0.12);
        ctx.beginPath();
        ctx.arc(0, -r * 1.34, r * 0.24, Math.PI * 0.9, Math.PI * 0.1, true);
        ctx.stroke();
        ctx.fillStyle = '#caa64f';
        roundRect(ctx, -r * 0.3, -r * 1.24, r * 0.6, r * 0.46, r * 0.12);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = glass.current[ball.glass] ?? '#d8ae4a';
        ctx.fill();

        // Glass reads as glass because of the hard glint, not the shading.
        ctx.beginPath();
        ctx.ellipse(
          -r * 0.36,
          -r * 0.4,
          r * 0.27,
          r * 0.15,
          -0.7,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fill();

        ctx.restore();
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = '#f4d98a';
      for (const s of sparks.current) {
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillRect(s.x, s.y, 2.5, 2.5);
      }
      ctx.globalAlpha = 1;

      ctx.font = '600 14px ui-monospace, Menlo, monospace';
      for (const p of pops.current) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [land]);

  // Auto play, and hold-space for a run.
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => drop(), 260);
    return () => clearInterval(id);
  }, [auto, drop]);

  useEffect(() => {
    let held = false;
    const down = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      if (e.target instanceof HTMLInputElement) return;
      e.preventDefault();
      if (!held) drop();
      held = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') held = false;
    };
    const repeat = setInterval(() => held && drop(), 140);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      clearInterval(repeat);
    };
  }, [drop]);

  const broke = balance < bet;
  const profit = balance - staked;

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4">
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Balance" value={money(balance)} className="text-primary" />
        <Stat
          label="Session"
          value={`${profit >= 0 ? '+' : ''}${money(profit)}`}
          className={
            profit > 0 ? 'text-chart-4' : profit < 0 ? 'text-destructive' : ''
          }
        />
        <Stat label="Best hit" value={best ? `${best}x` : '—'} />
        <Stat label="Drops" value={String(drops)} />
      </dl>

      <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Stake
            </span>
            <div className="flex gap-1">
              <input
                type="text"
                inputMode="decimal"
                aria-label="Stake"
                value={money(bet)}
                onChange={(e) => {
                  const v = Number.parseFloat(
                    e.target.value.replace(/[^0-9.]/g, ''),
                  );
                  setBet(Number.isFinite(v) && v > 0 ? Math.min(v, 10000) : 1);
                }}
                className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1 font-mono text-sm tabular-nums"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBet((b) => Math.max(0.1, b / 2))}
              >
                ½
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBet((b) => Math.min(b * 2, balance || 0.1))}
              >
                2×
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBet(Math.max(0.1, balance))}
              >
                Max
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Risk
            </span>
            <div className="flex gap-1" role="group" aria-label="Risk">
              {RISKS.map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={risk === r ? 'default' : 'outline'}
                  aria-pressed={risk === r}
                  className="flex-1 capitalize"
                  onClick={() => setRisk(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="plinko-rows"
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              Rows · <span className="font-mono text-primary">{rows}</span>
            </label>
            <input
              id="plinko-rows"
              type="range"
              min={MIN_ROWS}
              max={MAX_ROWS}
              step={1}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <Button
            size="lg"
            onClick={() => {
              if (broke) {
                pay(REBUY);
                setStaked((v) => v + REBUY);
              } else {
                drop();
              }
            }}
          >
            {broke ? `Re-buy ${money(REBUY)}` : 'Drop 🎄'}
          </Button>
          <Button
            variant={auto ? 'destructive' : 'outline'}
            aria-pressed={auto}
            onClick={() => setAuto((a) => !a)}
          >
            {auto ? 'Stop' : 'Auto play'}
          </Button>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-pressed={!muted}
              aria-label={muted ? 'Unmute effects' : 'Mute effects'}
              onClick={() => {
                const next = !muted;
                setMuted(next);
                if (sound.current) sound.current.enabled = !next;
                if (!next) void sound.current?.wake();
              }}
            >
              {muted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-pressed={bandOn}
              aria-label="House band"
              onClick={() => setBandOn(sound.current?.toggleBand() ?? false)}
            >
              <Music className={cn('size-4', bandOn && 'text-primary')} />
            </Button>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            <kbd className="rounded border px-1 py-0.5 font-mono text-[0.7rem]">
              Space
            </kbd>{' '}
            drops — hold it down for a run. The edges pay, the middle bleeds.
          </p>
        </Card>

        <div className="flex min-w-0 flex-col gap-2">
          <div
            ref={shellRef}
            className="relative overflow-hidden rounded-lg p-1.5"
            style={{
              background:
                'linear-gradient(160deg, #8d7233, rgba(64,51,20,0.5) 40%, #8d7233)',
            }}
          >
            <canvas
              ref={canvasRef}
              aria-label="Plinko board"
              className="block w-full cursor-pointer rounded-md"
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                drop(
                  ((e.clientX - rect.left) / rect.width) *
                    (board.current?.width ?? 0),
                );
              }}
            />
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-1.5 rounded-md opacity-0 transition-opacity',
                flash ? 'opacity-80 duration-75' : 'duration-700',
              )}
              style={{ boxShadow: 'inset 0 0 90px 10px #d8ae4a' }}
            />
          </div>

          <div
            className="flex min-h-8 gap-1 overflow-x-auto pb-1"
            aria-live="polite"
            aria-label="Recent multipliers"
          >
            {history.map((h, i) => (
              <span
                key={`${h.mult}-${i}`}
                className="shrink-0 rounded-full px-2 py-1 font-mono text-xs font-semibold text-[#10100a] tabular-nums"
                style={{ background: h.color, opacity: 1 - i * 0.045 }}
              >
                {h.mult}x
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label: name,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <Card className="gap-0.5 p-3">
      <dt className="text-[0.625rem] font-medium tracking-widest text-muted-foreground uppercase">
        {name}
      </dt>
      <dd className={cn('font-mono text-lg tabular-nums', className)}>
        {value}
      </dd>
    </Card>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
