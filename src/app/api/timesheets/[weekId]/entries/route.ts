import { apiError, apiSuccess } from "@/lib/api-response";
import { addEntry, getWeekDetail } from "@/lib/mock-db";
import { CreateEntryRequestBody } from "@/types";

interface RouteParams {
  params: Promise<{ weekId: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { weekId } = await params;

  let body: Partial<CreateEntryRequestBody>;
  try {
    body = await request.json();
  } catch {
    return apiError("Request body must be valid JSON", 400);
  }

  const { dayFullDate, project, typeOfWork, description, hours } = body;

  if (!dayFullDate) return apiError("dayFullDate is required", 400);
  if (!project) return apiError("project is required", 400);
  if (!typeOfWork) return apiError("typeOfWork is required", 400);
  if (!description || !description.trim()) return apiError("description is required", 400);
  if (!hours || hours < 1) return apiError("hours must be at least 1", 400);

  const created = addEntry(weekId, dayFullDate, { project, typeOfWork, description, hours });

  if (!created) {
    return apiError(`Could not add entry - week "${weekId}" or day "${dayFullDate}" not found`, 404);
  }
  const week = getWeekDetail(weekId);
  return apiSuccess({ entry: created, week }, { status: 201 });
}