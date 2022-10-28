import { sqlUpdate } from "sqlRequests/basicRequests";
import { SqlCondition } from "types/sql";
import { TYPE_USER_UTILISATEUR } from "../../../client/src/utils/clientCommServerConstants";
import { UpdateHashPwdUserResponse } from "../../../common/types/serverResponses";
import { NB_TENTATIVES_MAX_LOGIN } from "./constants";

const updateHashPwdUserViaJeton = async ({
  hashJetonModifPassword,
  hashedPwd,
  useBaseLocale,
}: {
    hashJetonModifPassword: number;
    hashedPwd: number;
    useBaseLocale: boolean;
}): Promise<UpdateHashPwdUserResponse> => {
  const returnValue: UpdateHashPwdUserResponse = {
    success: false,
    message: 'probleme updateHashPwdUserViaJeton',
    typeUsager: TYPE_USER_UTILISATEUR,
  };

  const condition: SqlCondition[] = [
    {
      column: 'jeton_modif_password',
      value: hashJetonModifPassword,
    }
  ];
  const toUpdate: SqlCondition[] = [
    { column: 'hash_password', value: hashedPwd },
    { column: 'tentatives_restantes', value: NB_TENTATIVES_MAX_LOGIN },
    { column: 'jeton_modif_password_expires', value: 0 },
    { column: 'jeton_modif_password', value: '' },
  ];

  // vérifier appelant
  const retUpdate = await sqlUpdate(
    'user',
    toUpdate,
    condition,
    useBaseLocale,
  );
  // console.log('parties[i] =', parties[i], ' ret=', ret);

  if (retUpdate.affectedRows !== 1) {
    const message = `erreur sqlUpdate, updateHashPwdUserViaJeton, affectedRows = ${retUpdate.affectedRows}`
    console.log(message);
    returnValue.message = message;
    return returnValue;
  }

  returnValue.success = true;
  returnValue.message = 'OK';

  // console.log('updateClient, returnValue=');
  // console.log(returnValue);

  return returnValue;
}

export default updateHashPwdUserViaJeton;
