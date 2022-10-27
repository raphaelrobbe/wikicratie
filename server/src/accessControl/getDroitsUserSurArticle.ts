import { droitsAucunDroit, returnValueSuccessAucunDroit, returnValueSuccessCGUD, returnValueSuccessGU } from '../../../client/src/defaultObjects/droitsServerDefault';
import { isUserAdmin, isUserUtilisateur } from '../../../client/src/utils/roles';
import { DatagetDroitsUserSurArticle, GetDroitsResponse } from '../../../common/types/droitsServer';


export const getDroitsUserSurArticle = async (
  props: DatagetDroitsUserSurArticle,
): Promise<GetDroitsResponse> => {
  let returnValue: GetDroitsResponse = {
    success: false,
    message: 'probleme getDroitsUserSurArticle',
    ...droitsAucunDroit,
  };

  const {
    idXCertifie,
    typeUserXCertifie,
    idArticle,
  } = props;

  if (isUserAdmin(typeUserXCertifie)) {
    return returnValueSuccessCGUD;
  } else if (isUserUtilisateur(typeUserXCertifie)) {
    // ACCES DEMANDE SUR ...
  } else {
    // console.log(`type_user X non reconnu`);
    return returnValueSuccessAucunDroit;
  }


  // returnValue initialisé à tout false
  // donc on peut return avec success true
  returnValue.success = true;
  returnValue.message = 'OK';

  // console.log('getDroitsUserSurArticle, returnValue=');
  // console.log(returnValue);

  return returnValue;
}
