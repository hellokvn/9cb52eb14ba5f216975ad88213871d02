/*
 * Get week of a date, starting on Sunday
 */
export function getWeekDates(date: Date): Date[] {
  const week: Date[] = [date];

  for (let i = 1; i < 7; i++) {
    week.push(new Date(date.getTime() + 86400000 * i));
  }

  return week;
}
/*
 * Reset hours, minutes, seconds, and milliseconds of a date
 */
export function normalizeDate(date: Date | string = new Date()): Date {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}
