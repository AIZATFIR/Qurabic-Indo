import { NextResponse } from 'next/server';

// Retired: saved clients must not receive synthesized speech from this endpoint.
export async function GET() {
  return NextResponse.json(
    { error: 'Synthetic translation audio has been removed. Only human recordings are supported.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );
}
