export interface TripInput {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  kidsAges: number[];
  budget: 'budget' | 'moderate' | 'luxury';
  interests: string[];
  napStart?: string;
  napEnd?: string;
}

const BUDGET_DESCRIPTIONS: Record<string, string> = {
  budget: 'budget-friendly (under $100/day for food)',
  moderate: 'moderate ($100–$250/day for food)',
  luxury: 'luxury ($250+/day for food)',
};

export function buildSystemPrompt(): string {
  return `You are TripCraft, an expert family travel planner. You create detailed, realistic day-by-day itineraries optimized for families with children.

Your itineraries should:
- Balance famous tourist attractions with authentic hidden gems locals love
- Consider children's energy levels (morning = high energy activities, afternoon = calmer)
- Include specific restaurant recommendations with cuisine type and price range
- Recommend hotel zones with reasoning (proximity, family-friendliness, safety)
- Provide practical tips for each activity (best time to arrive, what to skip, insider advice)
- Account for travel time between locations

ALWAYS respond with ONLY a valid JSON object. No markdown, no explanation, no code fences — just raw JSON.`;
}

export function buildTripPrompt(input: TripInput): string {
  const hasYoungKids = input.kidsAges.some(age => age < 5);
  const hasKids = input.kidsAges.length > 0;
  const numDays = Math.ceil(
    (new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const kidsDesc = input.kidsAges.length > 0
    ? `${input.kidsAges.length} child${input.kidsAges.length > 1 ? 'ren' : ''} (ages: ${input.kidsAges.join(', ')})`
    : 'no children';

  const napSection = hasYoungKids && input.napStart && input.napEnd
    ? `IMPORTANT: Children need a nap from ${input.napStart} to ${input.napEnd}. Block this time as "Nap Time / Hotel Rest" and do NOT schedule activities during this window.`
    : '';

  return `Create a complete family trip itinerary for the following:

DESTINATION: ${input.destination}
DATES: ${input.startDate} to ${input.endDate} (${numDays} days)
TRAVELERS: ${input.adults} adult${input.adults > 1 ? 's' : ''}, ${kidsDesc}
BUDGET: ${BUDGET_DESCRIPTIONS[input.budget]}
INTERESTS: ${input.interests.length > 0 ? input.interests.join(', ') : 'general sightseeing, food, culture'}
${napSection}

Return a JSON object with this EXACT structure:

{
  "destination": "City, Country",
  "summary": "2-3 sentence overview of the trip",
  "hotelZone": {
    "recommended": "Name of neighborhood/zone",
    "reason": "Why this zone is best for this family",
    "priceRange": "e.g. $150–$250/night"
  },
  "dailyFoodBudget": {
    "amount": 120,
    "currency": "USD",
    "breakdown": "Breakfast $20, Lunch $35, Dinner $65"
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "${input.startDate}",
      "theme": "Short catchy theme for the day",
      "activities": [
        {
          "time": "9:00 AM",
          "name": "Activity or place name",
          "type": "attraction|restaurant|nap|travel|hotel",
          "duration": "2 hours",
          "description": "What to do and why it's great",
          "tip": "Practical insider tip",
          "cost": "$25/person",
          "isNapBlock": false,
          "isHiddenGem": false
        }
      ]
    }
  ],
  "packingTips": ["tip1", "tip2", "tip3"],
  "generalTips": ["tip1", "tip2", "tip3"]
}

Include ${numDays} days total. Each day should have 4–7 activities.
${hasYoungKids ? 'Mark nap/rest blocks with "isNapBlock": true.' : ''}
Mark hidden gems (local favorites, off-the-beaten-path spots) with "isHiddenGem": true.
Make it feel like advice from a local friend who knows the best spots.
${hasKids ? 'Include kid-friendly descriptions and highlight which activities children will love.' : ''}`;
}
