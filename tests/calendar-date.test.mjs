import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidCalendarDate } from '../scripts/calendar-date.mjs';

test('accepts year, month and valid full-date precision', () => {
  for (const [date, precision] of [['1938', 'year'], ['1938-05', 'month'], ['2000-02-29', 'day'], ['2024-02-29', 'day'], ['2026-11-06', 'day']]) {
    assert.equal(isValidCalendarDate(date, precision), true, `${date} should be valid`);
  }
});
test('rejects impossible calendar days and invalid leap years', () => {
  for (const date of ['2026-02-29', '2026-02-31', '2026-04-31', '1900-02-29', '2026-00-01', '2026-13-01', '2026-11-00', '2026-11-32']) {
    assert.equal(isValidCalendarDate(date, 'day'), false, `${date} should be invalid`);
  }
});
test('rejects precision mismatch, non-string input and invalid partial dates', () => {
  for (const [date, precision] of [['2026-01', 'day'], ['2026-01-01', 'month'], ['2026-00', 'month'], ['2026-13', 'month'], ['2026-1', 'month'], [null, 'year'], ['2026', 'unknown']]) {
    assert.equal(isValidCalendarDate(date, precision), false);
  }
});
