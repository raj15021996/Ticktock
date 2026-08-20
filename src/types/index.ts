export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export type TimesheetStatus =
  | "COMPLETED"
  | "INCOMPLETE"
  | "MISSING";

  export interface TimesheetEntry {
  id: string;
  project: string;
  typeOfWork: string;
  description: string;
  hours: number;
}

export interface TimesheetSummary {
  id: string;
  week: number;
  dateRangeLabel: string;
  status: TimesheetStatus;
  month: string; // e.g. "January 2024" - used for date range filtering
}
export interface TimesheetDay {
  date: string; // e.g. "Jan 21"
  fullDate: string; // ISO date, e.g. "2024-01-21"
  entries: TimesheetEntry[];
}
export interface EntryFormData {
  project: string;
  typeOfWork: string;
  description: string;
  hours: number;
}

export interface User {
  name: string;
  email: string;
}

// API types

export interface ApiSuccess<T> {
  success: true;
  data: T;
}
 
export interface ApiError {
  success: false;
  error: string;
}
 
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
 
export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
 
export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}
 
export interface LoginRequestBody {
  email: string;
  password: string;
}
 
export interface LoginResponseData {
  user: User;
  token: string;
}
 
/** Full week detail: the summary card info plus its day-by-day entries. */
export interface TimesheetWeekDetail extends TimesheetSummary {
  days: TimesheetDay[];
}
 
export interface CreateEntryRequestBody extends EntryFormData {
  dayFullDate: string;
}
 
export type UpdateEntryRequestBody = Partial<EntryFormData>;