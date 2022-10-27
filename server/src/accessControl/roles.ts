import {
  TYPE_USER_ADMIN, TYPE_USER_PUBLIC,
  TYPE_USER_UTILISATEUR,
  TYPE_USER_VISITEUR,
} from "../../../client/src/utils/clientCommServerConstants";

export const getRole = (typeUser: number): string => {
  switch (typeUser) {
    case TYPE_USER_PUBLIC: return `utilisateur non connecté`;
    case TYPE_USER_UTILISATEUR: return `utilisateur connecté`;
    case TYPE_USER_VISITEUR: return `visiteur`;
    case TYPE_USER_ADMIN: return `administrateur`;
    default: return `type d'utilisateur non reconnu`;
  }
}
