'use client';

import { useState } from 'react';
import { Itinerary as ItineraryType } from '@/lib/ai';
import DayCard from './DayCard';
import { Hotel, DollarSign, Share2, Check, Mail, Loader2, Backpack, Lightbulb } from 'lucide-react';

interface ItineraryProps {
  itinerary: ItineraryType;
  tripId: string;
}

export default function Itinerary({ itinerary, tripId }: ItineraryProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  async function handleShare() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError('');
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email.');
      return;
    }
    setEmailLoading(true);
    try {
      const res = await fetch(`/api/trip/${tripId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      setEmailSubmitted(true);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
      >
        <p className="text-base leading-relaxed" style={{ color: '#1A1A2E80' }}>
          {itinerary.summary}
        </p>
      </div>

      {/* Hotel zone + Food budget */}
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#34d39915', color: '#059669' }}
            >
              <Hotel className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>Recommended Hotel Zone</h3>
          </div>
          <p className="text-xl font-bold mb-1" style={{ color: '#1A1A2E' }}>
            {itinerary.hotelZone.recommended}
          </p>
          <p className="text-sm mb-2" style={{ color: '#1A1A2E66' }}>
            {itinerary.hotelZone.reason}
          </p>
          <div
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: '#34d39920', color: '#059669' }}
          >
            {itinerary.hotelZone.priceRange}
          </div>
        </div>

        <div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#f59e0b15', color: '#d97706' }}
            >
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>Daily Food Budget</h3>
          </div>
          <p className="text-xl font-bold mb-1" style={{ color: '#1A1A2E' }}>
            {itinerary.dailyFoodBudget.currency} {itinerary.dailyFoodBudget.amount}
            <span className="text-sm font-normal ml-1" style={{ color: '#1A1A2E66' }}>/ day</span>
          </p>
          <p className="text-sm" style={{ color: '#1A1A2E66' }}>
            {itinerary.dailyFoodBudget.breakdown}
          </p>
        </div>
      </div>

      {/* Share button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
          Your Itinerary
        </h2>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all"
          style={{
            borderColor: copied ? '#34d399' : '#1A1A2E20',
            color: copied ? '#059669' : '#1A1A2E',
            backgroundColor: copied ? '#34d39910' : 'white',
          }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Link copied!' : 'Share trip'}
        </button>
      </div>

      {/* Day cards */}
      <div className="space-y-6">
        {itinerary.days.map((day, i) => (
          <DayCard key={day.dayNumber} day={day} isFirst={i === 0} />
        ))}
      </div>

      {/* Packing tips */}
      {itinerary.packingTips && itinerary.packingTips.length > 0 && (
        <div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FF6B6B15', color: '#FF6B6B' }}
            >
              <Backpack className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg" style={{ color: '#1A1A2E' }}>Packing Tips</h3>
          </div>
          <ul className="space-y-2">
            {itinerary.packingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#1A1A2E80' }}>
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ backgroundColor: '#FF6B6B15', color: '#FF6B6B' }}>
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General tips */}
      {itinerary.generalTips && itinerary.generalTips.length > 0 && (
        <div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: 'white', borderColor: '#1A1A2E0d' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#a78bfa15', color: '#7c3aed' }}
            >
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg" style={{ color: '#1A1A2E' }}>General Tips</h3>
          </div>
          <ul className="space-y-2">
            {itinerary.generalTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#1A1A2E80' }}>
                <span className="flex-shrink-0 mt-1" style={{ color: '#a78bfa' }}>✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Email capture */}
      <div
        className="rounded-2xl p-6 border-2 text-center"
        style={{ backgroundColor: '#FFF8F0', borderColor: '#FF6B6B30' }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FF6B6B20' }}>
          <Mail className="w-6 h-6" style={{ color: '#FF6B6B' }} />
        </div>
        <h3 className="text-lg font-bold mb-1" style={{ color: '#1A1A2E' }}>Save this trip to your inbox</h3>
        <p className="text-sm mb-4" style={{ color: '#1A1A2E66' }}>
          Get your full itinerary as a PDF and receive family travel tips.
        </p>

        {emailSubmitted ? (
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#34d39920', color: '#059669' }}
          >
            <Check className="w-4 h-4" />
            Saved! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#1A1A2E20', color: '#1A1A2E' }}
            />
            <button
              type="submit"
              disabled={emailLoading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all disabled:opacity-70"
              style={{ backgroundColor: '#FF6B6B', color: 'white' }}
            >
              {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </button>
          </form>
        )}
        {emailError && (
          <p className="mt-2 text-xs" style={{ color: '#FF6B6B' }}>{emailError}</p>
        )}
      </div>

      {/* Plan another */}
      <div className="text-center pb-8">
        <a
          href="/plan"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold border-2 transition-all hover:shadow-md"
          style={{ borderColor: '#FF6B6B', color: '#FF6B6B' }}
        >
          Plan another trip ✦
        </a>
      </div>
    </div>
  );
}
