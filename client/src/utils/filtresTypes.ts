export const filterInt = (
  value: number | string | undefined | null | any,
  renvoieSiNaN?: number | null,
): number | undefined | null => {
  if (value === null || value === undefined) {
    return renvoieSiNaN === undefined ? NaN : renvoieSiNaN;
  }
  if (/^(-|\+)?(\d+|Infinity)$/.test(value.toString())) {
    return Number(value);
  }
  return renvoieSiNaN === undefined ? NaN : renvoieSiNaN;
}
