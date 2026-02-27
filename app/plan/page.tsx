import TripForm from '@/components/TripForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Plan Your Trip — TripCraft',
  description: 'Build your AI-powered family itinerary in 30 seconds.',
};

export default function PlanPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFF8F0' }}>
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        {/* Page header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: '#FF6B6B20', color: '#FF6B6B' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered planning
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: '#1A1A2E' }}>
            Plan your family trip
          </h1>
          <p className="text-base" style={{ color: '#1A1A2E66' }}>
            Fill in the details and we&apos;ll generate a complete day-by-day itinerary in seconds.
          </p>
        </div>

        <TripForm />
      </main>

      <Footer />
    </div>
  );
}
