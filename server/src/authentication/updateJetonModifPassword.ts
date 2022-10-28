import { sqlUpdate } from "sqlRequests/basicRequests";
import { SqlCondition } from "types/sql";
import { TYPE_USER_UTILISATEUR } from "../../../client/src/utils/clientCommServerConstants";
import { UpdateHashPwdUserResponse } from "../../../common/types/serverResponses";
import { DUREE_SECONDES_VALIDITE_JETON_ACTIVATION_COMPTE, DUREE_SECONDES_VALIDITE_JETON_MODIF_MDP } from "./constants";

interface UpdateJetonModifPasswordProps {
  hashJetonModifPassword: number;
  // user_login: string;
  id: number;
  typeUser: number;
  useBaseLocale: boolean;
  activationCompte?: boolean;
}
const updateJetonModifPassword = async ({
  hashJetonModifPassword,
  // user_login,
  id,
  typeUser,
  useBaseLocale,
  activationCompte = false,
}: UpdateJetonModifPasswordProps): Promise<UpdateHashPwdUserResponse> => {
  const returnValue: UpdateHashPwdUserResponse = {
    success: false,
    message: 'probleme updateJetonModifPassword',
    typeUsager: TYPE_USER_UTILISATEUR,
    jetonExpiration: 0,
  };
  const condition: SqlCondition[] = [
    // {
    //   column: 'user_login',
    //   value: user_login,
    // }
    {
      column: 'id_base_propre',
      value: id,
    },
    {
      column: 'type_user',
      value: typeUser,
    },
  ];

  const jetonExpiration = Math.round(new Date().getTime() / 1000
    + (activationCompte
      ? DUREE_SECONDES_VALIDITE_JETON_ACTIVATION_COMPTE
      : DUREE_SECONDES_VALIDITE_JETON_MODIF_MDP
    ));
  const toUpdate: SqlCondition[] = [
    { column: 'jeton_modif_password', value: hashJetonModifPassword },
    { column: 'jeton_modif_password_expires', value: jetonExpiration },
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
    const message = `erreur sqlUpdate, updateJetonModifPassword, affectedRows = ${retUpdate.affectedRows}`
    console.log(message);
    returnValue.message = message;
    return returnValue;
  }
  returnValue.jetonExpiration = jetonExpiration;
  returnValue.success = true;
  returnValue.message = 'OK';

  // console.log('updateClient, returnValue=');
  // console.log(returnValue);

  return returnValue;
}

export default updateJetonModifPassword;
