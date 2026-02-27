import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A2E' }} className="text-gray-400 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FF6B6B' }}
            >
              <span className="text-white font-bold text-xs">TC</span>
            </div>
            <span className="text-white font-semibold">TripCraft</span>
          </div>

          <p className="text-sm text-center">
            AI-powered family trip planning. Your adventure, crafted in seconds.
          </p>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/plan" className="hover:text-white transition-colors">
              Plan a trip
            </Link>
            <span className="text-gray-600">·</span>
            <span className="text-gray-500">
              © {new Date().getFullYear()} TripCraft
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
