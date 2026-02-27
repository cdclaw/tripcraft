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

/**
 * Attempt to repair truncated JSON by closing any open brackets/braces.
 * Handles mid-string truncation and trailing commas.
 */
function closeOpenJson(text: string): string {
  let result = text.trimEnd();
  const stack: string[] = [];
  let inString = false;
  let escape = false;

  for (const ch of result) {
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ']') stack.pop();
  }

  // Close any open string literal
  if (inString) result += '"';

  // Strip trailing comma or colon before we close brackets
  result = result.replace(/[,:\s]+$/, '');

  // Close open brackets/braces in LIFO order
  for (let i = stack.length - 1; i >= 0; i--) {
    result += stack[i] === '{' ? '}' : ']';
  }

  return result;
}

/**
 * Last-resort repair: scan the raw text for complete day objects,
 * then reassemble a valid Itinerary JSON around them.
 */
function rebuildWithCompleteDays(text: string): Itinerary {
  const daysMatch = text.match(/"days"\s*:\s*\[/);
  if (!daysMatch || daysMatch.index === undefined) {
    throw new Error('Could not find days array in response');
  }

  const daysArrayStart = daysMatch.index + daysMatch[0].length;
  const afterDays = text.slice(daysArrayStart);
  const completeDays: string[] = [];

  let i = 0;
  while (i < afterDays.length) {
    // Skip whitespace and commas
    while (i < afterDays.length && /[\s,]/.test(afterDays[i])) i++;
    if (i >= afterDays.length || afterDays[i] !== '{') break;

    // Scan forward for the matching closing brace
    let depth = 0;
    let inStr = false;
    let esc = false;
    const start = i;
    let found = false;

    for (let j = i; j < afterDays.length; j++) {
      const ch = afterDays[j];
      if (esc) { esc = false; continue; }
      if (ch === '\\' && inStr) { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          completeDays.push(afterDays.slice(start, j + 1));
          i = j + 1;
          found = true;
          break;
        }
      }
    }

    if (!found) break; // Incomplete object — stop here
  }

  if (completeDays.length === 0) {
    throw new Error('Could not extract any complete days from response');
  }

  // Reconstruct: keep the preamble up through the opening '[', inject complete days,
  // then close the array and the outer object with empty tip arrays.
  const preamble = text.slice(0, daysArrayStart);
  const rebuilt = preamble + completeDays.join(',') + '],"packingTips":[],"generalTips":[]}';

  return JSON.parse(rebuilt) as Itinerary;
}

export async function generateItinerary(input: TripInput): Promise<Itinerary> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 16000,
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

  // Attempt 1: direct parse (fast path — no truncation)
  try {
    return JSON.parse(text) as Itinerary;
  } catch {
    // fall through to repair
  }

  const preview = text.slice(0, 200);

  // Attempt 2: close any open brackets/braces from truncation
  try {
    const repaired = closeOpenJson(text);
    return JSON.parse(repaired) as Itinerary;
  } catch {
    // fall through
  }

  // Attempt 3: extract every complete day object, rebuild wrapper
  try {
    return rebuildWithCompleteDays(text);
  } catch {
    throw new Error(
      `Failed to parse AI response (truncated JSON). Response starts with: "${preview}"`
    );
  }
}
