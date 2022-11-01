import { NomRequete } from "../../../common/types/serverRequests";
import {
  TYPE_USER_ADMIN, TYPE_USER_PUBLIC,
  TYPE_USER_UTILISATEUR, TYPE_USER_VISITEUR,
} from "./constants/clientCommServerConstants";

export const ACLAdmin = [
  TYPE_USER_ADMIN,
];
export const ACLUtilisateur = [
  ...ACLAdmin,
  TYPE_USER_UTILISATEUR,
];

// les non public et non visiteurs
export const ACLConnecteCompte = [
  ...ACLUtilisateur,
];

export const ACLVisiteur = [
  ...ACLConnecteCompte,
  TYPE_USER_VISITEUR,
];
export const ACLPublic = [
  ...ACLVisiteur,
  TYPE_USER_PUBLIC,
];


export type TableAcces = 'article' | 'questionFAQ'
  | 'traitementParticulier' | 'traitementTresParticulier';

// ACLS DETAILLEES TYPE
export interface TypeAccesRequete {
  accesA: TableAcces;
  typeAcces: 'get' | 'update' | 'delete';
  keyIdToCheck: string;
}
export interface ACLDetaillee {
  ACLGlobale: number[];
  ACLDetaillee: TypeAccesRequete[];
}
export type ListeACLsDetaillees = {
  [x in NomRequete]: ACLDetaillee;
}


const ACLArticleGet: TypeAccesRequete = {
  accesA: 'article',
  typeAcces: 'get',
  keyIdToCheck: 'id_article',
};
const ACLArticleUpdate: TypeAccesRequete = {
  accesA: 'article',
  typeAcces: 'update',
  keyIdToCheck: 'id_article',
};

const ACLTraitementParticulierGet: TypeAccesRequete = {
  accesA: 'traitementParticulier',
  typeAcces: 'get',
  keyIdToCheck: '',
};

const ACLTraitementParticulierUpdate: TypeAccesRequete = {
  accesA: 'traitementParticulier',
  typeAcces: 'update',
  keyIdToCheck: '',
};
const ACLTraitementTresParticulier: TypeAccesRequete = {
  accesA: 'traitementTresParticulier',
  typeAcces: 'update',
  keyIdToCheck: '',
};

const ACLDetailleeAdmin: ACLDetaillee = {
  ACLGlobale: ACLAdmin,
  ACLDetaillee: [],
};

const ACLDetailleePublic: ACLDetaillee = {
  ACLGlobale: ACLPublic,
  ACLDetaillee: [],
};
const ACLDetailleeVisiteur: ACLDetaillee = {
  ACLGlobale: ACLVisiteur,
  ACLDetaillee: [],
};
const ACLDetailleeConnecteCompte: ACLDetaillee = {
  ACLGlobale: ACLConnecteCompte,
  ACLDetaillee: [],
};

const ACLDetailleeConnecteCompteArticleGet: ACLDetaillee = {
  ACLGlobale: ACLConnecteCompte,
  ACLDetaillee: [ACLArticleGet],
};
const ACLDetailleeConnecteCompteArticleUpdate: ACLDetaillee = {
  ACLGlobale: ACLConnecteCompte,
  ACLDetaillee: [ACLArticleUpdate],
};

const ACLDetailleeConnecteCompteTraitementFichiersGet: ACLDetaillee = {
  ACLGlobale: ACLConnecteCompte,
  ACLDetaillee: [ACLTraitementParticulierGet],
};
const ACLDetailleeConnecteCompteTraitementFichiersUpdate: ACLDetaillee = {
  ACLGlobale: ACLConnecteCompte,
  ACLDetaillee: [ACLTraitementParticulierUpdate],
};

const ACLDetailleeAdminTraitementTresParticulier: ACLDetaillee = {
  ACLGlobale: ACLAdmin,
  ACLDetaillee: [ACLTraitementTresParticulier],
}

// premier filtre :
// lien niveau de privilège <-> type de requête
// deuxième niveau géré dans server.ts avant envoi aux fonctions
// (est-ce qu'un utilisateur à les droits sur un article en particulier par ex.)
export const ACLsDetaillees: ListeACLsDetaillees = {
  //////////////////////
  // SANS AUCUN DROIT : TYPE_USER_PUBLIC
  //////////////////////
  // catégorie à peut être filtrer selon IP
  // pour éviter attaque en déni de service (surcharge requêtes serveur)

  // en cours de connexion
  connect: ACLDetailleePublic,
  // cas non connecté, jeton spécifique fourni
  reinitPassword: ACLDetailleePublic,
  // cas non connecté, jeton spécifique fourni
  activationCompte: ACLDetailleePublic,
  // cas non connecté, mot de passe oublié
  demandeReinitPassword: ACLDetailleePublic,
  publicDataLoading: ACLDetailleePublic,

  //////////////////////
  // VISITEURS
  //////////////////////
  // déconnexion :
  // pas sans droit pour éviter les déconnexions intempestives (attaque)
  // effacement du local storage fait par le client dans tous les cas
  disconnect: ACLDetailleeVisiteur,
  autoConnect: ACLDetailleeVisiteur,
  chargementDonnees: ACLDetailleeVisiteur,

  //////////////////////
  // les NON VISITEUR et NON PUBLIC
  // = utilisateurs connextés
  //////////////////////
  modifPassword: ACLDetailleeConnecteCompte,

  // MAIL
  sendMail: ACLDetailleeConnecteCompte,

  // à traiter séparément -> typeAcces file ou je sais pas
  getListeFiles: ACLDetailleeConnecteCompteTraitementFichiersGet,
  getFile: ACLDetailleeConnecteCompteTraitementFichiersGet,
  uploadFile: ACLDetailleeConnecteCompteTraitementFichiersUpdate,
  deleteFile: ACLDetailleeConnecteCompteTraitementFichiersUpdate,



  // génération des pdf
  genererPdf: ACLDetailleeConnecteCompteTraitementFichiersGet,





  //////////////////////
  // ADMINS
  //////////////////////
  // global
  getLogs: ACLDetailleeAdmin,
  genereLienActivationCompte: ACLDetailleeAdminTraitementTresParticulier,
  createAccesUser: ACLDetailleeAdminTraitementTresParticulier,
  hasUserAcces: ACLDetailleeAdminTraitementTresParticulier,
  updateUserUserActif: ACLDetailleeAdminTraitementTresParticulier,
  // gestion des comptes
};

export const acceptedRequests = Object.keys(ACLsDetaillees) as NomRequete[];
export const publicRequests = acceptedRequests.filter(
  r => ACLsDetaillees[r].ACLGlobale.includes(TYPE_USER_PUBLIC)
);
export const noRenewTokenRequests: NomRequete[] = [
  ...publicRequests,
  'connect',
  'disconnect',
  'getFile',
];

export const requestsTraitementTresParticulier = acceptedRequests.filter(
  el => ACLsDetaillees[el].ACLDetaillee.map(ACL => ACL.accesA).includes('traitementTresParticulier')
);
export const requestsTraitementParticulier = acceptedRequests.filter(
  el => ACLsDetaillees[el].ACLDetaillee.map(ACL => ACL.accesA).includes('traitementParticulier')
);
// console.log(`requestsTraitementTresParticulier : ${requestsTraitementTresParticulier}`);
// console.log(`requestsTraitementParticulier : ${requestsTraitementParticulier}`);

