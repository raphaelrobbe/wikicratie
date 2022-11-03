import { InfosPath, InfosTypeFichier } from "./files";
import { InfosMailCoteClient } from "./mailing";

export type NomRequete =
  // sans besoin token
  | 'connect'
  | 'activationCompte'
  | 'demandeReinitPassword'
  | 'publicDataLoading'

  // avec token
  // connexion
  | 'autoConnect'
  | 'userDataLoading'
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


// TABLE USER

export interface DataConnectRequest extends DataJsonRequestBase {
  requestType: 'connect';
  user_login: string;
  password: string;
  idConseiller?: number;
}
export interface DataDemandeReinitPasswordRequest extends DataJsonRequestBase {
  requestType: 'demandeReinitPassword';
  userLoginOuEmail: string;
  mail: { texte: string; html: string };
}
export interface DataHasUserAccesRequest extends DataJsonRequestBase {
  requestType: 'hasUserAcces';
  idBasePropre: number;
  typeUser: number;
}
// export interface DataHasConseillerAcces extends DataJsonRequestBase {
//   requestType: 'hasConseillerAcces';
//   idConseiller: number;
// }
export interface DataReinitPasswordRequest extends DataJsonRequestBase {
  requestType: 'reinitPassword';
  password: string;
  jetonModifPassword: string;
}
export interface DataActivationCompteRequest extends DataJsonRequestBase {
  requestType: 'activationCompte';
  password: string;
  jetonModifPassword: string;
}
export interface DataModifPasswordRequest extends DataJsonRequestBase {
  requestType: 'modifPassword';
  oldPassword: string;
  newPassword: string;
}
export interface DataGenereLienActivationCompteRequest extends DataJsonRequestBase {
  requestType: 'genereLienActivationCompte';
  idBasePropre: number;
  typeUser: number;
  // user_login: string;
}
export interface DataCheckPassword {
  user_login: string;
  password: string;
  useBaseLocale: boolean;
}
export interface DataAutoConnectRequest extends DataJsonRequestBase {
  requestType: 'autoConnect';
  idConseiller?: number;
}
export interface DataPublicDataLoadingRequest extends DataJsonRequestBase {
  requestType: 'publicDataLoading';
  isPdfGeneration: boolean;
}


export interface DataGetArticles extends DataRequeteInterneServeur {
}
export interface DataGetParagraphes extends DataRequeteInterneServeur {
  id_article: number;
}




export type DataJsonRequest =
  | DataConnectRequest
  | DataDemandeReinitPasswordRequest
  | DataHasUserAccesRequest
  | DataReinitPasswordRequest
  | DataActivationCompteRequest
  | DataModifPasswordRequest
  | DataGenereLienActivationCompteRequest
  | DataAutoConnectRequest
  | DataPublicDataLoadingRequest;
