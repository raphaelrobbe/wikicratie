import { Droits, GetDroitsResponse } from "../../../common/types/droitsServer"

export const returnValueSuccessDroits = (create: boolean, get: boolean, update: boolean, del: boolean) => {
  return {
    create,
    get,
    update,
    delete: del,
    message: '',
    success: true,
  }
}

// peut tout faire
export const droitsCGUD: Droits = {
  create: true,
  get: true,
  update: true,
  delete: true,
}
// peut tout faire sauf supprimer
export const droitsCGU: Droits = {
  create: true,
  get: true,
  update: true,
  delete: false,
}
// peut seulement lire et modifier (utilisateurs non gérants sur eux-même)
export const droitsGU: Droits = {
  create: false,
  get: true,
  update: true,
  delete: false,
}
// peut lire, modifier, supprimer (exemple : simu particulière pour client)
export const droitsGUD: Droits = {
  create: false,
  get: true,
  update: true,
  delete: true,
}
// peut seulement lire
export const droitsG: Droits = {
  create: false,
  get: true,
  update: false,
  delete: false,
};
// aucun droit
export const droitsAucunDroit: Droits = {
  create: false,
  get: false,
  update: false,
  delete: false,
}

export const getDroitsResponseDefault: GetDroitsResponse = {
  success: false,
  message: '',
  ...droitsAucunDroit,
}

export const returnValueSuccessCGUD: GetDroitsResponse = {
    ...droitsCGUD,
    success: true,
    message: '',
  }
export const returnValueSuccessCGU: GetDroitsResponse = {
    ...droitsCGU,
    success: true,
    message: '',
  }
export const returnValueSuccessGU: GetDroitsResponse = {
    ...droitsGU,
    success: true,
    message: '',
  }
export const returnValueSuccessGUD: GetDroitsResponse = {
    ...droitsGUD,
    success: true,
    message: '',
  }
export const returnValueSuccessAucunDroit: GetDroitsResponse = {
    ...droitsAucunDroit,
    success: true,
    message: '',
  }
export const returnValueSuccessG: GetDroitsResponse = {
  ...droitsG,
  success: true,
  message: '',
}
