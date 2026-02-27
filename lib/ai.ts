import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildTripPrompt, TripInput } from './prompts';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface Activity {
  time: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'nap' | 'travel' | 'hotel';
  duration: string;
  description: string;
  tip?: string;
  cost?: string;
  isNapBlock: boolean;
  isHiddenGem: boolean;
}

export interface Day {
  dayNumber: number;
  date: string;
  theme: string;
  activities: Activity[];
}

export interface HotelZone {
  recommended: string;
  reason: string;
  priceRange: string;
}

export interface DailyFoodBudget {
  amount: number;
  currency: string;
  breakdown: string;
}

export interface Itinerary {
  destination: string;
  summary: string;
  hotelZone: HotelZone;
  dailyFoodBudget: DailyFoodBudget;
  days: Day[];
  packingTips: string[];
  generalTips: string[];
}

export async function generateItinerary(input: TripInput): Promise<Itinerary> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: buildSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: buildTripPrompt(input),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  let text = content.text.trim();

  // Strip markdown code fences if present
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  const parsed = JSON.parse(text) as Itinerary;
  return parsed;
}
