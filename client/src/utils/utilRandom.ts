export interface StrRandomProps {
    includeUpperCase: boolean;
    includeNumbers: boolean;
    length: number;
    startsWithLowerCase: boolean;
}

export const strRandom = (o: StrRandomProps): string => {
  var a = 10,
      b = 'abcdefghijklmnopqrstuvwxyz',
      c = '',
      d = 0,
      e = ''+b;
  if (o) {
    if (o.startsWithLowerCase) {
      c = b[Math.floor(Math.random() * b.length)];
      d = 1;
    }
    if (o.length) {
      a = o.length;
    }
    if (o.includeUpperCase) {
      e += b.toUpperCase();
    }
    if (o.includeNumbers) {
      e += '1234567890';
    }
  }
  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)];
  }
  return c;
}
export const getUniqueId = (length = 10): string => {
  return strRandom({
    includeUpperCase: true,
    includeNumbers: true,
    length,
    startsWithLowerCase: true
  });
}
export const hashSimple = (s: string): number => {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
