import { NextResponse } from 'next/server';
import { getRecommendationsForHomePage } from '@/lib/ai';
import { currentViewer } from '@/lib/auth/viewer';

export async function POST() {
  const viewer = await currentViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const recommendations = await getRecommendationsForHomePage(
    viewer.id,
    viewer.id,
  );
  return NextResponse.json({ recommendations });
}
