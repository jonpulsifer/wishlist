import { NextResponse } from 'next/server';
import { getSession } from '@/app/auth';
import { getUsersForPeoplePage } from '@/lib/db/queries-cached';

export async function GET(request: Request) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const includeSelf = url.searchParams.get('includeSelf');

    const people = await getUsersForPeoplePage(user.id);

    // Optionally include the current user in the response for use-cases
    // like Secret Santa where the creator should be selectable as a participant
    if (includeSelf && includeSelf !== '0' && includeSelf !== 'false') {
      const alreadyIncluded = people.some((p) => p.id === user.id);
      if (!alreadyIncluded) {
        people.push({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          // Provide a minimal _count shape; callers that care about counts
          // should compute them separately. Secret Santa UI doesn't use it.
          _count: { gifts: 0 },
        } as any);
      }
    }

    return NextResponse.json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 },
    );
  }
}
