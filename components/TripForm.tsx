'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Calendar, DollarSign, Moon, Plus, X, Loader2 } from 'lucide-react';

const INTERESTS = [
  { id: 'culture', label: 'Culture & History' },
  { id: 'food', label: 'Food & Dining' },
  { id: 'nature', label: 'Nature & Outdoors' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'relaxation', label: 'Relaxation' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'nightlife', label: 'Nightlife' },
];

export default function TripForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [kidsAges, setKidsAges] = useState<number[]>([]);
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [interests, setInterests] = useState<string[]>(['culture', 'food']);
  const [napStart, setNapStart] = useState('13:00');
  const [napEnd, setNapEnd] = useState('15:00');

  const hasYoungKids = kidsAges.some(age => age < 5);

  function addKid() {
    setKidsAges(prev => [...prev, 5]);
  }

  function removeKid(index: number) {
    setKidsAges(prev => prev.filter((_, i) => i !== index));
  }

  function updateKidAge(index: number, age: number) {
    setKidsAges(prev => prev.map((a, i) => (i === index ? age : a)));
  }

  function toggleInterest(id: string) {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!destination.trim()) {
      setError('Please enter a destination.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date.');
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          destination: destination.trim(),
          startDate,
          endDate,
          adults,
          kidsAges,
          budget,
          interests,
          napStart: hasYoungKids ? napStart : undefined,
          napEnd: hasYoungKids ? napEnd : undefined,
        }),
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      router.push(`/trip/${data.id}`);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out after 2 minutes. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      }
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Destination */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B6B15', color: '#FF6B6B' }}>
            <MapPin className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>Where are you going?</h2>
        </div>
        <input
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="e.g. Barcelona, Spain"
          className="w-full px-4 py-3 rounded-xl border text-base outline-none transition-colors"
          style={{ borderColor: '#1A1A2E20', color: '#1A1A2E' }}
          onFocus={e => (e.target.style.borderColor = '#FF6B6B')}
          onBlur={e => (e.target.style.borderColor = '#1A1A2E20')}
        />
      </div>

      {/* Dates */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B6B15', color: '#FF6B6B' }}>
            <Calendar className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>When are you traveling?</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#1A1A2E66' }}>Start date</label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
              style={{ borderColor: '#1A1A2E20', color: '#1A1A2E' }}
              onFocus={e => (e.target.style.borderColor = '#FF6B6B')}
              onBlur={e => (e.target.style.borderColor = '#1A1A2E20')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#1A1A2E66' }}>End date</label>
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
              style={{ borderColor: '#1A1A2E20', color: '#1A1A2E' }}
              onFocus={e => (e.target.style.borderColor = '#FF6B6B')}
              onBlur={e => (e.target.style.borderColor = '#1A1A2E20')}
            />
          </div>
        </div>
      </div>

      {/* Travelers */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B6B15', color: '#FF6B6B' }}>
            <Users className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>Who&apos;s coming?</h2>
        </div>

        {/* Adults */}
        <div className="mb-5">
          <label className="block text-xs font-medium mb-2" style={{ color: '#1A1A2E66' }}>Adults</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAdults(a => Math.max(1, a - 1))}
              className="w-9 h-9 rounded-full border flex items-center justify-center text-lg font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: '#1A1A2E20', color: '#1A1A2E' }}
            >
              −
            </button>
            <span className="text-xl font-bold w-8 text-center" style={{ color: '#1A1A2E' }}>{adults}</span>
            <button
              type="button"
              onClick={() => setAdults(a => Math.min(6, a + 1))}
              className="w-9 h-9 rounded-full border flex items-center justify-center text-lg font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: '#1A1A2E20', color: '#1A1A2E' }}
            >
              +
            </button>
          </div>
        </div>

        {/* Kids */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium" style={{ color: '#1A1A2E66' }}>Children</label>
            <button
              type="button"
              onClick={addKid}
              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              style={{ backgroundColor: '#FF6B6B15', color: '#FF6B6B' }}
            >
              <Plus className="w-3 h-3" />
              Add child
            </button>
          </div>
          {kidsAges.length === 0 ? (
            <p className="text-sm" style={{ color: '#1A1A2E40' }}>No children added</p>
          ) : (
            <div className="space-y-2">
              {kidsAges.map((age, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: '#1A1A2E66' }}>Child {i + 1} age:</span>
                  <select
                    value={age}
                    onChange={e => updateKidAge(i, Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#1A1A2E20', color: '#1A1A2E' }}
                  >
                    {Array.from({ length: 18 }, (_, n) => (
                      <option key={n} value={n}>{n === 0 ? 'Under 1' : `${n} year${n > 1 ? 's' : ''}`}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeKid(i)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-red-50"
                    style={{ color: '#FF6B6B' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Budget */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B6B15', color: '#FF6B6B' }}>
            <DollarSign className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>What&apos;s your budget?</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'budget', label: 'Budget', desc: 'Under $100/day food' },
            { value: 'moderate', label: 'Moderate', desc: '$100–$250/day food' },
            { value: 'luxury', label: 'Luxury', desc: '$250+/day food' },
          ] as const).map(b => (
            <button
              key={b.value}
              type="button"
              onClick={() => setBudget(b.value)}
              className="rounded-xl p-3 border-2 text-left transition-all"
              style={{
                borderColor: budget === b.value ? '#FF6B6B' : '#1A1A2E10',
                backgroundColor: budget === b.value ? '#FF6B6B08' : 'transparent',
              }}
            >
              <p className="text-sm font-semibold" style={{ color: budget === b.value ? '#FF6B6B' : '#1A1A2E' }}>{b.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#1A1A2E60' }}>{b.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: '#FF6B6B15' }}>
            ✦
          </div>
          <h2 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>What are your interests?</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
              style={{
                borderColor: interests.includes(interest.id) ? '#FF6B6B' : '#1A1A2E15',
                backgroundColor: interests.includes(interest.id) ? '#FF6B6B' : 'transparent',
                color: interests.includes(interest.id) ? 'white' : '#1A1A2E',
              }}
            >
              {interest.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nap window — only if young kids */}
      {hasYoungKids && (
        <div
          className="rounded-2xl p-6 border-2"
          style={{ backgroundColor: '#fcb69f15', borderColor: '#FF6B6B30' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B6B20', color: '#FF6B6B' }}>
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>Nap window</h2>
              <p className="text-xs" style={{ color: '#1A1A2E66' }}>We&apos;ll block this time for hotel rest — no rushed returns</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#1A1A2E66' }}>Nap starts</label>
              <input
                type="time"
                value={napStart}
                onChange={e => setNapStart(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#FF6B6B40', backgroundColor: 'white', color: '#1A1A2E' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#1A1A2E66' }}>Nap ends</label>
              <input
                type="time"
                value={napEnd}
                onChange={e => setNapEnd(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#FF6B6B40', backgroundColor: 'white', color: '#1A1A2E' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#FF6B6B15', color: '#FF6B6B', border: '1px solid #FF6B6B30' }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
        style={{ backgroundColor: '#FF6B6B', color: 'white' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Crafting your itinerary...
          </>
        ) : (
          'Generate My Itinerary ✦'
        )}
      </button>

      {loading && (
        <div className="text-center">
          <p className="text-sm" style={{ color: '#1A1A2E66' }}>
            This usually takes 10–20 seconds. Hang tight!
          </p>
        </div>
      )}
    </form>
  );
}
