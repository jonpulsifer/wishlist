import { type NextRequest, NextResponse } from 'next/server';
import { recommendWishesAsProse } from '@/lib/ai';
import { currentViewer } from '@/lib/auth/viewer';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const viewer = await currentViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  }

  try {
    // Scoped to the viewer: this route used to accept any user id and return
    // that person's gifts to anyone who was merely signed in.
    const recommendations = await recommendWishesAsProse({
      personId: userId,
      viewerId: viewer.id,
    });
    if (recommendations === null) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 },
    );
  }
}
