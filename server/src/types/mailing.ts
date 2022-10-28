import { ContenuMail, InfosMail } from "../../../common/types/mailing";


// clients
export const stringCivNomPrenomToReplace = `___NOM_PRENOM___`;
export const stringAdresseMailUserToReplace = `___ADRESSE_MAIL_USER___`;
export const stringAdresseCPUserToReplace = `___ADRESSE_CP_USER___`;
export const stringAdresseVilleUserToReplace = `___ADRESSE_VILLE_USER___`;
export const stringTelUserToReplace = `___TEL_USER___`;
export const stringCherCivNomPrenomToReplace = `___CHER_NOM_PRENOM___`;
export const stringCherCivNomUserToReplace = `___CHER_NOM_USER___`;

// gestion compte
export const stringLienReinitMdpToReplace = `___LIEN_REINIT_MDP___`;
export const stringLoginToReplace = `___LOGIN_CREATION_COMPTE___`;

/* Spécifique création accès */
export const stringDateValiditeValidationCompteToReplace = `___DATE_VALIDITE_VALIDATION_COMPTE___`;


export const stringLogoToReplace = `______logo______`;


export const contenuMailVide: ContenuMail = {
  html: `<html></html>`,
  texte: ``,
}

export const infosMailVide: InfosMail = {
  destTo: [],
  destCc: [],
  destCci: [],
  mail: contenuMailVide,
  // from: null,
  // replyTo: null,
  objet: '',
  pathsPiecesJointes: [],
} // pas encore utilisé

