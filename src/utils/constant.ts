import { SelectOption } from "@/types";

export const PUBLIC_PATH = {
  LOGIN: "/login",
};

export const PRIVATE_PATH = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  TIMESHEETS: "/timesheet",
};


export const ROUTES_PATH = {
  ...PUBLIC_PATH,
  ...PRIVATE_PATH,
};

export const storageKeys ={
  accessToken: "accessToken",
  userData: "userData"
}


export const PROJECT_OPTIONS: SelectOption[] = [
  { label: "Project Name", value: "" },
  { label: "Timesheet Portal", value: "timesheet-portal" },
  { label: "Employee Portal", value: "employee-portal" },
  { label: "Admin Dashboard", value: "admin-dashboard" },
  { label: "Mobile App", value: "mobile-app" },
  { label: "Internal Tools", value: "internal-tools" },
];

export const TYPE_OF_WORK_OPTIONS: SelectOption[] = [
  { label: "Feature development", value: "feature-development" },
  { label: "Bug fixes", value: "bug-fixes" },
  { label: "UI development", value: "ui-development" },
  { label: "API integration", value: "api-integration" },
  { label: "Code review", value: "code-review" },
  { label: "Testing", value: "testing" },
  { label: "Optimization", value: "optimization" },
  { label: "Meetings", value: "meetings" },
  { label: "Documentation", value: "documentation" },
];

export const STATUS_OPTIONS: SelectOption[] = [
  { label: "Status", value: "all" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Incomplete", value: "INCOMPLETE" },
  { label: "Missing", value: "MISSING" },
];

export const PER_PAGE_OPTIONS: SelectOption[] = [
  { label: "5 per page", value: "5" },
  { label: "10 per page", value: "10" },
  { label: "20 per page", value: "20" },
];

export const WEEKLY_HOURS_TARGET = 40;

