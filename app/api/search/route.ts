import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import db from '@/lib/db/client';

export const dynamic = 'force-dynamic';

type SearchItem = {
  id: string;
  type: 'user' | 'gift' | 'wishlist';
  title: string;
  subtitle?: string | null;
  href: string;
};

function currentYearFilter() {
  const year = new Date().getFullYear();
  return {
    createdAt: {
      gte: new Date(`${year - 2}-01-01`),
      lt: new Date(`${year + 1}-01-01`),
    },
  } as const;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2) {
    return NextResponse.json({ users: [], gifts: [], wishlists: [] });
  }

  const userId = session.user.id;
  const yearFilter = currentYearFilter();

  const [users, gifts, wishlists] = await Promise.all([
    db.user.findMany({
      select: { id: true, name: true, email: true },
      where: {
        AND: [
          {
            OR: [
              { id: userId },
              {
                wishlists: {
                  some: {
                    members: { some: { id: userId } },
                  },
                },
              },
            ],
          },
          {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy: [{ name: 'asc' }],
      take: 10,
    }),
    db.gift.findMany({
      select: {
        id: true,
        name: true,
        claimed: true,
        owner: { select: { id: true, name: true, email: true } },
      },
      where: {
        archived: false,
        ...yearFilter,
        wishlists: {
          some: {
            members: { some: { id: userId } },
          },
        },
        OR: [
          { claimed: false },
          { claimedById: userId },
          { createdById: userId },
        ],
        AND: [
          {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { url: { contains: q, mode: 'insensitive' } },
              {
                owner: {
                  OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                  ],
                },
              },
            ],
          },
        ],
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 12,
    }),
    db.wishlist.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { members: true } },
        members: { where: { id: userId }, select: { id: true } },
      },
      where: {
        name: { contains: q, mode: 'insensitive' },
      },
      orderBy: [{ name: 'asc' }],
      take: 10,
    }),
  ]);

  const userItems: SearchItem[] = users.map((u) => ({
    id: u.id,
    type: 'user',
    title:
      u.id === userId
        ? u.name
          ? `${u.name} (you)`
          : 'You'
        : u.name || u.email,
    subtitle: u.name ? u.email : null,
    href: u.id === userId ? '/people/me' : `/people/${u.id}`,
  }));

  const giftItems: SearchItem[] = gifts.map((g) => ({
    id: g.id,
    type: 'gift',
    title: g.name,
    subtitle: `For ${g.owner.name || g.owner.email}${g.claimed ? ' • claimed' : ''}`,
    href: `/gifts/${g.id}`,
  }));

  const wishlistItems: SearchItem[] = wishlists.map((w) => {
    const isMember = w.members.length > 0;
    return {
      id: w.id,
      type: 'wishlist',
      title: w.name,
      subtitle: isMember
        ? `${w._count.members} member${w._count.members === 1 ? '' : 's'}`
        : 'Private wishlist • Enter PIN to join',
      href: `/wishlists#wishlist-${w.id}`,
    };
  });

  return NextResponse.json({
    users: userItems,
    gifts: giftItems,
    wishlists: wishlistItems,
  });
}
