import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { listTimesheets } from "@/lib/mock-db";
import { PaginatedData, TimesheetStatus, TimesheetSummary } from "@/types";

const VALID_STATUSES: TimesheetStatus[] = ["COMPLETED", "INCOMPLETE", "MISSING"];
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const statusParam = searchParams.get("status") ?? "all";
  const status =
    statusParam === "all" || VALID_STATUSES.includes(statusParam as TimesheetStatus)
      ? (statusParam as TimesheetStatus | "all")
      : "all";

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  if (startDateParam && !ISO_DATE_REGEX.test(startDateParam)) {
    return apiError("startDate must be an ISO date (YYYY-MM-DD)", 400);
  }
  if (endDateParam && !ISO_DATE_REGEX.test(endDateParam)) {
    return apiError("endDate must be an ISO date (YYYY-MM-DD)", 400);
  }
  if (startDateParam && endDateParam && startDateParam > endDateParam) {
    return apiError("startDate must be before or equal to endDate", 400);
  }

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.max(1, Number(searchParams.get("perPage")) || 5);

  const { items, meta } = listTimesheets({
    status,
    startDate: startDateParam ?? undefined,
    endDate: endDateParam ?? undefined,
    page,
    perPage,
  });

  const data: PaginatedData<TimesheetSummary> = { items, meta };
  return apiSuccess(data);
}