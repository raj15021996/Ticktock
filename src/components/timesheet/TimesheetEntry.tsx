"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { TimesheetEntry as TimesheetEntryType } from "@/types";
import EntryMenu from "./EntryMenu";

interface TimesheetEntryProps {
  entry: TimesheetEntryType;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TimesheetEntry({
  entry,
  onEdit,
  onDelete,
}: TimesheetEntryProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <p className="truncate text-sm text-gray-900">{entry.description}</p>

      <div className="flex flex-shrink-0 items-center gap-4">
        <span className="text-sm text-gray-500">{entry.hours} hrs</span>
        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
          {entry.project}
        </span>
        <div className="relative">
          <button
            type="button"
            aria-label="Entry actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
          {menuOpen && (
            <EntryMenu
              onEdit={() => {
                setMenuOpen(false);
                onEdit();
              }}
              onDelete={() => {
                setMenuOpen(false);
                onDelete();
              }}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
