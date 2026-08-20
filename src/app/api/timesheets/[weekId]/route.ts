import { apiError, apiSuccess } from "@/lib/api-response";
import { getCurrentWeekId, getWeekDetail } from "@/lib/mock-db";

interface RouteParams {
  params: Promise<{ weekId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { weekId: rawWeekId } = await params;
  // "current" is a friendly alias for whichever week is flagged as the
  // active one in the mock database, so callers don't need to know its id.
  const weekId = rawWeekId === "current" ? getCurrentWeekId() : rawWeekId;

  const week = getWeekDetail(weekId);

  if (!week) {
    return apiError(`No timesheet found for week "${rawWeekId}"`, 404);
  }

  return apiSuccess(week);
}