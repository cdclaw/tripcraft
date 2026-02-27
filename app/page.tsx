import Link from 'next/link';
import { MapPin, Moon, Gem, DollarSign, Star, ArrowRight, Users, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFF8F0' }}>
      <Header />

      {/* Hero */}
      <section className="px-6 pt-16 pb-24 text-center max-w-4xl mx-auto w-full">
        <div
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          style={{ backgroundColor: '#FF6B6B20', color: '#FF6B6B' }}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          500+ family trips planned this month
        </div>

        <h1
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight"
          style={{ color: '#1A1A2E' }}
        >
          Your family trip,{' '}
          <span style={{ color: '#FF6B6B' }}>planned in 30 seconds</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#1A1A2E99' }}>
          AI-powered itineraries with nap optimization, hidden gems, and real budget estimates.
          Just tell us where you&apos;re going — we&apos;ll handle the rest.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/plan"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ backgroundColor: '#FF6B6B', color: 'white' }}
          >
            Plan My Trip Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm" style={{ color: '#1A1A2E66' }}>No sign-up required</p>
        </div>

        {/* Hero visual */}
        <div className="mt-16 relative max-w-lg mx-auto pb-6">
          <div
            className="rounded-3xl p-8 text-left shadow-2xl"
            style={{ backgroundColor: '#1A1A2E' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B6B' }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Barcelona Family Trip</p>
                <p className="text-sm" style={{ color: '#ffffff66' }}>5 days · 2 adults · 2 kids (ages 3 &amp; 7)</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { time: '9:00 AM', name: 'Park Güell', gem: true, nap: false },
                { time: '12:30 PM', name: 'Lunch at Barceloneta Beach', gem: false, nap: false },
                { time: '2:00 PM', name: 'Nap Time / Hotel Rest', gem: false, nap: true },
                { time: '4:30 PM', name: 'Gothic Quarter Walk', gem: true, nap: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{
                    backgroundColor: item.nap ? '#fcb69f33' : '#ffffff0d',
                    borderLeft: item.nap ? '3px solid #FF6B6B' : '3px solid transparent',
                  }}
                >
                  <span className="text-xs font-mono w-16 flex-shrink-0" style={{ color: '#ffffff66' }}>{item.time}</span>
                  <span className="text-sm text-white flex-1">{item.name}</span>
                  {item.gem && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#FF6B6B22', color: '#FF6B6B' }}>✦ gem</span>
                  )}
                  {item.nap && (
                    <span className="text-xs" style={{ color: '#FF6B6B' }}>😴</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: '#1A1A2E' }}>
          Built for families who actually travel
        </h2>
        <p className="text-center mb-14 text-lg" style={{ color: '#1A1A2E66' }}>
          Not another generic trip planner
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Moon className="w-6 h-6" />,
              title: 'Nap-Optimized',
              description: "Tell us your little one's nap window. We block that time for hotel rest so you're never rushing back with an overtired toddler.",
              color: '#a78bfa',
              bg: '#a78bfa15',
            },
            {
              icon: <Gem className="w-6 h-6" />,
              title: 'Hidden Gems',
              description: "Every itinerary blends must-see spots with secret local favorites — the places guidebooks miss and locals treasure.",
              color: '#FF6B6B',
              bg: '#FF6B6B15',
            },
            {
              icon: <DollarSign className="w-6 h-6" />,
              title: 'Budget-Smart',
              description: "Real daily food budgets broken down by meal. Choose budget, moderate, or luxury and get honest, specific estimates.",
              color: '#34d399',
              bg: '#34d39915',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border"
              style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A2E' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#1A1A2E80' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 w-full" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            From idea to itinerary in seconds
          </h2>
          <p className="mb-14" style={{ color: '#ffffff66' }}>Seriously, it&apos;s that fast</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <MapPin className="w-5 h-5" />, title: 'Tell us your trip', desc: "Destination, dates, who's coming, and your budget level." },
              { step: '02', icon: <Users className="w-5 h-5" />, title: 'Add your family', desc: "Kid ages, nap windows, and interests — culture, food, adventure, or all of it." },
              { step: '03', icon: <Calendar className="w-5 h-5" />, title: 'Get your itinerary', desc: "A full day-by-day plan with activities, restaurants, hotel zones, and budget breakdowns." },
            ].map((s, i) => (
              <div key={i} className="text-left">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-black" style={{ color: '#FF6B6B22' }}>{s.step}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B6B', color: 'white' }}>
                    {s.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                <p className="text-sm" style={{ color: '#ffffff66' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full text-center">
        <div className="grid grid-cols-3 gap-8 mb-16">
          {[
            { stat: '500+', label: 'Trips planned' },
            { stat: '30s', label: 'Avg generation time' },
            { stat: '4.9★', label: 'Average rating' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-black mb-1" style={{ color: '#FF6B6B' }}>{s.stat}</div>
              <div className="text-sm font-medium" style={{ color: '#1A1A2E80' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              quote: "We used TripCraft for our Rome trip with a 2-year-old. The nap scheduling alone was worth it — no more mid-sightseeing meltdowns.",
              name: 'Sarah M.',
              detail: 'Rome with a toddler',
            },
            {
              quote: "I was blown away by the hidden gems it found in Kyoto. Places I never would have found on my own. My kids loved every single one.",
              name: 'David L.',
              detail: 'Kyoto family adventure',
            },
          ].map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-left border"
              style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" style={{ color: '#FF6B6B' }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#1A1A2E' }}>&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{t.name}</p>
                <p className="text-xs" style={{ color: '#1A1A2E66' }}>{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center w-full" style={{ backgroundColor: '#FF6B6B' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to plan your best family trip yet?
        </h2>
        <p className="text-lg mb-8" style={{ color: '#ffffff99' }}>
          Free, instant, no sign-up required
        </p>
        <Link
          href="/plan"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
          style={{ backgroundColor: '#1A1A2E', color: 'white' }}
        >
          Plan My Family Trip
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
