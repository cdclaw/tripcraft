import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Itinerary from '@/components/Itinerary';
import type { Itinerary as ItineraryType } from '@/lib/ai';

interface TripData {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  adults: number;
  kids_ages: number[];
  budget: string;
  itinerary: ItineraryType;
}

async function getTrip(id: string): Promise<TripData | null> {
  try {
    // During build, use direct DB access; at runtime use full URL
    if (process.env.NODE_ENV === 'production' || typeof window === 'undefined') {
      // Server-side: import DB directly to avoid needing a running server
      const { getTrip: dbGetTrip } = await import('@/lib/db');
      const record = dbGetTrip(id);
      if (!record) return null;
      return {
        id: record.id,
        destination: record.destination,
        start_date: record.start_date,
        end_date: record.end_date,
        adults: record.adults,
        kids_ages: JSON.parse(record.kids_ages),
        budget: record.budget,
        itinerary: JSON.parse(record.itinerary),
      };
    }
    return null;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TripPage({ params }: PageProps) {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    notFound();
  }

  const numDays = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const budgetLabel: Record<string, string> = {
    budget: 'Budget',
    moderate: 'Moderate',
    luxury: 'Luxury',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFF8F0' }}>
      <Header />

      {/* Destination hero banner */}
      <div
        className="w-full py-14 px-6 text-center"
        style={{ backgroundColor: '#1A1A2E' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FF6B6B' }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: '#FF6B6B20', color: '#FF6B6B' }}
            >
              Your Family Itinerary
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {trip.itinerary.destination}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span
              className="px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: '#ffffff15', color: '#ffffffcc' }}
            >
              📅 {numDays} {numDays === 1 ? 'day' : 'days'}
            </span>
            <span
              className="px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: '#ffffff15', color: '#ffffffcc' }}
            >
              👨‍👩‍👧 {trip.adults} adult{trip.adults > 1 ? 's' : ''}
              {trip.kids_ages.length > 0 && ` · ${trip.kids_ages.length} kid${trip.kids_ages.length > 1 ? 's' : ''}`}
            </span>
            <span
              className="px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: '#ffffff15', color: '#ffffffcc' }}
            >
              💰 {budgetLabel[trip.budget] || trip.budget}
            </span>
            <span
              className="px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: '#ffffff15', color: '#ffffffcc' }}
            >
              {new Date(trip.start_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' – '}
              {new Date(trip.end_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <Itinerary itinerary={trip.itinerary} tripId={trip.id} />
      </main>

      <Footer />
    </div>
  );
}
