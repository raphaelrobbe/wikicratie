import { Article, ArticleServeur } from "../../client/src/classes/classeArticle";
import { ParagrapheServeur } from "./typesArticles";

export interface ServerResponse {
  success: boolean;
  message: string;
  invalidToken?: boolean;
  // versionServeur?: string;
  // versionClient?: string;
  dateIndexHtml?: string;
  // lang?   : string;
}

export interface GetLogsResponse extends ServerResponse {
  logs: any;
  idRequeteGetLogs: string;
}
export type DemandeReinitPasswordResponse = ServerResponse;

export type DisconnectResponse = ServerResponse;
export type ReinitPasswordResponse = ServerResponse;
export type ActivationCompteResponse = ServerResponse;
export type ModifPasswordResponse = ServerResponse;
export interface GenereLienActivationCompteResponse extends ServerResponse {
  jeton: string;
  lienActivationCompte: string;
  jetonExpiration: number;
}
export interface HasUserAccesResponse extends ServerResponse {
  hasAcces: boolean;
  isActif: boolean;
}
export interface ConnectResponse extends ServerResponse {
  token: string; // '' si erreur
  codeErreur: number;
  jetonMustReinitPassword?: string;
}
export interface CheckPasswordResponse extends ServerResponse {
  codeErreur: number;
  type_user: number;
  id: number;
}
export interface UpdateHashPwdUserResponse extends ServerResponse {
  typeUsager: number;
  jetonExpiration?: number;
}
export interface PublicDataLoadingResponse extends ServerResponse {
  articles: ArticleServeur[];
}
export interface GetArticlesResponse extends ServerResponse {
  articles: ArticleServeur[];
}
export interface GetParagraphesResponse extends ServerResponse {
  paragraphes: ParagrapheServeur[];
}
