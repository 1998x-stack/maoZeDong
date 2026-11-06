/** Validate a historical date without interpreting it in the local time zone. */
export function isValidCalendarDate(value, precision) {
  if (typeof value !== 'string') return false;
  const patterns = {
    year: /^(\d{4})$/,
    month: /^(\d{4})-(\d{2})$/,
    day: /^(\d{4})-(\d{2})-(\d{2})$/,
  };
  const match = patterns[precision]?.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  if (year < 1) return false;
  if (precision === 'year') return true;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return false;
  if (precision === 'month') return true;
  const day = Number(match[3]);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= days[month - 1];
}
