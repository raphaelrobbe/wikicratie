import { Paragraphe } from "../../../common/types/typesArticles";
import { MinutesSecondes } from "../../../common/types/typesTime";

export const getMinutesSecondesFromSecondes = (nbSec: number | null | undefined): MinutesSecondes => {
  const returnValue: MinutesSecondes = {
    secondes: 0,
    minutes: 0,
  }
  if (!nbSec) {
    return returnValue; // fonction si nbSec = 0
  }

  const minutesEntieres = Math.floor(nbSec / 60);
  const secondesRestantes = Math.round(nbSec - 60 * minutesEntieres)
  returnValue.minutes = minutesEntieres;
  returnValue.secondes = secondesRestantes;
  return returnValue;
}


const getTwoDigits = (nb: number): string => {
  if (nb < 10) {
    return `0${nb}`;
  } else {
    return nb.toString().substring(-2);
  }
}

export const getAffichageFromSecondes = (nbSec: number | null | undefined): string => {
  if (nbSec === undefined || nbSec === null) {
    return '--:--';
  }
  return getAffichageFromMinSec(getMinutesSecondesFromSecondes(nbSec));
}

export const getAffichageFromMinSec = (minSec: MinutesSecondes): string => {
  return `${getTwoDigits(minSec.minutes)}:${getTwoDigits(minSec.secondes)}`
}

export const getDateMaxParaArray = (paras: Paragraphe[]): Date => {
  return [
      ...(paras.map(p => getDateMaxPara(p))),
    ].reduce((c, n) => n < c ? n : c);
}
export const getDateMaxPara = (para: Paragraphe): Date => {
  if (!Array.isArray(para.texte)) {
    return para.dateDerniereModif;
  } else {
    return [
      ...(para.texte.map(t => getDateMaxPara(t))),
      para.dateDerniereModif,
    ].reduce((c, n) => n < c ? n : c);
  }
}
