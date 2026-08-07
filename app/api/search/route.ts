import { type NextRequest, NextResponse } from 'next/server';
import { currentViewer } from '@/lib/auth/viewer';
import db from '@/lib/db/client';
import {
  visiblePeopleWhere,
  visibleWishesWhere,
  visibleWishlistsWhere,
} from '@/lib/db/visibility';

export const dynamic = 'force-dynamic';

type SearchItem = {
  id: string;
  type: 'user' | 'gift' | 'wishlist';
  title: string;
  subtitle?: string | null;
  href: string;
};

export async function GET(req: NextRequest) {
  const viewer = await currentViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2) {
    return NextResponse.json({ users: [], gifts: [], wishlists: [] });
  }

  const userId = viewer.id;
  const contains = { contains: q, mode: 'insensitive' } as const;

  const [users, gifts, wishlists] = await Promise.all([
    db.user.findMany({
      select: { id: true, name: true, email: true },
      where: {
        AND: [
          // Search used to restate both the membership rule and the year
          // window; both now come from the policy module.
          { OR: [{ id: userId }, visiblePeopleWhere(userId)] },
          { OR: [{ name: contains }, { email: contains }] },
        ],
      },
      orderBy: [{ name: 'asc' }],
      take: 12,
    }),
    db.wish.findMany({
      select: {
        id: true,
        name: true,
        claimers: { where: { userId }, select: { userId: true } },
        subject: { select: { id: true, name: true, email: true } },
      },
      where: {
        AND: [
          visibleWishesWhere(userId),
          {
            OR: [
              { name: contains },
              { description: contains },
              { url: contains },
              { subject: { OR: [{ name: contains }, { email: contains }] } },
            ],
          },
        ],
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 12,
    }),
    db.wishlist.findMany({
      select: { id: true, name: true, _count: { select: { members: true } } },
      where: { AND: [visibleWishlistsWhere(userId), { name: contains }] },
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
    // Only the viewer's own claim is selected, so this cannot surface someone
    // else's — including to the person the gift is for.
    subtitle: `For ${g.subject.name || g.subject.email}${
      g.claimers.length > 0 ? ' • claimed by you' : ''
    }`,
    href: `/gifts/${g.id}`,
  }));

  const wishlistItems: SearchItem[] = wishlists.map((w) => ({
    id: w.id,
    type: 'wishlist',
    title: w.name,
    subtitle: `${w._count.members} member${w._count.members === 1 ? '' : 's'}`,
    href: `/wishlists#wishlist-${w.id}`,
  }));

  return NextResponse.json({
    users: userItems,
    gifts: giftItems,
    wishlists: wishlistItems,
  });
}
