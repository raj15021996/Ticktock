/**
 * Date helpers used only by the server-side mock database to derive
 * weekday lists and human-readable date range labels from a week's
 * Monday start date, so we don't have to hand-write every label.
 */

const DAY_COUNT = 5; // Monday - Friday

export interface WeekDayShell {
  date: string; // e.g. "Jan 22"
  fullDate: string; // ISO date, e.g. "2024-01-22"
}

/** Returns Monday-Friday shells (no entries yet) for a given Monday ISO date. */
export function getWeekdayShells(mondayISO: string): WeekDayShell[] {
  const start = new Date(`${mondayISO}T00:00:00`);
  const shells: WeekDayShell[] = [];

  for (let i = 0; i < DAY_COUNT; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    shells.push({
      date: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: current.toISOString().slice(0, 10),
    });
  }

  return shells;
}

/** Returns the ISO end date (Friday) for a Monday-start week. */
export function getWeekEndISO(mondayISO: string): string {
  const start = new Date(`${mondayISO}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + (DAY_COUNT - 1));
  return end.toISOString().slice(0, 10);
}

/** Formats a Monday-start week into a "22 - 26 January, 2024" style label, handling month/year boundaries. */
export function formatWeekRangeLabel(mondayISO: string): string {
  const start = new Date(`${mondayISO}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + (DAY_COUNT - 1));

  const startMonth = start.toLocaleDateString("en-US", { month: "long" });
  const endMonth = end.toLocaleDateString("en-US", { month: "long" });
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${start.getDate()} - ${end.getDate()} ${startMonth}, ${startYear}`;
  }
  if (startYear === endYear) {
    return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth}, ${startYear}`;
  }
  return `${start.getDate()} ${startMonth} ${startYear} - ${end.getDate()} ${endMonth} ${endYear}`;
}

/** Returns a "January 2024" style label for the week's starting month, used for date-range filtering. */
export function getWeekMonthLabel(mondayISO: string): string {
  const start = new Date(`${mondayISO}T00:00:00`);
  return start.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}