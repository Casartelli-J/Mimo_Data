import { NextResponse } from 'next/server';
import { isConfigured } from '@/lib/supabase/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', database_configured: isConfigured(), version: '1.0.0' }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
