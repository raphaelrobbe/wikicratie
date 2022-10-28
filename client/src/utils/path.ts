import { Params } from "react-router-dom";

import { pathArticles, sectionsAutorisees } from "../datas/paths";
import {
  InfosPath, InfosFichier, InfosTypeFichier, InfosPathArticles, InfosPathLexique,
} from "../../../common/types/files";
import { UrlParameters } from "../../../common/types/urls";

export const getAllUrlParams = (url: string): UrlParameters => {

  // get query string from url (optional) or window
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  const obj: UrlParameters = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    const arr = queryString.split('&');

    for (let i = 0; i < arr.length; i++) {
      // separate the keys and the values
      const a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      let paramName = a[0];
      let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        const key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          const index = /\[(\d+)\]/.exec(paramName)!.index;
          // const index = /\[(\d+)\]/.exec(paramName)![1];
          (obj[key] as (string | true)[])[index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          (obj[key] as (string | true)[]).push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName] as string | true];
          (obj[paramName] as (string | true)[]).push(paramValue);
        } else {
          // otherwise add the property
          (obj[paramName] as (string | true)[]).push(paramValue);
        }
      }
    }
  }

  return obj;
}


/**
 * Renvoie une chaîne de paramètres optionnels constituée des paramètres
 * pdf et useBaseLocale
 * @param query objet URLSearchParams renvoyé par useQuery()
 * @returns chaîne vide si aucun paramètre optionnel parmi pdf, jonathan et useBaseLocale
 * chaîne de type param1&param2 sinon
 */
export const getSearchPdfUBL = (query: URLSearchParams): string => {
  const searchPdfUBL: string[] = [];
  if (query.has(`pdf`)) {
    searchPdfUBL.push('pdf');
  }
  if (query.has(`useBaseLocale`)) {
    searchPdfUBL.push('useBaseLocale');
  }
  return searchPdfUBL.join('&');
}

export const nettoieStringSearchParams = (stringSearchParams: string): string => {
  const listeParametresOptionnelsSansValeur = [
    'pdf',
    'useBaseLocale',
  ]
  let retValue = 'qoifgvqopindv' + stringSearchParams;
  for (let i = 0; i < listeParametresOptionnelsSansValeur.length; i += 1) {
    const chaine1replacement = `&${listeParametresOptionnelsSansValeur[i]}`;
    const chaine2replacement = `qoifgvqopindv${listeParametresOptionnelsSansValeur[i]}`;
    retValue = retValue.replace(chaine1replacement + '=', chaine1replacement);
    retValue = retValue.replace(chaine2replacement + '=', chaine2replacement);
  }
  retValue = retValue.replace('qoifgvqopindv', '');
  return  retValue;
}

export const getPathArticle = (params: Readonly<Params<string>>): string => {
  const {
    idArticle,
  } = params;
  if (
    idArticle === undefined
  ) {
    return pathArticles;
  }
  return `${pathArticles}/${idArticle}`;
}

export const pathNameRepertoireParent = (pathname: string, nbGenerations = 1): string => {
  return pathname.split('/').slice(0, - nbGenerations).join('/');
}

export const isExpressionValideRepUrl = (arg: number | string | undefined, asInt = false): boolean => {
  if (arg === undefined || arg === null) {
    console.log(`isExpressionValideRepUrl, false car arg === undefined || arg === null`);
    return false;
  }
  const argString = arg.toString();
  if (asInt) {
    if (isNaN(parseInt(argString))) {
      console.log(`isExpressionValideRepUrl, false car integer voulu et pas integer`);
      return false;
    } else {
      return true;
    }
  }
  const ret = argString
    .replace(new RegExp("[^(a-zA-Z0-9_.)]", "g"), '');

  if (argString.length !== ret.length) {
    console.log(`isExpressionValideRepUrl, false, avant : ${argString}, après : ${ret}`);
    return false
  }
  if (asInt && isNaN(parseInt(argString))) {
    console.log(`isExpressionValideRepUrl, false car integer voulu et pas integer`);
    return false;
  }
  return true;
}

export const getPathFromInfosTypeFichier = (infosPath: InfosPath, sansTypeFichier = false): string | null => {
  if (!infosPath) {
    return null;
  }
  const {
    nomModuleNiveau1,
  } = infosPath;
  if (!sectionsAutorisees.includes(nomModuleNiveau1)) {
    return null;
  }
  let pathDir = `/${nomModuleNiveau1}`;

  // baseClient ou suiviProjets -> idClient, idSimu, idLot potentiels
  if (nomModuleNiveau1 === 'articles') {
    const {
      idArticle,
    } = (infosPath as InfosPathArticles);
    if (
      !isExpressionValideRepUrl(idArticle, true)
    ) {
      console.log(`getPathFromInfosTypeFichier, pb avec idClient, idSimu ou idLot`);
      return null;
    }
    pathDir = `${pathDir}/${idArticle}`;
  }

  // si baseClients, ajout du nom de la rubrique, si précisée
  if (nomModuleNiveau1 === 'lexique') {
    const {
      idMot,
    } = (infosPath as InfosPathLexique);
    if (
      !isExpressionValideRepUrl(idMot, true)
    ) {
      console.log(`getPathFromInfosTypeFichier, pb avec idClient, idSimu ou idLot`);
      return null;
    }
    pathDir = `${pathDir}/${idMot}`;
  }

  // si type fichier, on ajoute et on renvoie
  if ((infosPath as InfosTypeFichier).typeFichier) {
    if (!sansTypeFichier) {
      pathDir = `${pathDir}/${(infosPath as InfosTypeFichier).typeFichier}`;
    }
    return pathDir;
  }

  return pathDir;
}

export const getPathFromInfosFichier = (infosFichier: InfosFichier): string | null => {
  const {
    fileName,
  } = infosFichier;
  const pathDir = getPathFromInfosTypeFichier(infosFichier);
  if (pathDir === null) {
    return null;
  } else {
    const path = `${pathDir}/${fileName}`;
    return path;
  }
}
