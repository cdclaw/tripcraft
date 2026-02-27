import { Activity, Day } from '@/lib/ai';
import { Clock, Gem, Moon, MapPin, Utensils, Hotel, Car } from 'lucide-react';

const TYPE_ICONS: Record<Activity['type'], React.ReactNode> = {
  attraction: <MapPin className="w-3.5 h-3.5" />,
  restaurant: <Utensils className="w-3.5 h-3.5" />,
  nap: <Moon className="w-3.5 h-3.5" />,
  travel: <Car className="w-3.5 h-3.5" />,
  hotel: <Hotel className="w-3.5 h-3.5" />,
};

const TYPE_COLORS: Record<Activity['type'], { bg: string; text: string }> = {
  attraction: { bg: '#FF6B6B15', text: '#FF6B6B' },
  restaurant: { bg: '#f59e0b15', text: '#d97706' },
  nap: { bg: '#a78bfa20', text: '#7c3aed' },
  travel: { bg: '#6b728015', text: '#4b5563' },
  hotel: { bg: '#34d39915', text: '#059669' },
};

interface DayCardProps {
  day: Day;
  isFirst?: boolean;
}

export default function DayCard({ day, isFirst }: DayCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden border shadow-sm"
      style={{ borderColor: '#1A1A2E0d' }}
    >
      {/* Day header */}
      <div className="px-6 py-4 day-header-gradient">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#FF6B6B', color: 'white' }}
              >
                Day {day.dayNumber}
              </span>
              {isFirst && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#ffffff20', color: '#ffffff99' }}
                >
                  First day
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white">{day.theme}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#ffffff66' }}>
              {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-3xl font-black" style={{ color: '#ffffff10' }}>
            {String(day.dayNumber).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="divide-y divide-gray-50">
        {day.activities.map((activity, i) => (
          <ActivityRow key={i} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: Activity }) {
  const colors = TYPE_COLORS[activity.type] || TYPE_COLORS.attraction;

  return (
    <div
      className={`activity-card px-5 py-4 ${activity.isNapBlock ? 'nap-block' : 'bg-white'}`}
    >
      <div className="flex gap-4">
        {/* Time column */}
        <div className="flex-shrink-0 w-16">
          <div className="flex items-center gap-1 text-xs font-mono" style={{ color: '#1A1A2E50' }}>
            <Clock className="w-3 h-3" />
            <span>{activity.time}</span>
          </div>
          <p className="text-xs mt-1" style={{ color: '#1A1A2E40' }}>{activity.duration}</p>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1.5">
            {/* Type badge */}
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {TYPE_ICONS[activity.type]}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm leading-snug" style={{ color: '#1A1A2E' }}>
                  {activity.name}
                </h4>
                {activity.isHiddenGem && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#FF6B6B', color: 'white' }}
                  >
                    <Gem className="w-3 h-3" />
                    Hidden Gem
                  </span>
                )}
                {activity.isNapBlock && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#a78bfa', color: 'white' }}
                  >
                    😴 Nap Time
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: '#1A1A2E80' }}>
            {activity.description}
          </p>

          {activity.tip && (
            <div
              className="mt-2 flex items-start gap-1.5 rounded-lg px-3 py-2 text-xs"
              style={{ backgroundColor: '#FF6B6B08', color: '#1A1A2E80' }}
            >
              <span className="flex-shrink-0 mt-0.5">💡</span>
              <span>{activity.tip}</span>
            </div>
          )}

          {activity.cost && (
            <p className="mt-2 text-xs font-medium" style={{ color: '#34d399' }}>
              {activity.cost}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
