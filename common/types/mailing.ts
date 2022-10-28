
////////////////////
// ** MAILING **  //

import { InfosFichier } from "./files";
import { ServerResponse } from "./serverResponses";

export interface IdTypeUser {
  id: number;
  type_user: number;
}

////////////////////
export interface SendEmailResponse extends ServerResponse {
  // info: any;
}
export type NewsletterMailPurpose = 'newsletter';
export type ContactMailPurpose = 'contact';
export type LienClientMailPurpose = 'lien_client';

export type TexteParagraphes = (string | string[])[];
export type HtmlParagraphes = (
  | string
  | string[]
  | JSX.Element
  | JSX.Element[]
  | (string | JSX.Element)[]
)[];

/**
 * éléments qui contiennent encore des chaînes à remplacer \_\_\_XXX_YY\_\_\_
 * et JSX pour le html, à convertir
 */
export interface ContenuMailAvantConversionString {
  texteBrut: string;
  JSXElementBrut?: JSX.Element;
}
export interface ContenuMail {
  texte: string;
  html: string;
}
export interface NomAdresse {
  label: string;
  adresse: string;
}
export interface DestinatairesMailCoteClient {
  destToIdsTypes: IdTypeUser[];
  destCcIdsTypes: IdTypeUser[];
  destCciIdsTypes: IdTypeUser[];
}
export interface InfosMailCoteClientAvantConversion extends DestinatairesMailCoteClient {
  contenuMailAvantConversion: ContenuMailAvantConversionString;
  objet: string;
  piecesJointes?: InfosFichier[];
}
export interface InfosMailCoteClient extends DestinatairesMailCoteClient {
  mail: ContenuMail;
  // pour from, en fait, on prend l'id et le type_user de l'origine de la requête (certifiés)
  // from: NomAdresse | null;
  // replyTo: NomAdresse | null;
  objet: string;
  piecesJointes?: InfosFichier[];
}
export interface InfosMail {
  destTo: NomAdresse[];
  destCc: NomAdresse[];
  destCci: NomAdresse[];
  mail: ContenuMail;
  // pour from, en fait, on prend l'id et le type_user de l'origine de la requête (certifiés)
  // from: NomAdresse | null;
  // replyTo: NomAdresse | null;
  objet: string;
  pathsPiecesJointes: string[];
}

export interface ReplaceDuet {
  from: string | RegExp;
  to: string | null;
}
