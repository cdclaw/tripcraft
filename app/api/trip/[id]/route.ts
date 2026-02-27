import { NextRequest, NextResponse } from 'next/server';
import { getTrip, saveEmail } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const trip = getTrip(id);

  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: trip.id,
    destination: trip.destination,
    start_date: trip.start_date,
    end_date: trip.end_date,
    adults: trip.adults,
    kids_ages: JSON.parse(trip.kids_ages),
    budget: trip.budget,
    interests: JSON.parse(trip.interests),
    nap_start: trip.nap_start,
    nap_end: trip.nap_end,
    itinerary: JSON.parse(trip.itinerary),
    created_at: trip.created_at,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const trip = getTrip(id);
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }

  let body: { email: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.email || !body.email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  try {
    saveEmail(id, body.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email save error:', error);
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
  }
}
