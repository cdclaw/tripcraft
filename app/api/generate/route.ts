import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generateItinerary } from '@/lib/ai';
import { saveTrip, countTripsFromIp } from '@/lib/db';
import type { TripInput } from '@/lib/prompts';

const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 3600;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limiting
  try {
    const count = countTripsFromIp(ip, RATE_WINDOW_SECONDS);
    if (count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can generate up to 10 trips per hour.' },
        { status: 429 }
      );
    }
  } catch {
    // If DB fails for rate check, allow through
  }

  let body: TripInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate required fields
  if (!body.destination || !body.startDate || !body.endDate) {
    return NextResponse.json(
      { error: 'Missing required fields: destination, startDate, endDate' },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured. Please add ANTHROPIC_API_KEY to your environment.' },
      { status: 500 }
    );
  }

  try {
    const itinerary = await generateItinerary(body);
    const id = uuidv4();

    await saveTrip({
      id,
      destination: body.destination,
      start_date: body.startDate,
      end_date: body.endDate,
      adults: body.adults,
      kids_ages: JSON.stringify(body.kidsAges || []),
      budget: body.budget,
      interests: JSON.stringify(body.interests || []),
      nap_start: body.napStart || null,
      nap_end: body.napEnd || null,
      itinerary: JSON.stringify(itinerary),
      email: null,
      ip_address: ip,
    });

    return NextResponse.json({ id, itinerary });
  } catch (error) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate itinerary';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
