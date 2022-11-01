import {
  TYPE_USER_ADMIN, TYPE_USER_PUBLIC,
  TYPE_USER_UTILISATEUR, TYPE_USER_VISITEUR,
} from "./constants/clientCommServerConstants";

export const isUserAdmin = (typeUser: number): boolean => {
  return typeUser === TYPE_USER_ADMIN;
}
export const isUserUtilisateur = (typeUser: number): boolean => {
  return typeUser === TYPE_USER_UTILISATEUR;
}
export const isUserVisiteur = (typeUser: number): boolean => {
  return typeUser === TYPE_USER_VISITEUR;
}
export const isUserPublic = (typeUser: number): boolean => {
  return typeUser === TYPE_USER_PUBLIC;
}
