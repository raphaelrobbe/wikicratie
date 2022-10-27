import {
  DataCheckPassword, DataReinitPassword,
  DataDemandeReinitPassword,
  DataGenereLienActivationCompte,
  DataHasUserAcces,
} from '../../../common/types/serverRequests';
import {
  HasUserAccesResponse,  DemandeReinitPasswordResponse,
  GenereLienActivationCompteResponse,
  ConnectResponse, DisconnectResponse,
  CheckPasswordResponse,
  ReinitPasswordResponse,
} from '../../../common/types/serverResponses';

import {
  sqlDelete, sqlInsert, sqlSelectAllFromTable, sqlSelectFromTable, sqlUpdate,
} from '../sqlRequests/basicRequests';
import {
  CODE_ERREUR_CHECKPWD_COMPTE_INACTIVE,
  CODE_ERREUR_CHECKPWD_LOGIN_OU_MDP_INVALIDE,
  CODE_ERREUR_CHECKPWD_MUST_REINIT,
  CODE_ERREUR_CHECKPWD_PB_LECTURE_TABLE,
  CODE_ERREUR_CHECKPWD_PLUSIEURS_USERS,
  CODE_ERREUR_CHECKPWD_TROP_TENTATIVES_BLOQUE,
  CODE_ERREUR_CREATE_TOKEN_PB,
  DUREE_SECONDES_VALIDITE_TOKEN,
  MESSAGE_ERREUR_CHECKPWD_COMPTE_INACTIVE,
  MESSAGE_ERREUR_CHECKPWD_LOGIN_OU_MDP_INVALIDE,
  MESSAGE_ERREUR_CHECKPWD_PB_LECTURE_TABLE,
  MESSAGE_ERREUR_CHECKPWD_PLUSIEURS_USERS,
  MESSAGE_ERREUR_CHECKPWD_TROP_TENTATIVES_BLOQUE,
  MESSAGE_ERREUR_CREATE_TOKEN_PB,
} from '../../../client/src/utils/serverConstants';
import { logger } from 'logger';
import { hashSimple } from '../../../client/src/utils/utilRandom';
import { TYPE_USER_PUBLIC } from '../../../client/src/utils/clientCommServerConstants';
import { STRING_PREFIXE_JETON } from './constants';
import { getContraintesMdpNonRespectees } from '../../../client/src/utils/mdp';
import updateHashPwdUserViaJeton from './updateHashPwdUserViaJeton';
import { getNomAdresseUser } from './getNomAdresseUser';
import { InfosMail, ReplaceDuet } from '../../../common/types/mailing';
import { infosMailVide, stringCivNomPrenomToReplace, stringLienReinitMdpToReplace } from 'types/mailing';
import { getNouveauJeton } from './jetonSecure';
import { prefixeUrl } from '../../../client/src/datas/paths';
import updateJetonModifPassword from './updateJetonModifPassword';
import setCompteurTentativesLogin from './setCompteurTentativesLogin';
import completeEtEnvoieMail from 'mailing/completeEtEnvoieMail';


export const refreshToken = async (token: string): Promise<boolean> => {
  const token_expires = Math.round(new Date().getTime()/1000 + DUREE_SECONDES_VALIDITE_TOKEN);
  const hashJetonConnexion = hashSimple(`${STRING_PREFIXE_JETON}${token}`);

  const retRefreshToken = await sqlUpdate(
    'jeton',
    [{ column: 'token_expires', value: token_expires }],
    [{ column: 'token', value: hashJetonConnexion }],
    false,
  );

  if (retRefreshToken.affectedRows !== 1) {
    console.log(`Erreur lors du rafraichissement du token`);
    return false;
  }

  console.log("refreshToken OK");
  return true;
}

interface IsTokenValidResponse {
  id: number;
  type_user: number;
  token_expires: number;
  id_origine_as: number;
  type_user_origine_as: number;
}
export const isTokenValid = async (token: string, ipAddress: string, useBaseLocale: boolean): Promise<IsTokenValidResponse> => {
  const returnValue: IsTokenValidResponse = {
    id: -1,
    type_user: TYPE_USER_PUBLIC,
    token_expires: 0,
    id_origine_as: -1,
    type_user_origine_as: TYPE_USER_PUBLIC,
  }
  // console.log(`jeton reçu : ${token}`);
  const hashJetonConnexion = hashSimple(`${STRING_PREFIXE_JETON}${token}`);

  const retGetTokenExpires = await sqlSelectFromTable(
    'jeton',
    ['token_expires', 'user_login', 'type_user', 'id', 'ip_address', 'id_origine_as', 'type_user_origine_as'],
    [
      { column: 'token', value: hashJetonConnexion },
      // { column: 'user_login', value: user_login },
    ],
    false,
  );
  if (!retGetTokenExpires) {
    console.log(`Problème de lecture de la table jeton`);
    return returnValue;
  } else if (retGetTokenExpires.length === 0) {
    console.log(`Pas de jeton correspondant`);
    return returnValue;
  } else if (retGetTokenExpires.length > 1) {
    console.log(`Plusieurs jetons correspondant : effacés`);
    sqlDelete(
      'jeton',
      [{ column: 'token', value: hashJetonConnexion }],
      false,
    );
    return returnValue;
  }
  const { user_login, token_expires, id, type_user, ip_address, id_origine_as, type_user_origine_as } = retGetTokenExpires[0];
  // adresse du serveur (pour pdf) en liste blanche : 164.132.50.222
  if (ipAddress !== '"164.132.50.222"' && ip_address !== ipAddress) {
    console.log(`Adresse ip différente ! Tentative d'intrusion. Suppression  du jeton, par sécurité.`);
    console.log(`ipAttendue = ${ip_address}`);
    console.log(`ipRecue = ${ipAddress}`);
    logger.info(`Jeton avec mauvaise adresse IP. Tentative d'intrusion détectée. Jeton supprimé par sécurité.`, {
      ipAttendue: ip_address,
      ipRecue: ipAddress,
      success: false,
      id_origine_as,
      type_user_origine_as,
      requestType: `INVALID IP ADDRESS`,
    });
    sqlDelete(
      'jeton',
      [{ column: 'token', value: hashJetonConnexion }],
      false,
    );
    return returnValue;
  }
  const ret = token_expires > Math.floor(new Date().getTime() / 1000);
  if (!ret) {
    console.log(`Jeton périmé. Effacé.`);
    sqlDelete(
      'jeton',
      [{ column: 'token', value: hashJetonConnexion }],
      false,
    );
    return returnValue;
  }

  returnValue.id_origine_as = id_origine_as;
  returnValue.type_user_origine_as = type_user_origine_as;

  returnValue.id = id
  returnValue.type_user = type_user;
  returnValue.token_expires = token_expires;
  return returnValue;
}

/**
 * Get le user pour savoir si le compte est créé
 * et si oui, pour savoir s'il est actif
 * @param reqBody
 * @returns
 */
export const hasUserAcces = async (
  reqBody: DataHasUserAcces,
): Promise<HasUserAccesResponse> => {
  const returnValue: HasUserAccesResponse = {
    success: false,
    message: '',
    hasAcces: false,
    isActif: false,
  }
  const {
    useBaseLocale,
    idBasePropre,
    typeUser,
  } = reqBody;

  const retGetUser = await sqlSelectFromTable(
    'user',
    ['user_login', 'id_user', 'user_actif'],
    [
      { column: 'id_base_propre', value: idBasePropre },
      { column: 'type_user', value: typeUser },
    ],
    useBaseLocale,
  );
  if (!retGetUser) {
    returnValue.message = `Pb de lecture de la table user`;
    return returnValue;
  }

  if (retGetUser.length === 0) {
    console.log(`aucun user de type ${typeUser} avec l'id ${idBasePropre}`);
    returnValue.message = ``;
    returnValue.hasAcces = false; // redondant
    returnValue.isActif = false; // redondant
  } else if (retGetUser.length > 1) {
    console.log(`plus d'un user de type ${typeUser} avec l'id ${idBasePropre}`);
    returnValue.message = ``;
    return returnValue;
  } else {
    console.log(`un user de type ${typeUser} avec l'id ${idBasePropre}`);
    returnValue.hasAcces = true;
    returnValue.isActif = retGetUser[0].user_actif === 1;
  }
  returnValue.success = true;
  return returnValue;
}

/**
 * Modifie le mot de passe d'après le jeton (en searchparam dans l'url)
 * et après vérification de sa date de validité
 * @param reqBody
 * @returns
 */
export const reinitPwdBase = async (
  reqBody: DataReinitPassword,
): Promise<ReinitPasswordResponse> => {
  const returnValue: ReinitPasswordResponse = {
    success: false,
    message: '',
    // user: conseillerVide,
  }
  const {
    useBaseLocale,
    jetonModifPassword,
    password,
  } = reqBody;

  if (jetonModifPassword === '' || jetonModifPassword === null) {
    console.log(`reinitPwdBase, jetonModifPassword vide ou null`);
    return returnValue;
  }

  const hashJetonModifPassword = hashSimple(`${STRING_PREFIXE_JETON}${jetonModifPassword}`);

  if (getContraintesMdpNonRespectees(password).length > 0) {
    console.log(`Tentative de réinitialisation de mot de passe avec un mot de passe faible.`);
    return returnValue;
  }

  const retGetUser = await sqlSelectAllFromTable(
    'user',
    [{ column: 'jeton_modif_password', value: hashJetonModifPassword }],
    useBaseLocale,
  );
  if (!retGetUser) {
    returnValue.message = `Pb de lecture de la table user`;
    return returnValue;
  }

  if (retGetUser.length === 0) {
    returnValue.message = `Lien invalide.`;
    return returnValue;
  } else if (retGetUser.length > 1) {
    returnValue.message = `Erreur dans la table conseiller, plusieurs conseillers avec le même login`;
    return returnValue;
  }

  const id_user = retGetUser[0].id_user;

  if (retGetUser[0].jeton_modif_password_expires === undefined) {
    console.log(`reinitPwdBase, !retGetUser[0].jeton_modif_password_expires`);
    returnValue.message = `Problème de lecture de la base de données.`;
    return returnValue;
  }

  const dateNow = +new Date() / 1000;
  console.log(`reinitPwdBase,
  dateExpirationJeton = ${retGetUser[0].jeton_modif_password_expires}, dateNow = ${dateNow}`);
  console.log(`dateExpirationJeton - dateNow : ${retGetUser[0].jeton_modif_password_expires - dateNow}`);

  if (retGetUser[0].jeton_modif_password_expires < dateNow) {
    returnValue.message = `Lien expiré.`;
    return returnValue;
  }

  const hashedPwd = hashSimple(password);

  const retUpdateHashPwd = await updateHashPwdUserViaJeton({ hashJetonModifPassword, hashedPwd, useBaseLocale });
  if (!retUpdateHashPwd.success) {
    returnValue.message = retUpdateHashPwd.message;
  } else {
    returnValue.message = `Réinitialisation du mot de passe ok`;
    returnValue.success = true;
    logger.info(`réinit de mdp du user d'id ${id_user} réussie`, {
      id_user: id_user,
      requete: 'reinitPassword',
    });
  }

  return returnValue;
}


/**
 * Demande une réinitialisation du mot de passe
 * Envoie un mail à l'utilisateur avec un lien contenant un jeton en searchparam.
 * Quand l'utilisateur clique sur ce lien, il arrive sur une page
 * lui demandant sonnouveau mot de passe, ce qui envoie la requête reinitPassword
 * TODO : faire la version avec adresse mail (recherche dans table user du user_login associé)
 * @param reqBody
 * @returns
 */
export const demandeReinitPwdBase = async (
  reqBody: DataDemandeReinitPassword,
): Promise<DemandeReinitPasswordResponse> => {
  const returnValue: DemandeReinitPasswordResponse = {
    success: false,
    message: '',
  }
  const {
    userLoginOuEmail,
    mail,
    useBaseLocale,
  } = reqBody;

  const user_login = userLoginOuEmail;

  console.log(`demandeReinitPwdBase, user_login = ${user_login}`);

  // version user_login uniquement
  const retGetUser = await sqlSelectAllFromTable(
    'user',
    [{ column: 'user_login', value: user_login }],
    useBaseLocale,
  );
  if (!retGetUser) {
    console.log(`Pb de lecture de la table user`);
    // returnValue.message = `Pb de lecture de la table user`;
    return returnValue;
  }

  if (retGetUser.length === 0) {
    console.log(`Utilisateur inconnu.`);
    // returnValue.message = `Utilisateur inconnu.`;
    return returnValue;
  } else if (retGetUser.length > 1) {
    console.log(`Erreur dans la table user, plusieurs users avec le même login`);
    // returnValue.message = `Erreur dans la table user, plusieurs users avec le même login`;
    return returnValue;
  }
  const idUserDestinataire = retGetUser[0].id_user;
  const typeUserDestinataire = retGetUser[0].type_user;

  const idBasePropre = retGetUser[0].id_base_propre;
  const typeUser = retGetUser[0].type_user;

  let avatar = '';
  const destTo = [await getNomAdresseUser(idBasePropre, typeUser, useBaseLocale)];


  logger.info(`demande de réinit de mdp de ${destTo[0].label}`, {
    id_user: idUserDestinataire,
    requete: 'demandeReinitPassword',
  });

  // tester si user_email vide ?


  const infosMail: InfosMail = {
    ...infosMailVide,
    destTo,
    mail,
    objet: `Réinitialisation de mot de passe`
  }

  const jetonModifPassword = getNouveauJeton();
  const hashJetonModifPassword = hashSimple(`${STRING_PREFIXE_JETON}${jetonModifPassword}`);

  const retUpdateJetonModifPassword = await updateJetonModifPassword({
    hashJetonModifPassword,
    id: idBasePropre,
    typeUser: typeUser,
    useBaseLocale,
  });
  if (!retUpdateJetonModifPassword.success) {
    returnValue.message = retUpdateJetonModifPassword.message;
  } else {
    const regexNomPrenom = new RegExp(stringCivNomPrenomToReplace, "g");
    const regexLienReinitMdp = new RegExp(stringLienReinitMdpToReplace, "g");
    const lienReinitMdp = useBaseLocale || process.env.NODE_ENV === 'development'
      ? `http://localhost:3000${prefixeUrl}/reinitMdp?j=${jetonModifPassword}`
      : `https://raf-prag.com${prefixeUrl}/reinitMdp?j=${jetonModifPassword}`;

    const replaceDuets: ReplaceDuet[] = [
      { from: regexNomPrenom, to: destTo[0].label },
      { from: regexLienReinitMdp, to: lienReinitMdp },
    ];

    const retSendMail = await completeEtEnvoieMail({
      idUserExpediteur: -1,
      idsUserDestinataire: [idUserDestinataire],
      typesUserDesinataires: [typeUserDestinataire],
      typeUserExpediteur: TYPE_USER_PUBLIC,
      infosMail,
      replaceDuets,
      from: null,
    });
    if (!retSendMail.success) {
      returnValue.message = retSendMail.message;
      return returnValue;
    }
    returnValue.message = ``;
    returnValue.success = true;
  }

  return returnValue;
}


/**
 * Génère un jeton de modif de mot de passe
 * pour activation d'un compte (durée : 1 jour)
 * @param reqBody
 * @returns
 */
export const genereLienActivationCompte = async (
  reqBody: DataGenereLienActivationCompte,
): Promise<GenereLienActivationCompteResponse> => {
  const returnValue: GenereLienActivationCompteResponse = {
    jeton: '',
    lienActivationCompte: '',
    success: false,
    message: '',
    jetonExpiration: 0,
  }
  const {
    // user_login,
    idBasePropre,
    typeUser,
    useBaseLocale,
  } = reqBody;

  console.log(`genereLienActivationCompte, idBasePropre = ${idBasePropre}, typeUser = ${typeUser}`);

  const jetonModifPassword = getNouveauJeton();
  const hashJetonModifPassword = hashSimple(`${STRING_PREFIXE_JETON}${jetonModifPassword}`);

  const retUpdateJetonModifPassword = await updateJetonModifPassword({
    hashJetonModifPassword,
    // user_login,
    id: idBasePropre,
    typeUser,
    useBaseLocale,
    activationCompte: true,
  });
  if (!retUpdateJetonModifPassword.success) {
    returnValue.message = retUpdateJetonModifPassword.message;
  } else {
    const lienActivationCompte = useBaseLocale || process.env.NODE_ENV === 'development'
      ? `http://localhost:3000${prefixeUrl}/activationCompte?j=${jetonModifPassword}`
      : `https://ajnae.fr${prefixeUrl}/activationCompte?j=${jetonModifPassword}`;
    returnValue.jeton = jetonModifPassword;
    returnValue.lienActivationCompte = lienActivationCompte;
    returnValue.jetonExpiration = retUpdateJetonModifPassword.jetonExpiration ? retUpdateJetonModifPassword.jetonExpiration : 0;
    returnValue.message = ``;
    returnValue.success = true;
  }

  return returnValue;
}


export const checkPassword = async (
  reqBody: DataCheckPassword,
): Promise<CheckPasswordResponse> => {
  const returnValue: CheckPasswordResponse = {
    success:false,
    message: '',
    codeErreur: -1,
    type_user: TYPE_USER_PUBLIC,
    id: -1,
  }

  const {
    user_login,
    password,
    useBaseLocale,
  } = reqBody;

  const hashedPwd = hashSimple(password);

  const retGetUser = await sqlSelectAllFromTable(
    'user',
    [{ column: 'user_login', value: user_login }],
    useBaseLocale,
  );
  if (!retGetUser) {
    returnValue.message = MESSAGE_ERREUR_CHECKPWD_PB_LECTURE_TABLE;
    returnValue.codeErreur = CODE_ERREUR_CHECKPWD_PB_LECTURE_TABLE;
    return returnValue;
  }

  if (retGetUser.length === 0) {
    returnValue.message = MESSAGE_ERREUR_CHECKPWD_LOGIN_OU_MDP_INVALIDE;
    returnValue.codeErreur = CODE_ERREUR_CHECKPWD_LOGIN_OU_MDP_INVALIDE;
    return returnValue;
  } else if (retGetUser.length > 1) {
    returnValue.message = MESSAGE_ERREUR_CHECKPWD_PLUSIEURS_USERS;
    returnValue.codeErreur = CODE_ERREUR_CHECKPWD_PLUSIEURS_USERS;
    return returnValue;
  }

  // sinon, un user a été trouvé
  const utilisateurActif = retGetUser[0].user_actif;
  if (!utilisateurActif) {
    returnValue.message = MESSAGE_ERREUR_CHECKPWD_COMPTE_INACTIVE;
    returnValue.codeErreur = CODE_ERREUR_CHECKPWD_COMPTE_INACTIVE;
    return returnValue;
  }
  const nbTentativesRestantes = retGetUser[0].tentatives_restantes;
  const hashPwd: number = retGetUser[0].hash_password;

  if (nbTentativesRestantes === 0) {
    returnValue.message = MESSAGE_ERREUR_CHECKPWD_TROP_TENTATIVES_BLOQUE;
    returnValue.codeErreur = CODE_ERREUR_CHECKPWD_TROP_TENTATIVES_BLOQUE;
    return returnValue;
  }

  const nbConnexionsReussies = retGetUser[0].nb_connexions_reussies;
  const nbConnexionsEchouees = retGetUser[0].nb_connexions_echouees;

  if (hashedPwd === hashPwd) {
    if (getContraintesMdpNonRespectees(password).length > 0) {
      returnValue.codeErreur = CODE_ERREUR_CHECKPWD_MUST_REINIT;
    }
    returnValue.success = true;
    setCompteurTentativesLogin({
      user_login,
      nb: 'reinit',
      nbConnexionsReussies,
      nbConnexionsEchouees,
      useBaseLocale,
    });
    // const retUPdateCompteurTentativesLogin = await setCompteurTentativesLogin('reinit');
  } else {
    returnValue.message = MESSAGE_ERREUR_CHECKPWD_LOGIN_OU_MDP_INVALIDE;
    returnValue.codeErreur = CODE_ERREUR_CHECKPWD_LOGIN_OU_MDP_INVALIDE;
    setCompteurTentativesLogin({
      user_login,
      nb: nbTentativesRestantes - 1,
      nbConnexionsReussies,
      nbConnexionsEchouees,
      useBaseLocale,
    });
  }

  returnValue.type_user = retGetUser[0].type_user ? retGetUser[0].type_user : TYPE_USER_PUBLIC;
  returnValue.id = retGetUser[0].id_base_propre ? retGetUser[0].id_base_propre : -1;

  return returnValue;
}

const getTokenTokenExpires = (): { token: string; token_expires: number } => {
  const token = getNouveauJeton();
  const token_expires = Math.round(new Date().getTime() / 1000 + DUREE_SECONDES_VALIDITE_TOKEN);

  return { token, token_expires };
}

export const createToken = async (
  user: { user_login: string; password: string, ipAddress: string },
  useBaseLocale: boolean,
): Promise<ConnectResponse> => {
  const returnValue: ConnectResponse = {
    success: false,
    message: MESSAGE_ERREUR_CREATE_TOKEN_PB,
    codeErreur: CODE_ERREUR_CREATE_TOKEN_PB,
    token: '',
  };
  const {
    user_login,
    password,
    ipAddress,
  } = user;
  // console.log(`createToken, user : ${JSON.stringify(user)}`);

  const retCheckPassword = await checkPassword({
    useBaseLocale,
    user_login,
    password,
  });
  const {
    type_user,
    id,
    codeErreur,
  } = retCheckPassword;

  if (!retCheckPassword.success) {
    returnValue.message = retCheckPassword.message;
    returnValue.codeErreur = codeErreur;
    console.log(`createToken, échec de la vérificationde mot de passe : ${returnValue.message}`);
    return returnValue;
  }


  if (codeErreur === CODE_ERREUR_CHECKPWD_MUST_REINIT) {
    const jetonModifPassword = getNouveauJeton();
    const hashJetonModifPassword = hashSimple(`${STRING_PREFIXE_JETON}${jetonModifPassword}`);

    const retUpdateJetonModifPassword = await updateJetonModifPassword({
      hashJetonModifPassword,
      // user_login,
      typeUser: type_user,
      id,
      useBaseLocale,
    });
    if (!retUpdateJetonModifPassword.success) {
      returnValue.message = retUpdateJetonModifPassword.message;
    } else {
      console.log("creation de jeton modification password OK");
      returnValue.codeErreur = codeErreur;
      returnValue.jetonMustReinitPassword = jetonModifPassword;
      returnValue.message = 'Utilisateur non authentifié, doit réinitialiser son mot de passe.';
      return returnValue;
    }
  } else {
    const {
      token,
      token_expires,
    } = getTokenTokenExpires();
    const hashJetonConnexion = hashSimple(`${STRING_PREFIXE_JETON}${token}`);

    const retCreateToken = await sqlInsert(
      'jeton',
      [
        { column: 'user_login', value: user_login },
        { column: 'token', value: hashJetonConnexion },
        { column: 'token_expires', value: token_expires },
        { column: 'id', value: id },
        { column: 'type_user', value: type_user },
        { column: 'ip_address', value: ipAddress },
      ],
      false,
    );

    if (retCreateToken.affectedRows === 1) {
      console.log("creation de jeton OK");
      returnValue.success = true;
      returnValue.token = token;
      returnValue.message = 'Utilisateur authentifié.';
    }
  }

  returnValue.codeErreur = 0;

  return returnValue;
}

export const revokeToken = async (token: string): Promise<DisconnectResponse> => {
  const returnValue: DisconnectResponse = {
    success: false,
    message: 'probleme revokeToken',
  };
  const hashJetonConnexion = hashSimple(`${STRING_PREFIXE_JETON}${token}`);

  const retDeleteJeton = await sqlDelete(
    'jeton',
    [{ column: 'token', value: hashJetonConnexion }],
    false,
  );

  if (!retDeleteJeton) {
    console.log(`revokeToken, problème lors de la suppression du jeton.`);
    return returnValue;
  }

  console.log(`revokeToken ok`);

  returnValue.success = true;
  returnValue.message = 'Utilisateur déconnecté';
  return returnValue;
}
