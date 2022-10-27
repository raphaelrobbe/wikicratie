import { droitsAucunDroit, returnValueSuccessAucunDroit, returnValueSuccessCGUD, returnValueSuccessGU } from '../../../client/src/defaultObjects/droitsServerDefault';
import { isUserAdmin, isUserUtilisateur } from '../../../client/src/utils/roles';
import { DataGetDroitsUserXSurUserY, GetDroitsResponse } from '../../../common/types/droitsServer';


export const getDroitsUserXSurUserY = async (
  props: DataGetDroitsUserXSurUserY,
): Promise<GetDroitsResponse> => {
  let returnValue: GetDroitsResponse = {
    success: false,
    message: 'probleme getDroitsUserXSurUserY',
    ...droitsAucunDroit,
  };

  const {
    idXCertifie,
    idY,
    typeUserXCertifie,
    typeUserY,
    pourEnvoiMail = false,
  } = props;

  const userYUtilisateur = isUserUtilisateur(typeUserY);

  if (isUserAdmin(typeUserXCertifie)) {
    return returnValueSuccessCGUD;
  } else if (isUserAdmin(typeUserY)) {
    // si X pas admin, alors aucun droit sur Y admin
    return returnValueSuccessAucunDroit;

    // à partir d'ici, les cas X admin ou Y admin sont traités

    // DEMANDEUR UTILISATEUR
  } else if (isUserUtilisateur(typeUserXCertifie)) {
    // ACCES DEMANDE SUR UTILISATEUR
    if (userYUtilisateur) {
      // SI LUI-MÊME
      if (idXCertifie === idY) {
        return returnValueSuccessGU;
      } else {
        return returnValueSuccessAucunDroit;
      }
    }
  } else {
    console.log(`type_user X non reconnu`);
    return returnValue;
  }


  // returnValue initialisé à tout false
  // donc on peut return avec success true
  returnValue.success = true;
  returnValue.message = 'OK';

  // console.log('getDroitsUserXSurUserY, returnValue=');
  // console.log(returnValue);

  return returnValue;
}
