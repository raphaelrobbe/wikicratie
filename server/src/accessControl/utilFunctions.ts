import { getDroitsResponseDefault } from "../../../client/src/defaultObjects/droitsServerDefault";
import { Droits, GetDroitsResponse } from "../../../common/types/droitsServer";

export const ANDGetDroitsResponse = (
  returnValueDroits1: GetDroitsResponse,
  returnValueDroits2: GetDroitsResponse,
): GetDroitsResponse => {
  const ret = getDroitsResponseDefault;
  ret.message = `${returnValueDroits1.message} - ${returnValueDroits2.message}`;
  ret.success = returnValueDroits1.success && returnValueDroits2.success;
  ret.create = returnValueDroits1.create && returnValueDroits2.create;
  ret.get = returnValueDroits1.get && returnValueDroits2.get;
  ret.update = returnValueDroits1.update && returnValueDroits2.update;
  ret.delete = returnValueDroits1.delete && returnValueDroits2.delete;
  return { ...ret };
}

export const resumeDroits = (droits: Droits): string => {
  const ret = `${droits.create ? 'C' : ''
    }${droits.get ? 'G' : ''
    }${droits.update ? 'U' : ''
    }${droits.delete ? 'D' : ''
    }`;
  return ret === '' ? 'aucun' : ret;
}
