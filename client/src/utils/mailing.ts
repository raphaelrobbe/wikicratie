import { NomAdresse, ReplaceDuet } from "../../../common/types/mailing";

export const replaceAllFromAllDuets = (texte: string, replaceDuets: ReplaceDuet[]): string => {
  let _ret = texte;
  for (let i = 0; i < replaceDuets.length; i += 1) {
    const repTo = replaceDuets[i].to !== null ? replaceDuets[i].to : '';
    _ret = _ret.replace(replaceDuets[i].from, repTo as string);
  }
  return _ret;
}

export const isAdresseMailValide = (adresse: string): boolean => {
  if (adresse === undefined) {
    return false;
  }
  return !!adresse.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i);
}

export const getListeDestMailsTexte = (listeDest: NomAdresse[]): string => {
  if (listeDest.length === 0) {
    return '';
  }
  return listeDest.map((dest, i) => {
    return `${
      dest.label !== ``
        ? `"${dest.label}" `
        : ``
    }<${dest.adresse}>${i < listeDest.length - 1 ? `\n` : ``}`;
  }).reduce((a, b) => `${a}${b}`);
}
