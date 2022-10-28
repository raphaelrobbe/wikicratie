
// base clients
// export type RubriqueBaseClients = 'objectifs' |
//   'caracInvest' |
//   'financement' |
//   'resultats' |
//   'etudeComparative' |
//   'approcheEpargne' |
//   'documents' |
//   'simuRevente';

import { NomModuleNiveau1 } from "./structureUrls";

export interface InfosPathGeneral {
  nomModuleNiveau1: NomModuleNiveau1;
}
export interface InfosPathArticles extends InfosPathGeneral {
  nomModuleNiveau1: 'articles';
  idArticle: number;
}
export interface InfosPathLexique extends InfosPathGeneral {
  nomModuleNiveau1: 'lexique';
  idMot: number;
}

export interface InfosTypeFichierArticles extends InfosPathArticles {
  typeFichier: string;
}
export interface InfosTypeFichierLexique extends InfosPathLexique {
  typeFichier: string;
}
export interface InfosFichierArticles extends InfosTypeFichierArticles {
  fileName?: string;
}
export interface InfosFichierLexique extends InfosTypeFichierLexique {
  fileName?: string;
}

export type InfosTypeFichier = InfosTypeFichierArticles | InfosTypeFichierLexique;

export type InfosFichier = InfosFichierArticles | InfosFichierLexique;

export type InfosPath = InfosPathArticles | // avec idArticle
  InfosPathLexique; // avec idMot
