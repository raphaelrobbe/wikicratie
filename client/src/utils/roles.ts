import { TYPE_USER_ADMIN, TYPE_USER_UTILISATEUR } from "./clientCommServerConstants";

export const isUserAdmin = (typeUser: number): boolean => {
  return typeUser === TYPE_USER_ADMIN;
}
export const isUserUtilisateur = (typeUser: number): boolean => {
  return typeUser === TYPE_USER_UTILISATEUR;
}
