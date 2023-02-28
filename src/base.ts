const KEYS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

/**
 * Convert decimal value to any base
 *
 * @param num The starting decimal value
 * @param base The base to convert to
 * @param keys Optional character set to convert into, else uses "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/"
 * @returns
 */
export function toBase(num: number, base: number, keys: string = KEYS): string {
  const largestPower = ~~(Math.log(num) / Math.log(base));
  let result = "";
  for (let pow = largestPower; pow >= 0; pow--) {
    const digit = ~~(num / base ** pow);
    num -= digit * base ** pow;
    result += keys[digit];
  }
  return result;
}
