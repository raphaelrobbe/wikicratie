import { sqlUpdate } from "sqlRequests/basicRequests";
import { SqlCondition } from "types/sql";
import { TYPE_USER_UTILISATEUR } from "../../../client/src/utils/clientCommServerConstants";
import { toMysqlFormat } from "../../../client/src/utils/utilsDates";
import { UpdateHashPwdUserResponse } from "../../../common/types/serverResponses";

interface SetCompteurTentativesLoginProps {
  user_login: string,
  nb: 'reinit' | number,
  nbConnexionsReussies: number,
  nbConnexionsEchouees: number,
  useBaseLocale: boolean,
}
const setCompteurTentativesLogin = async ({
  user_login,
  nb,
  nbConnexionsReussies,
  nbConnexionsEchouees,
  useBaseLocale,
}: SetCompteurTentativesLoginProps): Promise < UpdateHashPwdUserResponse > => {
  const returnValue: UpdateHashPwdUserResponse = {
    success: false,
    message: 'probleme setCompteurTentativesLogin',
    typeUsager: TYPE_USER_UTILISATEUR,
  };

  const NB_TENTATIVES_MAX_LOGIN = 4;

  const condition: SqlCondition[] = [
    {
      column: 'user_login',
      value: user_login,
    }
  ];
  const incrementConnexions: SqlCondition = nb === 'reinit'
    ? {
      column: 'nb_connexions_reussies',
      value: nbConnexionsReussies + 1,
    }
    : {
      column: 'nb_connexions_echouees',
      value: nbConnexionsEchouees + 1,
    };
  const toUpdate: SqlCondition[] = [
    {
      column: 'tentatives_restantes',
      value: nb === 'reinit' ? NB_TENTATIVES_MAX_LOGIN : nb,
    },
    {
      column: 'date_derniere_tentative',
      value: toMysqlFormat(new Date()),
    },
    incrementConnexions,
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
    const message = `erreur sqlUpdate, setCompteurTentativesLogin, affectedRows = ${retUpdate.affectedRows}`
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

export default setCompteurTentativesLogin;
