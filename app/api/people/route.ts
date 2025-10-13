import { NextResponse } from 'next/server';
import { getSession } from '@/app/auth';
import { getUsersForPeoplePage } from '@/lib/db/queries-cached';
import db from '@/lib/db/client';

const CURRENT_YEAR = new Date().getFullYear();
const currentYearFilter = {
  createdAt: {
    gte: new Date(`${CURRENT_YEAR - 2}-01-01`),
    lt: new Date(`${CURRENT_YEAR + 1}-01-01`),
  },
};

export async function GET(request: Request) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if we should include the current user (for Secret Santa)
    const { searchParams } = new URL(request.url);
    const includeCurrentUser = searchParams.get('includeCurrentUser') === 'true';

    if (includeCurrentUser) {
      // Fetch all users in the same wishlists as the current user, including the current user
      const people = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          _count: {
            select: {
              gifts: {
                where: {
                  ...currentYearFilter,
                  AND: {
                    OR: [
                      { claimed: false },
                      {
                        claimed: true,
                        claimedBy: {
                          id: user.id,
                        },
                      },
                      { createdBy: { id: user.id } },
                    ],
                  },
                },
              },
            },
          },
        },
        where: {
          wishlists: {
            some: {
              members: { some: { id: user.id } },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      return NextResponse.json(people);
    }

    const people = await getUsersForPeoplePage(user.id);
    return NextResponse.json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 },
    );
  }
}
