export type Civilite = 1 | 2; // 1 : monsieur, 2 : madame

export interface UserSansId {
  login: string;
  email_address: string;

  civilite: Civilite;
  nom: string;
  prenom: string;
  type_user: number;
}
export interface User extends UserSansId {
  id_user: number;
}

export type ConnectedUser = {
  token: string;
  type_user: number;
  user: User;
};

export type SiteLS = {
  connectedUser: ConnectedUser;
  nbOpenedConnectedTabs: number;
}
