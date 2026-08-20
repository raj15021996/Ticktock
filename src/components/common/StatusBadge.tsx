import { TimesheetStatus } from "@/types";

const statusStyles: Record<TimesheetStatus, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  INCOMPLETE: "bg-yellow-100 text-yellow-800",
  MISSING: "bg-pink-100 text-pink-800",
};

export default function StatusBadge({ status }: { status: TimesheetStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
