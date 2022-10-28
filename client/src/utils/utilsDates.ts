import { filterInt } from "./filtresTypes";

/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d: number) {
  if(0 <= d && d < 10) return "0" + d.toString();
  if(-10 < d && d < 0) return "-0" + (-1*d).toString();
  return d.toString();
}

/**
* …and then create the method to output the date string as desired.
* Some people hate using prototypes this way, but if you are going
* to apply this to more than one Date object, having it as a prototype
* makes sense.
**/
export const toMysqlFormat = (date: Date, avecHMS = true) => {
  const dateAMJ = date.getFullYear()
    + "-" + twoDigits(1 + date.getMonth())
    + "-" + twoDigits(date.getDate());
  if (avecHMS) {
    return dateAMJ
      + " " + twoDigits(date.getHours())
      + ":" + twoDigits(date.getMinutes())
      + ":" + twoDigits(date.getSeconds());
  } else {
    return dateAMJ;
  }
};

export const dateInputToDate = (dateInput: string): Date | null => {
  if (typeof dateInput !== 'string') {
    console.log(`dateInputToDate, dateInput : ${dateInput}`)
    return null;
  }
  const dateSplitted = dateInput.split('-');
  if (dateSplitted.length !== 3) {
    return null;
  }
  const annee = filterInt(dateSplitted[0], null) as number | null;
  const mois = filterInt(dateSplitted[1], null) as number | null;
  const jour = filterInt(dateSplitted[2], null) as number | null;
  if (annee === null
    || mois === null
    || jour === null
  ) {
      return null;
  }
  return new Date(annee, mois - 1, jour);
};
export const timeInputToTime = (timeInput: string): Date | null => {
  if (typeof timeInput !== 'string') {
    console.log(`timeInputToTime, timeInput : ${timeInput}`)
    return null;
  }
  const timeSplitted = timeInput.split(':');
  if (timeSplitted.length < 2) {
    return null;
  }
  const heure = filterInt(timeSplitted[0], null) as number | null;
  const minute = filterInt(timeSplitted[1], null) as number | null;
  if (heure === null
    || minute === null
  ) {
      return null;
  }
  return new Date(0, 0, 0, heure, minute);
};

declare global {
  interface Date {
    addDays(d: number): Date;
  }
}
Date.prototype.addDays = function (d: number) { return new Date(this.valueOf() + 864E5 * d); };

export const addJoursDateInput = (dateInput: string, nbJours: number): string | null => {
  const dateDate = dateInputToDate(dateInput);
  if (dateDate === null) {
    return null;
  }
  const dateDecalee = dateDate.addDays(nbJours);
  const retDate = toMysqlFormat(dateDecalee, false);
  return retDate;
}

/**
* Méthode pour créer un format de date lisible et qui peut être utilisé
* dans un nom de fichier.
**/
export const date2ReadableFileDate = (date: Date) => {
  return date.getUTCFullYear()
    + twoDigits(1 + date.getUTCMonth())
    + twoDigits(date.getUTCDate())
    + "_" + twoDigits(date.getUTCHours())
    + twoDigits(date.getUTCMinutes())
    + twoDigits(date.getUTCSeconds());
};

/**
* Méthode pour créer à partir du format readableFileDate
* un objet Date
**/
export const readableFileDate2Date = (readableDate: string): Date | null => {
  const nomSansExtSPlitted = readableDate.split('_');
  if (nomSansExtSPlitted.length !== 2) {
    return null;
  }
  if (nomSansExtSPlitted[0].length !== 8 || nomSansExtSPlitted[1].length !== 6) {
    return null;
  }
  const year = filterInt(readableDate.substring(0, 4), 2021) as number;
  const monthIndex = filterInt(readableDate.substring(4, 6), 1) as number - 1;
  const day = filterInt(readableDate.substring(6, 8), 1) as number;
  const hour = filterInt(readableDate.substring(9, 11), 0) as number;
  const minutes = filterInt(readableDate.substring(11, 13), 0) as number;
  const seconds = filterInt(readableDate.substring(13, 15), 0) as number;
  return new Date(Date.UTC(year, monthIndex, day, hour, minutes, seconds));
};

export const dateSqlToDate = (sqlTimestamp: string): Date | null => {
  // console.log(`dateSqlToDate, sqlTimestamp = ${sqlTimestamp}`);
  const a = sqlTimestamp.split(" ");
  if (a.length < 2) {
    return null;
  }
  const d = a[0].split("-");
  const t = a[1].split(":");
  if (d.length < 3 || t.length < 3) {
    return null;
  }
  const formatedDate = new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]),
    parseInt(t[0]), parseInt(t[1]), parseInt(t[2]));
  return formatedDate;
}

/**
* Calcule la différence entre une date et une deuxième (si deuxième pas précisée : maintenant)
* @param stringDate1 date 1
* @param stringDate2 date 2 facultative (si pas précisée : maintenant)
* @returns  nombre d'années, arrondi par défaut
*/
export const diffEnAnnees = (stringDate1: string, stringDate2?: string): number | undefined => {
  const date1OuNull = dateInputToDate(stringDate1);
  if (date1OuNull === null) {
    return undefined;
  }
  const date2OuNull = stringDate2 === undefined ? null : dateInputToDate(stringDate2);
  const date2 = date2OuNull === null
    ? new Date()
    : date2OuNull;
  const diffDatesMS = date2.getTime() - date1OuNull.getTime();
  return Math.floor(diffDatesMS / (365.25 * 24 * 60 * 60 * 1000));
}

export const dateInputToPrintableString = (date: string): string => {
  const _dateDate = dateInputToDate(date);
  if (_dateDate === null) {
    return `\u00a0\u00a0\u00a0\u00a0/\u00a0\u00a0\u00a0\u00a0/\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0`;
  }
  return _dateDate.toLocaleDateString();
}

/**
* Calcule la différence entre une date et une deuxième (si deuxième pas précisée : maintenant)
* dates au format Date
* @param stringDate1 date 1
* @param stringDate2 date 2 facultative (si pas précisée : maintenant)
* @returns  nombre de jours, arrondis par défaut
*/
export const diffEnJoursDates = (date1: Date, date2: Date): number | undefined => {
  const diffDatesMS = date2.getTime() - date1.getTime();
  return Math.floor(diffDatesMS / (24 * 60 * 60 * 1000));
}

/**
* Calcule la différence entre une date et une deuxième (si deuxième pas précisée : maintenant)
* dates au format dateInput
* @param stringDate1 date 1
* @param stringDate2 date 2 facultative (si pas précisée : maintenant)
* @returns  nombre de jours, arrondis par défaut
*/
export const diffEnJours = (stringDate1: string, stringDate2?: string): number | undefined => {
  const date1OuNull = dateInputToDate(stringDate1);
  if (date1OuNull === null) {
    return undefined;
  }
  const date2OuNull = stringDate2 === undefined ? null : dateInputToDate(stringDate2);
  const date2 = date2OuNull === null
    ? new Date()
    : date2OuNull;
  return diffEnJoursDates(date1OuNull, date2);
}
