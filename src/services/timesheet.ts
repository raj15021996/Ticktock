import api from "@/lib/axios";

import type {
  PaginatedData,
  TimesheetSummary,
  TimesheetWeekDetail,
  TimesheetEntry,
} from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getTimesheets = async (params: {
  status: string;
  startDate?: string;
  endDate?: string;
  page: number;
  perPage: number;
}) => {
  const response = await api.get<
    ApiResponse<PaginatedData<TimesheetSummary>>
  >("/timesheets", {
    params,
  });

  return response.data.data;
};

export const getTimesheet = async (weekId: string) => {
  const response = await api.get<
    ApiResponse<TimesheetWeekDetail>
  >(`/timesheets/${weekId}`);

  return response.data.data;
};

export const addTimesheetEntry = async (
  weekId: string,
  data: {
    dayFullDate: string;
    project: string;
    typeOfWork: string;
    description: string;
    hours: number;
  }
) => {
  const response = await api.post<
    ApiResponse<{
      entry: TimesheetEntry;
      week: TimesheetWeekDetail;
    }>
  >(`/timesheets/${weekId}/entries`, data);

  return response.data.data;
};

export const updateTimesheetEntry = async (
  weekId: string,
  entryId: string,
  data: {
    project?: string;
    typeOfWork?: string;
    description?: string;
    hours?: number;
  }
) => {
  const response = await api.patch<
    ApiResponse<{
      entry: TimesheetEntry;
      week: TimesheetWeekDetail;
    }>
  >(
    `/timesheets/${weekId}/entries/${entryId}`,
    data
  );

  return response.data.data;
};

export const deleteTimesheetEntry = async (
  weekId: string,
  entryId: string
) => {
  const response = await api.delete<
    ApiResponse<{
      deletedEntryId: string;
      week: TimesheetWeekDetail;
    }>
  >(`/timesheets/${weekId}/entries/${entryId}`);

  return response.data.data;
};