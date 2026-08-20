import { TimesheetDay, TimesheetEntry } from "@/types";
import { WEEKLY_HOURS_TARGET } from "@/utils/constant";
import TimesheetDayRow from "./TimesheetDay";

interface TimesheetCardProps {
  dateRangeLabel: string;
  days: TimesheetDay[];
  onAddTask: (dayDate: string) => void;
  onEditEntry: (dayDate: string, entry: TimesheetEntry) => void;
  onDeleteEntry: (dayDate: string, entryId: string) => void;
}

export default function TimesheetCard({
  dateRangeLabel,
  days,
  onAddTask,
  onEditEntry,
  onDeleteEntry,
}: TimesheetCardProps) {
  const totalHours = days.reduce(
    (sum, day) => sum + day.entries.reduce((daySum, entry) => daySum + entry.hours, 0),
    0
  );
  const percentage = Math.min(
    100,
    Math.round((totalHours / WEEKLY_HOURS_TARGET) * 100)
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            This week&apos;s timesheet
          </h1>
          <p className="mt-1 text-sm text-gray-500">{dateRangeLabel}</p>
        </div>

        <div className="w-full sm:w-56">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {totalHours}/{WEEKLY_HOURS_TARGET} hrs
            </span>
            <span>{percentage}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-orange-400 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 divide-y divide-gray-100">
        {days.map((day) => (
          <TimesheetDayRow
            key={day.fullDate}
            day={day}
            onAddTask={() => onAddTask(day.fullDate)}
            onEditEntry={(entry) => onEditEntry(day.fullDate, entry)}
            onDeleteEntry={(entryId) => onDeleteEntry(day.fullDate, entryId)}
          />
        ))}
      </div>
    </div>
  );
}
