import { NextResponse } from 'next/server';
import { getSession } from '@/app/auth';
import { getUsersForPeoplePage } from '@/lib/db/queries-cached';

export async function GET() {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
