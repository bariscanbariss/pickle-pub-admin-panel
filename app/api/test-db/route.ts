import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.products.count();
    return NextResponse.json({ success: true, count, env: !!process.env.DATABASE_URL });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack, env: !!process.env.DATABASE_URL }, { status: 500 });
  }
}
