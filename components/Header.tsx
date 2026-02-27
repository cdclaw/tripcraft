import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF6B6B' }}>
            <span className="text-white font-bold text-sm">TC</span>
          </div>
          <span className="font-bold text-lg" style={{ color: '#1A1A2E' }}>
            TripCraft
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/#how-it-works"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/#features"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Features
          </Link>
        </nav>

        <Link href="/plan">
          <Button
            size="sm"
            className="text-white font-semibold shadow-sm"
            style={{ backgroundColor: '#FF6B6B' }}
          >
            Plan a trip
          </Button>
        </Link>
      </div>
    </header>
  );
}
