import { InfosPath, InfosTypeFichier } from "./files";
import { InfosMailCoteClient } from "./mailing";

export type NomRequete =
  // sans besoin token
  | 'connect'
  | 'activationCompte'
  | 'demandeReinitPassword'

  // avec token
  // connexion
  | 'autoConnect'
  | 'chargementDonnees'
  | 'disconnect'
  | 'reinitPassword'
  | 'modifPassword'

  | 'sendMail'

  // administration
  | 'hasUserAcces'
  | 'updateUserUserActif'
  | 'getLogs'
  | 'genereLienActivationCompte'
  | 'createAccesUser'

  // gestion des fichiers
  | 'getListeFiles' // peut faire partie d'un chargement de données global
  | 'deleteFile'
  | 'uploadFile'
  | 'genererPdf' // xmlhttp.responseType = "arraybuffer"; -> traitement séparé
  | 'getFile'; // xmlhttp.responseType = "arraybuffer"; -> traitement séparé
  ;

export interface DataRequeteInterneServeur {
  useBaseLocale: boolean;
}

export interface DataJsonRequestBase {
  requestType: NomRequete;
  useBaseLocale: boolean;
  token: string;
}


export interface DataSendMailRequest extends DataJsonRequestBase {
  requestType: 'sendMail';
  infosMailCoteClient: InfosMailCoteClient;
}
export interface DataGenererPdfRequest extends DataJsonRequestBase {
  requestType: 'genererPdf';
  infosPath: InfosPath;
  // mode_portrait: number;
  enregistrerSurServeur: boolean;
}
export interface DataGetListeFilesRequest extends DataJsonRequestBase {
  requestType: 'getListeFiles';
  infosTypeFichier: InfosTypeFichier;
}
export interface DataDeleteFileRequest extends DataJsonRequestBase {
  requestType: 'deleteFile';
  infosTypeFichier: InfosTypeFichier;
  fileName: string;
}
export interface DataUploadFileRequest extends DataJsonRequestBase {
  requestType: 'uploadFile';
  // formData: FormData;
  file: string;
  fileName: string;
  infosTypeFichier: InfosTypeFichier;
  ecraseSiExiste: boolean;
}
export interface DataGetFileRequest extends DataJsonRequestBase {
  requestType: 'getFile';
  infosTypeFichier: InfosTypeFichier;
  fileName: string;
}
export interface DataGetLogsRequest extends DataJsonRequestBase {
  requestType: 'getLogs';
  fromNbSecondesPasse?: number;
  toNbSecondesPasse?: number;
  limit?: number;
}
