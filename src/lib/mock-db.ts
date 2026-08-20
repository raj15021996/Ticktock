import {
  TimesheetDay,
  TimesheetEntry,
  TimesheetStatus,
  TimesheetSummary,
  TimesheetWeekDetail,
  User,
} from "@/types";
import {
  formatWeekRangeLabel,
  getWeekEndISO,
  getWeekMonthLabel,
  getWeekdayShells,
} from "@/utils/date-utils";

/**
 * This is a mock, in-memory "database" for the demo API routes.
 *
 * It lives as a module-level singleton, so data resists across requests
 * within the same server process (great for `next dev` / a single
 * `next start` instance) but resets on server restart and is NOT shared
 * across multiple serverless/edge instances. That's fine for this
 * assignment: the goal is to exercise real request/response API
 * integration in the frontend, not to stand up a persistent backend.
 */

// Users (mock auth)
interface MockUser extends User {
  password: string;
}

const users: MockUser[] = [
  {
    name: "Raj Kumar",
    email: "rajkumar@bitcot.com",
    password: "Bitcot@123",
  },
  {
    name: "Avril Rodrigues",
    email: "avril@tentwenty.me",
    password: "password@123",
  },
  {
    name: "Max Ray",
    email: "max.ray@gmail.com",
    password: "password@123",
  },
];

export function findUserByCredentials(
  email: string,
  password: string,
): User | null {
  const match = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password,
  );
  if (!match) return null;
  const { password: _password, ...user } = match;
  return user;
}

//Weekly timesheets + per-week entries
let entryIdCounter = 0;
const nextEntryId = () => `entry-${++entryIdCounter}`;

interface EntrySeed {
  project: string;
  typeOfWork: string;
  description: string;
  hours: number;
}

interface WeekSeed {
  id: string;
  week: number;
  mondayISO: string;
  /** entries keyed by weekday index (0 = Monday ... 4 = Friday) */
  entriesByDayIndex: Record<number, EntrySeed[]>;
  isCurrent?: boolean;
}

const weekSeeds: WeekSeed[] = [
  // Week 1 - 40 hrs
  {
    id: "week-1",
    week: 1,
    mondayISO: "2026-06-01",
    entriesByDayIndex: {
      0: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Built dashboard layout",
          hours: 5,
        },
        {
          project: "Internal Tools",
          typeOfWork: "Meetings",
          description: "Sprint planning",
          hours: 2,
        },
        {
          project: "Timesheet Portal",
          typeOfWork: "Code review",
          description: "Reviewed UI changes",
          hours: 1,
        },
      ],
      1: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Created timesheet cards",
          hours: 8,
        },
      ],
      2: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed card alignment",
          hours: 6,
        },
        {
          project: "Internal Tools",
          typeOfWork: "Meetings",
          description: "Sprint planning",
          hours: 2,
        },
      ],
      3: [
        {
          project: "Timesheet Portal",
          typeOfWork: "UI development",
          description: "Added responsive styles",
          hours: 8,
        },
      ],
      4: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Code review",
          description: "Reviewed dashboard changes",
          hours: 8,
        },
      ],
    },
  },

  // Week 2 - 32 hrs
  {
    id: "week-2",
    week: 2,
    mondayISO: "2026-06-08",
    entriesByDayIndex: {
      0: [
        {
          project: "Employee Portal",
          typeOfWork: "Feature development",
          description: "Created profile screen",
          hours: 6,
        },
        {
          project: "Employee Portal",
          typeOfWork: "Meetings",
          description: "Discussed profile flow",
          hours: 2,
        },
      ],
      1: [
        {
          project: "Employee Portal",
          typeOfWork: "Feature development",
          description: "Added profile form",
          hours: 8,
        },
      ],
      2: [
        {
          project: "Employee Portal",
          typeOfWork: "API integration",
          description: "Connected profile API",
          hours: 4,
        },
        {
          project: "Employee Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed API validation",
          hours: 4,
        },
      ],
      3: [
        {
          project: "Employee Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed form validation",
          hours: 8,
        },
      ],
      4: [],
    },
  },

  // Week 3 - 0 hrs
  {
    id: "week-3",
    week: 3,
    mondayISO: "2026-06-15",
    entriesByDayIndex: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    },
  },

  // Week 4 - 40 hrs
  {
    id: "week-4",
    week: 4,
    mondayISO: "2026-06-22",
    entriesByDayIndex: {
      0: [
        {
          project: "Authentication",
          typeOfWork: "Feature development",
          description: "Implemented login screen",
          hours: 8,
        },
      ],
      1: [
        {
          project: "Authentication",
          typeOfWork: "Feature development",
          description: "Added form validation",
          hours: 4,
        },
        {
          project: "Authentication",
          typeOfWork: "Bug fixes",
          description: "Fixed password validation",
          hours: 2,
        },
        {
          project: "Internal Tools",
          typeOfWork: "Meetings",
          description: "Auth flow discussion",
          hours: 2,
        },
      ],
      2: [
        {
          project: "Authentication",
          typeOfWork: "API integration",
          description: "Connected login API",
          hours: 6,
        },
        {
          project: "Authentication",
          typeOfWork: "Testing",
          description: "Tested login flow",
          hours: 2,
        },
      ],
      3: [
        {
          project: "Authentication",
          typeOfWork: "Bug fixes",
          description: "Fixed auth errors",
          hours: 8,
        },
      ],
      4: [
        {
          project: "Authentication",
          typeOfWork: "Code review",
          description: "Reviewed auth flow",
          hours: 8,
        },
      ],
    },
  },

  // Week 5 - 16 hrs
  {
    id: "week-5",
    week: 5,
    mondayISO: "2026-06-29",
    entriesByDayIndex: {
      0: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Added timesheet listing",
          hours: 5,
        },
        {
          project: "Timesheet Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed table spacing",
          hours: 3,
        },
      ],
      1: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed pagination issues",
          hours: 8,
        },
      ],
      2: [],
      3: [],
      4: [],
    },
  },

  // Week 6 - Missing week
  {
    id: "week-6",
    week: 6,
    mondayISO: "2026-07-06",
    entriesByDayIndex: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    },
  },

  // Week 7 - 36 hrs
  {
    id: "week-7",
    week: 7,
    mondayISO: "2026-07-13",
    entriesByDayIndex: {
      0: [
        {
          project: "Reporting",
          typeOfWork: "Feature development",
          description: "Created reports page",
          hours: 6,
        },
        {
          project: "Reporting",
          typeOfWork: "UI development",
          description: "Styled report cards",
          hours: 2,
        },
      ],
      1: [
        {
          project: "Reporting",
          typeOfWork: "UI development",
          description: "Added report filters",
          hours: 8,
        },
      ],
      2: [
        {
          project: "Reporting",
          typeOfWork: "API integration",
          description: "Connected reports API",
          hours: 8,
        },
      ],
      3: [
        {
          project: "Reporting",
          typeOfWork: "Bug fixes",
          description: "Fixed filter issues",
          hours: 4,
        },
        {
          project: "Internal Tools",
          typeOfWork: "Meetings",
          description: "Report review meeting",
          hours: 2,
        },
      ],
      4: [
        {
          project: "Reporting",
          typeOfWork: "Code review",
          description: "Reviewed report changes",
          hours: 6,
        },
      ],
    },
  },

  // Week 8 - 28 hrs
  {
    id: "week-8",
    week: 8,
    mondayISO: "2026-07-20",
    entriesByDayIndex: {
      0: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Created add entry modal",
          hours: 8,
        },
      ],
      1: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Added entry validation",
          hours: 5,
        },
        {
          project: "Timesheet Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed input handling",
          hours: 3,
        },
      ],
      2: [
        {
          project: "Timesheet Portal",
          typeOfWork: "API integration",
          description: "Connected create API",
          hours: 8,
        },
      ],
      3: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed modal validation",
          hours: 4,
        },
      ],
      4: [],
    },
  },

  // Week 9 - 40 hrs
  {
    id: "week-9",
    week: 9,
    mondayISO: "2026-07-27",
    entriesByDayIndex: {
      0: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Implemented entry editing",
          hours: 6,
        },
        {
          project: "Timesheet Portal",
          typeOfWork: "Testing",
          description: "Tested edit flow",
          hours: 2,
        },
      ],
      1: [
        {
          project: "Timesheet Portal",
          typeOfWork: "API integration",
          description: "Connected update API",
          hours: 8,
        },
      ],
      2: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Implemented entry deletion",
          hours: 8,
        },
      ],
      3: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed CRUD state issues",
          hours: 5,
        },
        {
          project: "Internal Tools",
          typeOfWork: "Meetings",
          description: "Sprint review",
          hours: 3,
        },
      ],
      4: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Code review",
          description: "Reviewed CRUD APIs",
          hours: 8,
        },
      ],
    },
  },

  // Week 10 - 20 hrs
  {
    id: "week-10",
    week: 10,
    mondayISO: "2026-08-03",
    entriesByDayIndex: {
      0: [
        {
          project: "Performance",
          typeOfWork: "Optimization",
          description: "Optimized API requests",
          hours: 6,
        },
        {
          project: "Performance",
          typeOfWork: "Testing",
          description: "Measured API performance",
          hours: 2,
        },
      ],
      1: [
        {
          project: "Performance",
          typeOfWork: "Optimization",
          description: "Reduced component renders",
          hours: 6,
        },
      ],
      2: [
        {
          project: "Performance",
          typeOfWork: "Bug fixes",
          description: "Fixed loading issues",
          hours: 6,
        },
      ],
      3: [],
      4: [],
    },
  },

  // Week 11 - 32 hrs
  {
    id: "week-11",
    week: 11,
    mondayISO: "2026-08-10",
    entriesByDayIndex: {
      0: [
        {
          project: "Mobile App",
          typeOfWork: "UI development",
          description: "Created mobile layout",
          hours: 5,
        },
        {
          project: "Mobile App",
          typeOfWork: "UI development",
          description: "Added responsive navigation",
          hours: 3,
        },
      ],
      1: [
        {
          project: "Mobile App",
          typeOfWork: "UI development",
          description: "Improved mobile navigation",
          hours: 8,
        },
      ],
      2: [
        {
          project: "Mobile App",
          typeOfWork: "Bug fixes",
          description: "Fixed mobile UI issues",
          hours: 8,
        },
      ],
      3: [
        {
          project: "Mobile App",
          typeOfWork: "Testing",
          description: "Tested mobile screens",
          hours: 8,
        },
      ],
      4: [],
    },
  },

  // Week 12 - Current week
  // Monday Aug 17 -> Thursday Aug 20
  // Friday Aug 21 is future
  {
    id: "week-12",
    week: 12,
    mondayISO: "2026-08-17",
    isCurrent: true,
    entriesByDayIndex: {
      0: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Improved timesheet UI",
          hours: 4,
        },
        {
          project: "Timesheet Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed table spacing",
          hours: 2,
        },
      ],
      1: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Bug fixes",
          description: "Fixed table alignment",
          hours: 7,
        },
      ],
      2: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Feature development",
          description: "Improved entry modal",
          hours: 5,
        },
        {
          project: "Internal Tools",
          typeOfWork: "Meetings",
          description: "Discussed UI updates",
          hours: 3,
        },
      ],
      3: [
        {
          project: "Timesheet Portal",
          typeOfWork: "Code review",
          description: "Reviewed timesheet changes",
          hours: 5,
        },
      ],
      4: [],
    },
  },

  // Future week
  {
    id: "week-13",
    week: 13,
    mondayISO: "2026-08-24",
    entriesByDayIndex: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    },
  },
];

const WEEKLY_HOURS_TARGET = 40;

function buildDays(seed: WeekSeed): TimesheetDay[] {
  const shells = getWeekdayShells(seed.mondayISO);
  return shells.map((shell, index) => ({
    date: shell.date,
    fullDate: shell.fullDate,
    entries: (seed.entriesByDayIndex[index] ?? []).map((entry) => ({
      id: nextEntryId(),
      ...entry,
    })),
  }));
}

function computeStatus(days: TimesheetDay[]): TimesheetStatus {
  const totalHours = days.reduce(
    (sum, day) =>
      sum + day.entries.reduce((daySum, entry) => daySum + entry.hours, 0),
    0,
  );
  if (totalHours === 0) return "MISSING";
  if (totalHours >= WEEKLY_HOURS_TARGET) return "COMPLETED";
  return "INCOMPLETE";
}

interface StoredWeek {
  id: string;
  week: number;
  mondayISO: string;
  isCurrent: boolean;
  days: TimesheetDay[];
}

const weeks: StoredWeek[] = weekSeeds.map((seed) => ({
  id: seed.id,
  week: seed.week,
  mondayISO: seed.mondayISO,
  isCurrent: !!seed.isCurrent,
  days: buildDays(seed),
}));

function toSummary(week: StoredWeek): TimesheetSummary {
  return {
    id: week.id,
    week: week.week,
    dateRangeLabel: formatWeekRangeLabel(week.mondayISO),
    status: computeStatus(week.days),
    month: getWeekMonthLabel(week.mondayISO),
  };
}

function toDetail(week: StoredWeek): TimesheetWeekDetail {
  return { ...toSummary(week), days: week.days };
}

export interface ListTimesheetsParams {
  status?: TimesheetStatus | "all";
  /** Inclusive ISO date (YYYY-MM-DD). Weeks that overlap [startDate, endDate] are included. */
  startDate?: string;
  /** Inclusive ISO date (YYYY-MM-DD). Weeks that overlap [startDate, endDate] are included. */
  endDate?: string;
  page?: number;
  perPage?: number;
}
export function listTimesheets(params: ListTimesheetsParams = {}) {
  const { status = "all", startDate, endDate, page = 1, perPage = 5 } = params;

  const filtered = weeks
    .filter((week) => {
      if (!startDate && !endDate) return true;
      const weekStart = week.mondayISO;
      const weekEnd = getWeekEndISO(week.mondayISO);
      // Overlap check: the week's [start, end] range intersects the
      // requested [startDate, endDate] range. This is what makes a
      // range spanning multiple weeks return every week it touches,
      // even ones only partially covered by the selected range.
      const afterStart = !startDate || weekEnd >= startDate;
      const beforeEnd = !endDate || weekStart <= endDate;
      return afterStart && beforeEnd;
    })
    .map(toSummary)
    .filter((ts) => (status === "all" ? true : ts.status === status));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return {
    items,
    meta: { total, page: safePage, perPage, totalPages },
  };
}

export function getWeekDetail(weekId: string): TimesheetWeekDetail | null {
  const week = weeks.find((w) => w.id === weekId);
  return week ? toDetail(week) : null;
}

export function getCurrentWeekId(): string {
  return weeks.find((w) => w.isCurrent)?.id ?? weeks[0].id;
}

export function addEntry(
  weekId: string,
  dayFullDate: string,
  entry: {
    project: string;
    typeOfWork: string;
    description: string;
    hours: number;
  },
): TimesheetEntry | null {
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return null;
  const day = week.days.find((d) => d.fullDate === dayFullDate);
  if (!day) return null;

  const newEntry: TimesheetEntry = { id: nextEntryId(), ...entry };
  day.entries.push(newEntry);
  return newEntry;
}

export function updateEntry(
  weekId: string,
  entryId: string,
  patch: Partial<{
    project: string;
    typeOfWork: string;
    description: string;
    hours: number;
  }>,
): TimesheetEntry | null {
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return null;

  for (const day of week.days) {
    const entry = day.entries.find((e) => e.id === entryId);
    if (entry) {
      Object.assign(entry, patch);
      return entry;
    }
  }
  return null;
}

export function deleteEntry(weekId: string, entryId: string): boolean {
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return false;

  for (const day of week.days) {
    const index = day.entries.findIndex((e) => e.id === entryId);
    if (index !== -1) {
      day.entries.splice(index, 1);
      return true;
    }
  }
  return false;
}
