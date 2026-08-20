import { apiError, apiSuccess } from "@/lib/api-response";
import { deleteEntry, getWeekDetail, updateEntry } from "@/lib/mock-db";
import { UpdateEntryRequestBody } from "@/types";

interface RouteParams {
  params: Promise<{ weekId: string; entryId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { weekId, entryId } = await params;

  let body: UpdateEntryRequestBody;
  try {
    body = await request.json();
  } catch {
    return apiError("Request body must be valid JSON", 400);
  }

  if (body.description !== undefined && !body.description.trim()) {
    return apiError("description cannot be empty", 400);
  }
  if (body.hours !== undefined && body.hours < 1) {
    return apiError("hours must be at least 1", 400);
  }

  const updated = updateEntry(weekId, entryId, body);
  if (!updated) {
    return apiError(`Entry "${entryId}" not found in week "${weekId}"`, 404);
  }

  const week = getWeekDetail(weekId);
  return apiSuccess({ entry: updated, week });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { weekId, entryId } = await params;

  const deleted = deleteEntry(weekId, entryId);
  if (!deleted) {
    return apiError(`Entry "${entryId}" not found in week "${weekId}"`, 404);
  }

  const week = getWeekDetail(weekId);
  return apiSuccess({ deletedEntryId: entryId, week });
}