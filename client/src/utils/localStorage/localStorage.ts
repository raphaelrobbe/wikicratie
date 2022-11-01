import { SiteLS } from "../../../../common/types/users";

// const skjlnUtn = `qskonesuyv986BSzkZBf`;
export const getSiteLocalStorage = (siteName: string): SiteLS | null => {
  const tempSiteLS = window.localStorage.getItem(siteName);

  if (tempSiteLS === null) {
    return null;
  }

  // tentative de chiffrement du localstorage mais decrypt plante (aesjs.ModeOfOperation.ctr)
  // const tempSiteNameDecrypted = decrypt(tempSiteName, lotFraisGestion);

  // if (tempSiteNameDecrypted === null) {
  //   return null;
  // }

  return JSON.parse(tempSiteLS);
  // return JSON.parse(tempSiteNameDecrypted);
}

export const setSiteLocalStorage = (siteLS: SiteLS, siteName: string): void => {
  const siteLSString = JSON.stringify(siteLS);
  window.localStorage.setItem(siteName, siteLSString);

  // tentative de chiffrement du localstorage mais decrypt plante (aesjs.ModeOfOperation.ctr)
  // const tempSiteNameEncrypted = encrypt(siteLSString, lotFraisGestion);

  // if (tempSiteNameEncrypted === null) {
  //   return;
  // }
  // window.localStorage.setItem(siteName, tempSiteNameEncrypted);
}

export const removeSiteLocalStorage = (siteName: string): void => {
  window.localStorage.removeItem(siteName);
}
