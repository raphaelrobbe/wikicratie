export interface Droits {
  create: boolean;
  get: boolean;
  update: boolean;
  delete: boolean;
}
export interface GetDroitsResponse extends Droits {
  success: boolean;
  message: string;
}

export interface DataGetDroitsUserXSur {
  idXCertifie: number;
  typeUserXCertifie: number;
  useBaseLocale: boolean;
}
export interface DataGetDroitsUserXSurUserY extends DataGetDroitsUserXSur {
  idY: number;
  typeUserY: number;
  pourEnvoiMail?: boolean;
}
export interface DatagetDroitsUserSurArticle extends DataGetDroitsUserXSur {
  idArticle: number;
}
