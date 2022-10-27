import { MessageChargement } from '../../../common/types/clientCommServer';

export const messagesLoader: MessageChargement = {
  connect:`Authentification...`,
  disconnect:`Déconnexion...`,
  autoConnect:`Connexion...`,
  chargementDonnees:`Chargement des données...`,
  deleteFile: `Suppression du fichier...`,
  getFile: `Récupération du fichier...`,
  uploadFile: `Transfert du fichier vers le serveur...`,
  genereLienActivationCompte: `Chargement du lien d'activation du compte...`,
};

// ADMINS
export const TYPE_USER_ADMIN = 1;

// UTILISATEUR CONNEXTE
export const TYPE_USER_UTILISATEUR = 30;

// VISITEURS
export const TYPE_USER_VISITEUR = 90;

//
export const TYPE_USER_PUBLIC = 100;

export const labelsRoles: { type: number, labelRole: string }[] = [
  { type: TYPE_USER_ADMIN, labelRole: `Admin` },
  { type: TYPE_USER_VISITEUR, labelRole: `Visiteur` },
  { type: TYPE_USER_PUBLIC, labelRole: `Public` },
  { type: TYPE_USER_UTILISATEUR, labelRole: `Utilisateur` },
];
