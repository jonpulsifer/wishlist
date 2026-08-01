import { NextResponse } from 'next/server';
import { recommendGiftsAsList } from '@/lib/ai';
import { currentViewer } from '@/lib/auth/viewer';

export async function POST() {
  const viewer = await currentViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const recommendations = await recommendGiftsAsList({
    personId: viewer.id,
    viewerId: viewer.id,
  });
  return NextResponse.json({ recommendations });
}
