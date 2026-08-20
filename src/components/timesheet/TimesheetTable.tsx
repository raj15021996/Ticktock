import Link from "next/link";
import { TimesheetSummary } from "@/types";
import StatusBadge from "@/components/common/StatusBadge";
import { ROUTES_PATH } from "@/utils/constant";

interface TimesheetTableProps {
  timesheets: TimesheetSummary[];
}

const actionLabel: Record<TimesheetSummary["status"], string> = {
  COMPLETED: "View",
  INCOMPLETE: "Update",
  MISSING: "Create",
};

export default function TimesheetTable({ timesheets }: TimesheetTableProps) {
  if (timesheets.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        No timesheets found for the selected filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
  <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
    <colgroup>
      <col className="w-[10%]" />
      <col className="w-[45%]" />
      <col className="w-[35%]" />
      <col className="w-[10%]" />
    </colgroup>

    <thead>
      <tr className="bg-gray-50 text-xs font-medium text-gray-500">
        <th className="border-b border-gray-200 px-3 py-4 text-left font-medium">
          WEEK #
          <span className="ml-7">↓</span>
        </th>

        <th className="border-b border-gray-200 px-4 py-4 font-medium">
          DATE
          <span className="ml-2">↓</span>
        </th>

        <th className="border-b border-gray-200 px-4 py-4 font-medium">
          STATUS
          <span className="ml-2">↓</span>
        </th>

        <th className="border-b border-gray-200 px-4 py-4 text-center font-medium">
          ACTIONS
        </th>
      </tr>
    </thead>

    <tbody>
      {timesheets.map((ts) => (
        <tr key={ts.id}>
          <td className="border-b border-r border-gray-200 bg-gray-50 px-3 py-4 text-gray-900">
            {ts.week}
          </td>

          <td className="border-b border-gray-200 px-4 py-4 text-gray-500">
            {ts.dateRangeLabel}
          </td>

          <td className="border-b border-gray-200 px-1 py-4">
            <StatusBadge status={ts.status} />
          </td>

          <td className="border-b border-gray-200 px-4 py-4 text-center">
            <Link
              href={`${ROUTES_PATH.TIMESHEETS}/${ts.id}`}
              className="font-medium text-[#1C64F2] hover:underline"
            >
              {actionLabel[ts.status]}
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
}
