import { toBase } from "./base";
import { clamp } from "./number";

type GetUniqueIdArgs = {
  precision?: number;
  base?: number;
  keys?: string;
};
/**
 * Get a unique id based on time
 * Duplicate timestamps will be distinguished using a counter (up to a certain precision)
 *
 * @param param0 An object expecting optional arguments:
 *
 * Precision: The number of extra decimal places appended to each millisecond timestamp (avoids collisions via a counter)
 *      Default is millisecond precision, ie precision = 0
 *      Nano sec precision = 3
 *      Micro sec precision = 6
 *
 * Base: The base to convert the timestamp + counter id into
 *      The default is 62 (Upper/Lowercase letters and numbers)
 *      The maximum base using the default 'keys' is 64
 *
 * Keys: The character set to represent the value in the new base
 *      The default set is "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/"
 *
 * @returns A string representing a timestamp + counter value, converted/compressed into the specified base
 */
export const genId = ({ precision = 0, base = 62, keys }: GetUniqueIdArgs) => {
  return toBase(now(precision), base, keys);
};

// TIME HELPER

/**
 * Get timestamp now plus extra precision (via a counter)
 * Nano sec: precision = 3
 * Micro sec: precision = 6
 *
 * Duplicate timestamp will return once precision is exceeded
 *
 * @param precision Number of extra decimal places after ms
 * @returns Ms + extra precision timestamp
 */
let lastMs = Date.now();
let counter = 0;
const now = (precision: number) => {
  const timeMs = Date.now();
  // Same ms
  if (timeMs === lastMs) counter++;
  else {
    lastMs = timeMs;
    counter = 0;
  }

  return timeMs * 10 ** precision + clamp(counter, 0, 10 ** precision - 1);
};
