import { NextResponse } from 'next/server';

import prisma from '@/lib/db/client';

export async function GET() {
  const gifts = await prisma.wish.count();
  const users = await prisma.user.count();
  const claimed = await prisma.wish.count({
    where: { claimers: { some: {} } },
  });
  return NextResponse.json(
    { gifts, users, claimed },
    {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    },
  );
}
