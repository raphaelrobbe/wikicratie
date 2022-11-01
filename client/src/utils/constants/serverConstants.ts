// TOKEN
export const DUREE_SECONDES_VALIDITE_TOKEN = 60 * 30; // une demie-heure

// AUTHENTIF
export const NO_SUCH_USER = 'no such user';

// état des requêtes serveur pour traitement du fichier de log
export const REQUETE_STATE_NON_TRAITEE = 1;
export const REQUETE_STATE_TRAITEE = 2;


export const CODE_ERREUR_CHECKPWD_PB_LECTURE_TABLE = 10;
export const MESSAGE_ERREUR_CHECKPWD_PB_LECTURE_TABLE = `Pb de lecture de la table user`;
export const CODE_ERREUR_CHECKPWD_PLUSIEURS_USERS = 11;
export const MESSAGE_ERREUR_CHECKPWD_PLUSIEURS_USERS = `Erreur dans la table user, plusieurs utilisateurs avec le même login`;
export const CODE_ERREUR_CHECKPWD_COMPTE_INACTIVE = 7;
export const MESSAGE_ERREUR_CHECKPWD_COMPTE_INACTIVE = `Compte désactivé. Veuillez contacter votre interlocuteur.`;
export const CODE_ERREUR_CHECKPWD_TROP_TENTATIVES_BLOQUE = 5;
export const MESSAGE_ERREUR_CHECKPWD_TROP_TENTATIVES_BLOQUE = `Trop de tentatives erronées, compte bloqué.`;
export const CODE_ERREUR_CHECKPWD_LOGIN_OU_MDP_INVALIDE = 3;
export const MESSAGE_ERREUR_CHECKPWD_LOGIN_OU_MDP_INVALIDE = `Login ou mot de passe invalide`;
export const CODE_ERREUR_CHECKPWD_MUST_REINIT = 30;
export const MESSAGE_ERREUR_CHECKPWD_MUST_REINIT = `Mot de passe ne respectant pas les contraintes nécessaires`;

export const CODE_ERREUR_CREATE_TOKEN_PB = 20;
export const MESSAGE_ERREUR_CREATE_TOKEN_PB = `probleme createToken`;
export const CODE_ERREUR_CREATE_TOKEN_AS_PB = 21;
export const MESSAGE_ERREUR_CREATE_TOKEN_AS_PB = `probleme createTokenAs`;

