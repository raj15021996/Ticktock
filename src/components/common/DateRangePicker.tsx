"use client";

import { useState } from "react";
import {
  DayPicker,
  type DateRange,
} from "react-day-picker";
import "react-day-picker/style.css";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

const formatDate = (date?: Date) => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const getDateRangeLabel = (range?: DateRange) => {
  if (!range?.from) {
    return "Select date range";
  }

  if (!range.to) {
    return formatDate(range.from);
  }

  return `${formatDate(range.from)} - ${formatDate(range.to)}`;
};

export default function DateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (
    range: DateRange | undefined
  ) => {
    if (!range?.from) {
      onChange(undefined);
      return;
    }

    const isCompleteRange =
      range.to &&
      range.to.getTime() !== range.from.getTime();

    onChange({
      from: range.from,
      to: isCompleteRange ? range.to : undefined,
    });

    // Close after selecting both dates
    if (isCompleteRange) {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <span className="min-w-0 truncate text-left text-gray-900">
          {getDateRangeLabel(value)}
        </span>

        <span className="shrink-0 text-gray-400">
          ▾
        </span>
      </button>

      {/* Calendar */}
      {isOpen && (
        <div
          className="
            absolute
            left-0
            top-full
            z-50
            mt-2
            w-[calc(100vw-2rem)]
            max-w-[340px]
            rounded-xl
            border
            border-gray-200
            bg-white
            p-3
            shadow-lg
            text-black
            sm:w-auto
            sm:min-w-[320px]
          "
        >
          <div className="max-w-full overflow-x-auto">
            <DayPicker
              mode="range"
              selected={value}
              onSelect={handleDateSelect}
              numberOfMonths={1}
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}