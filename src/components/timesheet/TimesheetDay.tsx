import { Plus } from "lucide-react";
import { TimesheetDay as TimesheetDayType, TimesheetEntry as TimesheetEntryType } from "@/types";
import TimesheetEntry from "./TimesheetEntry";

interface TimesheetDayProps {
  day: TimesheetDayType;
  onAddTask: () => void;
  onEditEntry: (entry: TimesheetEntryType) => void;
  onDeleteEntry: (entryId: string) => void;
}

export default function TimesheetDayRow({
  day,
  onAddTask,
  onEditEntry,
  onDeleteEntry,
}: TimesheetDayProps) {
  return (
    <div className="py-4">
      <p className="mb-3 text-sm font-medium text-gray-900">{day.date}</p>
      <div className="flex flex-col gap-2">
        {day.entries.map((entry) => (
          <TimesheetEntry
            key={entry.id}
            entry={entry}
            onEdit={() => onEditEntry(entry)}
            onDelete={() => onDeleteEntry(entry.id)}
          />
        ))}

        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white py-3 text-sm text-blue-600 hover:bg-blue-50/50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add new task
        </button>
      </div>
    </div>
  );
}
