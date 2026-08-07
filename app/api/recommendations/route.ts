import { NextResponse } from 'next/server';
import { recommendWishesAsList } from '@/lib/ai';
import { currentViewer } from '@/lib/auth/viewer';

export async function POST() {
  const viewer = await currentViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const recommendations = await recommendWishesAsList({
    personId: viewer.id,
    viewerId: viewer.id,
  });
  return NextResponse.json({ recommendations });
}
