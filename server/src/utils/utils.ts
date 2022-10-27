import fs from 'fs';
// import mkdirp from 'mkdirp';

import { RowDataPacket } from 'types/sql';


// function to encode file data to base64 encoded string
export const base64_encode = (file: string): string => {
    // read binary data
    try {
      const bitmap = fs.readFileSync(file);
      // convert binary data to base64 encoded string
      return Buffer.from(bitmap).toString('base64');
      // return new Buffer(bitmap).toString('base64');
    } catch (e) {
      console.log('base64_encode, problème de readFileSync : ', e);
      return '';
    }
}

interface JsonExtendOptions {
  tabKeyToExclude?: string[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonExtend = (dest: any, src: any, options?: JsonExtendOptions): any => {
  // eslint-disable-next-line no-restricted-syntax
  const keys = Object.keys(src)
    .filter(key => !options || !options.tabKeyToExclude || !options.tabKeyToExclude.includes(key));

  for (const key of keys) {
    // eslint-disable-next-line no-param-reassign
    dest[key] = src[key];
  }
  return dest;
}

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// doit fonctionner mais pas utilisé, mis en commentaire
// but : fusionner les returnValue en concaténant les message
// en donnant comme argument pour concat : ['message']
// export const jsonExtend = <R, S extends R, T extends R>(dest: S, src: T, concat: (keyof R)[] = []): any => {
//   // eslint-disable-next-line no-restricted-syntax
//   for (const key of Object.keys(src) as (keyof R)[]) {
//     if (concat.includes(key)) {
//       dest[key] = `${dest[key]} ${src[key]}` as any;
//     } else {
//       // eslint-disable-next-line no-param-reassign
//       dest[key] = src[key] as any;
//     }
//   }
//   return dest;
// }


const filterAttributes = (
  objectToFilter: RowDataPacket,
  arrayOfAttributesToFilter: string[],
  arrayOfNewAttributesNames: string[]
): RowDataPacket => {
  let currentKey;
  let currentNewKey;
  const currentFilteredObject: RowDataPacket = {};
  // it would be so simple to modify the argument...
  let arrayOfNewAttributesNames2;
  if (arrayOfNewAttributesNames.length === 0
    || arrayOfAttributesToFilter.length !== arrayOfNewAttributesNames.length) {
    arrayOfNewAttributesNames2 = [...arrayOfAttributesToFilter];
  } else {
    arrayOfNewAttributesNames2 = [...arrayOfNewAttributesNames];
  }

  for (let j = 0; j < arrayOfAttributesToFilter.length; j += 1) {
    currentKey = arrayOfAttributesToFilter[j];
    currentNewKey = arrayOfNewAttributesNames2[j];
    currentFilteredObject[currentNewKey] = objectToFilter[currentKey];
  }

  return currentFilteredObject;
}

export const filterRowDataPacketArray = (
  toFilter: RowDataPacket[],
  arrayOfAttributesToFilter: string[],
  arrayOfNewAttributesNames: string[]
): RowDataPacket[] => {
  // console.log('filterAttributes');
  const filtered = new Array(toFilter.length);

  for (let i = 0; i < toFilter.length; i += 1) {
    filtered[i] = filterAttributes(toFilter[i], arrayOfAttributesToFilter, arrayOfNewAttributesNames);
  }
  return filtered;
}

// export const removeChamp = (object: any, champ: string): void => {
//   delete object[champ];
// }

export const echappeApostrophes = (value: string): string => {
  // console.log(value);
  // console.log(value.replace(/e/g, "f"));
  return (value as string).replace(/'/g, "\\'");
}

const twoDigits = (d: number): string => {
  if (0 <= d && d < 10) return "0" + d.toString();
  if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
  return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
export const convertDateNowToDatetimeMySQL = (): string => {
  const date = new Date();
  return `${date.getUTCFullYear()}-${twoDigits(1 + date.getUTCMonth())}-${
    twoDigits(date.getUTCDate())} ${twoDigits(date.getUTCHours())}:${
      twoDigits(date.getUTCMinutes())}:${twoDigits(date.getUTCSeconds())}`;
};

export const isDateStringPassee = (dateString: Date, jusquaMinuitSoir = false): boolean => {
  console.log(dateString);

  if (dateString === undefined) {
    return true;
  }
  const maintenant = new Date();
  const maintenantTab = [
    maintenant.getUTCFullYear(),
    twoDigits(1 + maintenant.getUTCMonth()),
    twoDigits(maintenant.getUTCDate()),
    twoDigits(maintenant.getUTCHours()),
    twoDigits(maintenant.getUTCMinutes()),
  ];
  const date = [
    dateString.getUTCFullYear(),
    twoDigits(1 + dateString.getUTCMonth()),
    twoDigits(dateString.getUTCDate()),
    twoDigits(dateString.getUTCHours()),
    twoDigits(dateString.getUTCMinutes()),
  ];
  console.log(maintenantTab, date);

  for (let i = 0; i < (jusquaMinuitSoir ? 3 : 5); i += 1) {
    if (date[i] > maintenantTab[i]) {
      return false;
    }
  }
  return true;
}
