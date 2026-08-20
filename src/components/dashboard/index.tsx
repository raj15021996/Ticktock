"use client";

import { useCallback, useEffect, useState } from "react";

import Select from "@/components/common/Select";
import TimesheetTable from "@/components/timesheet/TimesheetTable";
import Pagination from "@/components/timesheet/Pagination";

import DateRangePicker from "@/components/common/DateRangePicker";
import type { DateRange } from "react-day-picker";

import { STATUS_OPTIONS, PER_PAGE_OPTIONS } from "@/utils/constant";

import type { PaginatedData, TimesheetStatus, TimesheetSummary } from "@/types";
import Loading from "../ui/loading";
import { getTimesheets } from "@/services/timesheet";

type StatusFilter = "all" | TimesheetStatus;

interface Filters {
  dateRange: DateRange | undefined;
  status: StatusFilter;
  perPage: number;
}

const INITIAL_FILTERS: Filters = {
  dateRange: undefined,
  status: "all",
  perPage: 5,
};

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function Dashboard() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [timesheets, setTimesheets] = useState<TimesheetSummary[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimesheets = useCallback(async () => {
    const { from, to } = filters.dateRange ?? {};

    // Don't call API until both dates are selected
    if (from && !to) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getTimesheets({
        status: filters.status,
        startDate: from ? formatDateForApi(from) : undefined,
        endDate: to ? formatDateForApi(to) : undefined,
        page: currentPage,
        perPage: filters.perPage,
      });

      setTimesheets(data.items);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
      setError("Unable to load timesheets. Please try again.");
      setTimesheets([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.dateRange, filters.perPage, currentPage]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
    }));

    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as StatusFilter,
    }));

    setCurrentPage(1);
  };

  const handlePerPageChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      perPage: Number(value),
    }));

    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-5">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Your Timesheets</h1>

        {/* Filters */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <DateRangePicker
              value={filters.dateRange}
              onChange={handleDateRangeChange}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              aria-label="Status"
              options={STATUS_OPTIONS}
              value={filters.status}
              onChange={(event) => handleStatusChange(event.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-6">
          {isLoading ? (
            <Loading />
          ) : error ? (
            <div className="flex min-h-60 items-center justify-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : (
            <TimesheetTable timesheets={timesheets} />
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && (
          <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row p-4 rounded-lg">
            <div className="w-full sm:w-35">
              <Select
                aria-label="Rows per page"
                options={PER_PAGE_OPTIONS}
                value={String(filters.perPage)}
                onChange={(event) => handlePerPageChange(event.target.value)}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
