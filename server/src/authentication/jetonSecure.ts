import srs from 'secure-random-string';

export const getNouveauJeton = (): string => {
  const jeton = srs({ alphanumeric: true, length: 10 });
  return jeton;
}

