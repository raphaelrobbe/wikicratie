/* eslint-disable no-case-declarations */
import path from 'path';
import express from 'express';
import http from 'http';
// import timeout from 'connect-timeout';
import fs from 'fs';
import { getUniqueId } from '../../client/src/utils/utilRandom';
import { DataGenererPdfRequest, DataGetFileRequest, DataSendMailRequest, NomRequete } from '../../common/types/serverRequests';
import { DUREE_SECONDES_VALIDITE_TOKEN, REQUETE_STATE_NON_TRAITEE, REQUETE_STATE_TRAITEE } from '../../client/src/utils/serverConstants';
import { acceptedRequests, ACLsDetaillees, noRenewTokenRequests, publicRequests } from '../../client/src/utils/aCLs';
import { TYPE_USER_PUBLIC } from '../../client/src/utils/clientCommServerConstants';
import { logger } from 'logger';
import { createToken, demandeReinitPwdBase, genereLienActivationCompte, hasUserAcces, isTokenValid, refreshToken, reinitPwdBase, revokeToken } from 'authentication/auth';
import { jsonExtend } from 'utils/utils';
import { GetDroitsResponse } from '../../common/types/droitsServer';
import { getDroitsResponseDefault, returnValueSuccessAucunDroit, returnValueSuccessCGUD, returnValueSuccessG } from '../../client/src/defaultObjects/droitsServerDefault';
import { getDroitsUserXSurUserY } from 'accessControl/getDroitsUserXSurUserY';
import { getRole } from 'accessControl/roles';
import { getDroitsUserSurArticle } from 'accessControl/getDroitsUserSurArticle';
import { InfosTypeFichier } from '../../common/types/files';
import { isUserAdmin, isUserUtilisateur } from '../../client/src/utils/roles';
import { ANDGetDroitsResponse, resumeDroits } from 'accessControl/utilFunctions';
import { getPathFromInfosTypeFichier } from '../../client/src/utils/path';
import { prefixeUrl } from '../../client/src/datas/paths';
import { genererPdfDapresUrl } from 'generationFichiers/genererPdfDapresUrl';
import { ConnectedUser } from '../../common/types/users';
import { userDefault } from '../../client/src/defaultObjects/users';
import { getUser } from 'requetesInternes/getUser';
import getLogs from 'requests.ts/getLogs';
process.on('uncaughtException', (err) => {
  console.error('Erreur non prise en charge', err)
  // process.exit(1) //mandatory (as per the Node docs)
});

const app = express();
app.use('/eds', express.static(__dirname + '/eds'));
app.use(express.static(`${__dirname}/build`));

// app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');

console.log(`__dirname : ${__dirname}`);

app.use(express.json({limit: '50mb'})); // for parsing application/json
app.use(express.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded


// pour éviter qu'en cas de mauvais formattage du json en entrée en particulier, la réponse
// ne soit trop verbeuse -> ici, success = false, message vide -> pas d'infos
interface MyError extends SyntaxError {
  status: number;
  message: string;
}
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && (err as MyError).status === 400 && 'body' in err) {
      console.error(err);
      return res.status(400).send({ success: false, message: '' }); // Bad request
      // return res.status(400).send({ status: 404, message: (err as MyError).message }); // Bad request
  }
  next();
});

app.get('/*', (req: express.Request, res: express.Response) => {
  // console.log(`baseUrl : ${req.baseUrl}, path : ${req.path}`);
  res.sendFile(`${__dirname}/build/index.html`);
  // console.log('Html file sent: index.html');
  // console.log(`${__dirname}/build/index.html`);
});
const loggerInfoSansPassword = (message: string, args: any) => {
  const argsStringified = JSON.stringify(args);
  const argsStringifiedLength = argsStringified.length;
  if (argsStringifiedLength > 1000) {
    logger.info(message, {
      tresLongueRequete: true,
      centPremiersCar: argsStringified.substring(0, 100),
      _ipSender: args._ipSender,
      _uniqueId: args._uniqueId,
      _state: args._state,
      type_user: args.type_user,
      id: args.id,
      useBaseLocale: args.useBaseLocale,
      token: args.token,
      requestType: args.requestType,
      longueurRequete: argsStringifiedLength,
      password: undefined,
      oldPassword: undefined,
      newPassword: undefined,
    });
  } else {
    logger.info(message, { ...args, password: undefined, oldPassword: undefined, newPassword: undefined });
  }
}

const sendResponse = (res: express.Response, req: express.Request, message = '') => {
  const body = req.body;
  logger.info(
    `réponse serveur${message !== '' ? ` - ${message}` : ''}`,
    {
      _file: false,
      _pdf: false,
      _uniqueId: body._uniqueId,
      _state: REQUETE_STATE_TRAITEE,
      _idCertifie: body.id,
      _typeUserCertifie: body.type_user,
      success: body.success,
      requestType: body.requestType,
      // ip: res.getHeader()
    }
  );
  res.json(body);
}
const sendPdfResponse = (res: express.Response, req: express.Request, buffer?: Buffer) => {
  const body = req.body;
  logger.info('réponse serveur pdf', {
    _file: false,
    _pdf: true,
    _uniqueId: body._uniqueId,
    _state: REQUETE_STATE_TRAITEE,
    _idCertifie: body.id,
    _typeUserCertifie: body.type_user,
    success: !!buffer,
    requestType: body.requestType,
    // ip: res.getHeader()
  });
  if (buffer) {
    res.end(buffer);
  } else {
    res.end();
  }
}
const sendFileResponse = (res: express.Response, req: express.Request, readStream?: fs.ReadStream) => {
  const body = req.body;
  logger.info('réponse serveur file', {
    _file: true,
    _pdf: false,
    _uniqueId: body._uniqueId,
    _state: REQUETE_STATE_TRAITEE,
    _idCertifie: body.id,
    _typeUserCertifie: body.type_user,
    success: !!readStream,
    requestType: body.requestType,
    // ip: res.getHeader()
  });
  if (readStream) {
    readStream.pipe(res);
  } else {
    res.end();
  }
}

app.post(
  '/api',
  // timeout('600s'),
  // bodyParser.json(),
  // haltOnTimedout,
  async (req: express.Request, res: express.Response) => {

    // DECOMMENTER CA POUR RECEPTION DES REQUETES CHIFFRES

    // // console.log(JSON.stringify(req));
    // // console.log(req.body.data);
    // const bodyDecryptedLevel1 = decrypt(req.body.data, `eqw3m63ezrr54zerh`);
    // // console.log(`bodyDecryptedLevel1 : ${bodyDecryptedLevel1}`);
    // const tokenSuppose = bodyDecryptedLevel1.substring(0, 10);
    // // console.log(`tokenSuppose : ${tokenSuppose}`);
    // const bodyEcnrypted = bodyDecryptedLevel1.substring(10);
    // const reqBodyDecrypted = decrypt(bodyEcnrypted, tokenSuppose);
    // const reqBodyDecryptedParsed = JSON.parse(reqBodyDecrypted);

    // req.body = reqBodyDecryptedParsed;

    // JUSQUE LA


    // // let requestResponse;
    // console.log("req.body du début de app.post('/api',...");
    const ipAddress = JSON.stringify(req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    const requestType: NomRequete = req.body.requestType ? req.body.requestType : '';
    // console.log('ipAddress', ipAddress);
    req.body.success = false;
    req.body._uniqueId = getUniqueId();
    req.body._state = REQUETE_STATE_NON_TRAITEE;
    req.body._ipSender = ipAddress;
    req.body.requestType = requestType;

    // console.log(`req : ${JSON.stringify(Object.keys(req))}`);
    // console.log(`req : ${JSON.stringify(req.connection.remoteAddress)}`);

    // d'abord, on prend le id envoyé, mais on ne fait rien avec, jsute logging
    // puis on le remplace par l'id renvoyé par le test de validation de token
    let id = -1;
    let tokenExpires = 0;

    if (!acceptedRequests.includes(requestType)) {
      loggerInfoSansPassword('contenu de la requête invalide', {
        ...req.body,
      });
      // req.body.message = `Requête invalide (pas de req.body.user)`;
      sendResponse(res, req);
      return;
    }
    // à partir d'ici, le requestType est bien un NomRequete
    const ACLRequete = ACLsDetaillees[requestType];
    const {
      ACLDetaillee,
      ACLGlobale,
    } = ACLRequete;

    const useBaseLocale = !!req.body.useBaseLocale;

    // console.log('req.body', req.body);
    // console.log('NODE_ENV : ', process.env.NODE_ENV);

    req.body.success = false;
    req.body.message = '';

    let type_user = TYPE_USER_PUBLIC;
    // console.log(`req.body.token = ${req.body.token}`);


    // REJET si besoin token et pas token
    if (!publicRequests.includes(requestType)) {
      // rend -1 si token pas valide, id du user sinon
      const retIsTokenValide = await isTokenValid(req.body.token, ipAddress, useBaseLocale);
      id = retIsTokenValide.id; // id certifié (-1 si token invalide)
      type_user = retIsTokenValide.type_user; // type_user certifié (TYPE_USER_PUBLIC si token invalide)

      const idOrigineAs = retIsTokenValide.id_origine_as;
      const typeUserDemandeurAs = retIsTokenValide.type_user_origine_as;

      if (idOrigineAs !== -1 || typeUserDemandeurAs !== TYPE_USER_PUBLIC) {
        req.body.id_origine_as = idOrigineAs; // pour log
        req.body.type_user_origine_as = typeUserDemandeurAs; // pour log
      }

      req.body.id = id; // mise à jour de l'id certifié dans le req.body
      req.body.type_user = type_user; // mise à jour du type_user certifié dans le req.body
      tokenExpires = retIsTokenValide.token_expires;
      // console.log('requete : ', requestType);

      // log de la requête avant traitement pour la voir si elle n'est traitée
      loggerInfoSansPassword('réception requete', {
        ...req.body
      });

      if (id === -1) {
        // id = -1 signifie que le token est invalide
        jsonExtend(req.body, { invalidToken: true });
        sendResponse(res, req, `réception requete invalidToken`);
        // res.json(req.body);
        return;
      }

      // à partir d'ici, si la requête nécessite un token, alors il est valide
      // et l'on dispose de l'id et du type_user certifiés de l'utilsateur connecté

      if (!ACLGlobale.includes(type_user)) {
        console.log(`requête ${requestType}, rôle insuffisant`);

        // REJET si besoin admin et pas admin
        // req.body.message = `Droits d'administrateur nécessaires`;
        sendResponse(res, req);
        // res.json(req.body);
        return;
      }
      // sinon
      // console.log(`Token valide`);
      // }
    } else {
      loggerInfoSansPassword('réception requete sans besoin de token', {
        ...req.body,
      });
    }


    // ajout à la réponse de l'heure du fichier index.html
    // pour comparaison avec la dernière version chargée
    // et ainsi proposer un rechargement de la page si une nouvelle version
    // du client a été publiée

    let dateIndex = null;
    try {
      dateIndex = fs.statSync(`${__dirname}/build/index.html`)
    }
    catch (err) {
      if (process.env.NODE_ENV !== 'development') {
        console.log('index.html pas trouvé');
      }
    }
    // const dateIndex = process.env.NODE_ENV !== 'development'
    //   ? fs.statSync(`${__dirname}/build/index.html`)
    //   : undefined
    //   ;
    req.body.dateIndexHtml = dateIndex ? dateIndex.birthtime : null;


    // TRAITEMENT A PROPRE PARLER DES REQUETES

    console.log(` `);
    console.log(`------------------------------------------------------------------------------`);
    console.log(`| Requête ${requestType} de la part du ${getRole(type_user)} d'id ${id}`);
    for (let indexACL = 0; indexACL < ACLDetaillee.length; indexACL += 1) {
      const currentACL = ACLDetaillee[indexACL];
      const {
        accesA,
        typeAcces,
        keyIdToCheck,
      } = currentACL;
      let droits: GetDroitsResponse = getDroitsResponseDefault;
      const stringLog1 = `| Demande droit ${typeAcces.toLocaleUpperCase()} sur ${accesA} ${req.body[keyIdToCheck]}`;
      let droitsEnCoursSurRequeteTraites = true;
      switch (accesA) {
        case 'article':
          droits = await getDroitsUserSurArticle({
            idXCertifie: id,
            typeUserXCertifie: type_user,
            idArticle: req.body[keyIdToCheck],
            useBaseLocale,
          });
          break;
        case 'traitementTresParticulier':
          switch (requestType) {
            case 'hasUserAcces':
            case 'createAccesUser':
            case 'updateUserUserActif':
            case 'genereLienActivationCompte':
              droits = await getDroitsUserXSurUserY({
                idXCertifie: id,
                typeUserXCertifie: type_user,
                idY: req.body.idCible,
                typeUserY: req.body.typeUser,
                useBaseLocale,
              });
              break;
            default:
              droitsEnCoursSurRequeteTraites = false;
              console.log(stringLog1);
              console.log(`|   PAS ENCORE IMPLEMENTE`);
              break;
          }
          break;

        case 'traitementParticulier':
          switch (requestType) {
            case 'getListeFiles':
            case 'deleteFile':
            case 'getFile':
            case 'uploadFile':
            case 'genererPdf':
              const infosTypeFichier = requestType === 'genererPdf'
                ? req.body.infosPath
                : req.body.infosTypeFichier;
              if (!infosTypeFichier) {
                droits = returnValueSuccessAucunDroit;
              } else {
                const {
                  nomModuleNiveau1,
                } = infosTypeFichier as InfosTypeFichier;
                if (nomModuleNiveau1 === 'articles') {
                  if (isUserAdmin(type_user)) {
                    droits = returnValueSuccessCGUD;
                  } else {
                    droits = returnValueSuccessG;
                  }
                } else if (
                  nomModuleNiveau1 === 'lexique'
                ) {
                  if (!infosTypeFichier.idsClientSimuLot) {
                    droits = returnValueSuccessAucunDroit;
                  } else {
                    // droits = await getDroitsSurClientSimuLot(
                    //   id,
                    //   type_user,
                    //   infosTypeFichier.idsClientSimuLot,
                    //   useBaseLocale,
                    // );
                  }
                } else {
                  droits = returnValueSuccessAucunDroit;
                }
              }
              break;
            case 'sendMail':
              const infosMailCoteClient = (req.body as DataSendMailRequest).infosMailCoteClient;
              if (!infosMailCoteClient) {
                droits = returnValueSuccessAucunDroit;
                break;
              } else {
                // contrôle des droits sur tous les destinataires (GET)
                const listeDestTo = infosMailCoteClient.destToIdsTypes;
                const listeDestCc = infosMailCoteClient.destCcIdsTypes;
                const listeDestCci = infosMailCoteClient.destCciIdsTypes;
                const _listeInfosPJ = infosMailCoteClient.piecesJointes;
                const listeInfosPJ = _listeInfosPJ ? _listeInfosPJ : [];
                const listeCompleteIdsTypesUser = (listeDestTo ? listeDestTo : [])
                  .concat(listeDestCc ? listeDestCc : [])
                  .concat(listeDestCci ? listeDestCci : []);
                // initialisation à GET true (envoiMail : seulement GET)
                droits = returnValueSuccessG;
                for (let indexIdTypeUser = 0; indexIdTypeUser < listeCompleteIdsTypesUser.length; indexIdTypeUser += 1) {
                  const idTypeUser = listeCompleteIdsTypesUser[indexIdTypeUser];
                  console.log(`| Contrôle des droits de l'expéditeur d'id ${id} et de type_user ${type_user
                    } sur destinataire email d'id ${idTypeUser.id} et de type_user ${idTypeUser.type_user}`);

                  const _droits = await getDroitsUserXSurUserY({
                    idXCertifie: id,
                    typeUserXCertifie: type_user,
                    idY: idTypeUser.id,
                    typeUserY: idTypeUser.type_user,
                    useBaseLocale,
                    pourEnvoiMail: true,
                  });
                  console.log(`|   résultat : ${_droits.get ? 'OK' : 'pas ok'}`);
                  droits = ANDGetDroitsResponse(droits, _droits);
                  // contrôle des droits de tous les destinataires
                  // sur toutes les pièces jointes(GET)
                  // for (let indexPJ = 0; indexPJ < listeInfosPJ.length; indexPJ += 1) {
                    // const infosPJ = listeInfosPJ[indexPJ];
                    // console.log(`| Contrôle des droits du destinataire email d'id ${idTypeUser.id
                    //   } et de type_user ${idTypeUser.type_user
                    // } sur la pièce jointe concernant le ... d'id ${
                    //   infosPJ...
                    //   }`);

                    // const _droitsPJ = await getDroitsSur...(
                    //   idTypeUser.id,
                    //   idTypeUser.type_user,
                    //   infosPJ...,
                    //   useBaseLocale,
                    // );
                    // console.log(`|   résultat : ${_droitsPJ.get ? 'OK' : 'pas ok'}`);

                    // droits = ANDGetDroitsResponse(droits, _droitsPJ);
                  // }
                }
                break;
              }

            default:
              droitsEnCoursSurRequeteTraites = false;
              console.log(stringLog1);
              console.log(`|   PAS ENCORE IMPLEMENTE`);
              break;
          }
          break;
        default:
          droitsEnCoursSurRequeteTraites = false;
          console.log(stringLog1);
          console.log(`|   PAS ENCORE IMPLEMENTE`);
      }

      if (droitsEnCoursSurRequeteTraites) {
        if (!droits.success) {
          console.log(stringLog1);
          console.log(`|   Pb accès base !!!!!!!!!!!!!`);
          console.log(`------------------------------------------------------------------------------`);
          sendResponse(res, req, `Echec de la vérification du droit ${typeAcces.toLocaleUpperCase()
          } sur ${accesA} ${req.body[keyIdToCheck]}.`);
          return;
        } else if (!droits[typeAcces]) {
          // await deleteJeton
          console.log(stringLog1);
          console.log(`|   Droit REFUSE !!!!!!!!!!!!!`);
          console.log(`------------------------------------------------------------------------------`);
          sendResponse(res, req, `Droit ${typeAcces.toLocaleUpperCase()
            } --- REFUSE --- sur ${accesA} ${req.body[keyIdToCheck]}. Je devrais supprimer le jeton, mais vous devriez vous reconnecter à chaque fois...`);
          return;
        }
        console.log(stringLog1);
        console.log(`|   Accepté : ${resumeDroits(droits)}`);
      }
    }
    console.log(`------------------------------------------------------------------------------`);
    console.log(` `);


    // TRAITEMENT NECESSAIREMENT SEPARE DES REQUETES QUI NECESSITENT UN CALLBACK
    if (requestType === 'genererPdf') {
      const contenuRequeteGenerePdf = req.body as DataGenererPdfRequest;
      const {
        infosPath,
        enregistrerSurServeur,
      } = contenuRequeteGenerePdf;
      console.log('genererPdf');
      // console.log(__dirname);

      const nomFichier = `fichierDonnerNom.pdf`;
      // const nomFichier = `${date2ReadableFileDate(new Date())}.pdf`;

      const urlOriginEnLigne = `https://raf-prag.com`;
      const urlOriginLocal = `http://localhost:3000`;
      const urlOrigine = useBaseLocale || process.env.NODE_ENV === 'development'
        ? urlOriginLocal
        : urlOriginEnLigne;

      const urlSansDebut = getPathFromInfosTypeFichier(infosPath);
      if (urlSansDebut === null) {
        console.log(`genererPdf, problème de conversion de infosPath en path.
        infosPath = ${JSON.stringify(infosPath)}`);
        sendPdfResponse(res, req, Buffer.from(''));
        return;
      }
      console.log(`urlSansPdf : ${urlSansDebut}, urlOrigine : ${urlOrigine}`);

      const urlComplete = `${urlOrigine}${prefixeUrl}${urlSansDebut}`;
      let urlObjet: URL;
      try {
        urlObjet = new URL(urlComplete);
      } catch (e) {
        console.log(`Url invalide`);
        console.log(e);
        sendPdfResponse(res, req, Buffer.from(''));
        return;
      }

      genererPdfDapresUrl({
        token: req.body.token,
        urlObjet,
        callback: (pdfBuffer: Buffer): void => {
          if (pdfBuffer === null) {
            sendPdfResponse(res, req, Buffer.from(''));
            return;
          }
          if (enregistrerSurServeur) {
            // enlève le nomde la version
            const slicedPath = urlObjet.pathname.split('/').slice(2);
            console.log(JSON.stringify(slicedPath));

            const repertoireFichier = path.join(__dirname, ...slicedPath);
            const cheminFichierACreer = path.join(repertoireFichier, nomFichier);
            console.log(cheminFichierACreer);

            fs.promises.mkdir(
              repertoireFichier,
              { recursive: true }
            )
              .then(
                x => fs.promises.writeFile(
                  cheminFichierACreer,
                  pdfBuffer,
                )
                  .then(
                    () => console.log(`Fichier ${nomFichier} créé`),
                    (err) => {
                      console.log(err);
                      sendPdfResponse(res, req);
                      return;
                    },
                  ),
                (err) => {
                  console.log(err);
                  sendPdfResponse(res, req);
                  return;
                },
              );
          }
          res.setHeader('Content-Length', pdfBuffer.length);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=${nomFichier}`);
          sendPdfResponse(res, req, pdfBuffer);
          return;
          // res.end(pdfBuffer); // buffer
        },
        // versionAdresseSimu,
      });
    } else if (requestType === 'getFile') {
      // ********** DEMANDE FICHIER **********
      const contenuRequeteGetFile = req.body as DataGetFileRequest;
      const {
        infosTypeFichier,
        fileName,
      } = contenuRequeteGetFile;
      const pathDir = getPathFromInfosTypeFichier(infosTypeFichier);
      if (pathDir === null) {
        console.log(`getFile, problème de conversion de infosTypeFichier en path.
        infosTypeFichier = ${JSON.stringify(infosTypeFichier)}`);
        res.writeHead(204, {});
        sendFileResponse(res, req);
      }
      const filePath = path.join(pathDir, fileName);

      console.log('getFile');

      const cheminFichier = path.join(__dirname, filePath);

      let stat;
      try {
        stat = fs.statSync(cheminFichier); // mode fichier
        res.writeHead(200, {
          'Content-Type': 'application/pdf', // pdf ??
          'Content-Length': stat.size
        });

        const readStream = fs.createReadStream(cheminFichier);

        readStream.on('error', (err) => {
          if (err) throw err;
          // do something with `err`
        });
        // We replaced all the event handlers with a simple call to readStream.pipe()
        sendFileResponse(res, req, readStream);
      }
      catch (err) {
        console.log(`Le fichier ${cheminFichier} n'existe pas`);
        res.writeHead(204, {});
        sendFileResponse(res, req);
        // res.end();
      }
    } else {
      // TRAITEMENT DE TOUTES LES AUTRES REQUETES
      // sendResponse qu'à la toute fin

      switch (requestType as NomRequete) {
        // ********** CONNECT **********
        case 'connect':
          const connectResponse = await createToken({
            user_login: req.body.user_login,
            password: req.body.password,
            ipAddress,
          }, useBaseLocale);
          jsonExtend(req.body, connectResponse);
          // console.log('fin connect, req.body =', req.body);
          break;

        // ********** DEMANDE DE REINITIATLISATION DE MOT DE PASSE **********
        case 'demandeReinitPassword':
          // console.log(req.body);
          const demandeReinitPasswordResponse = await demandeReinitPwdBase(req.body);
          jsonExtend(req.body, demandeReinitPasswordResponse);
          break;

        // ********** REINITIALISATION DE MOT DE PASSE (cas non connecté, jeton spécifique fourni) **********
        case 'reinitPassword':
          // console.log(req.body);
          const reinitPwdResponse = await reinitPwdBase(req.body);
          jsonExtend(req.body, reinitPwdResponse);
          break;

        // ********** ACTIVATION DE COMPTE (cas non connecté, jeton spécifique fourni) **********
        case 'activationCompte':
          // console.log(req.body);
          const activationCompteResponse = await reinitPwdBase(req.body);
          jsonExtend(req.body, activationCompteResponse);
          break;


        // ********** AUTO-CONNECT **********
        case 'autoConnect':
          let traite = false;
          let user = userDefault;

          // connexion user
          if (isUserUtilisateur(type_user)) {
            // console.log(`isUserUtilisateur(type_user)`);
            traite = true;
            user = await getUser(id, type_user, useBaseLocale);
            if (user === null) {
              sendResponse(res, req);
              return;
            }
            // connexion admin
          } else if (isUserAdmin(type_user)) {
            traite = true;
            user = await getUser(id, type_user, useBaseLocale);
            if (user === null) {
              console.log(`autoConnect : user non trouvé`);
              sendResponse(res, req);
              return;
            }
          }
          if (!traite) {
            console.log(`autoConnect : type_user ne correspond à aucun cas de figure`);
            sendResponse(res, req);
            // res.json(req.body);
            return;
          }

          const connectedUser: ConnectedUser = {
            token: req.body.token,
            token_original: '',
            type_user: type_user,
            user,
          }
          jsonExtend(req.body, { connectedUser: { ...connectedUser } });
          jsonExtend(req.body, { success: true, message: 'OK' });
          break;

        // ********** CHARGEMENT DES DONNEES **********
        case 'chargementDonnees':
          // console.log('autoConnect, user = ', user);
          req.body.listeClients = [];

          if (!req.body.isPdfGeneration) {
            console.log(`isPdfGeneration = false => liste clients, état stocks, alertes et commentaires chargés`);

            // // chargement de la liste des clients liés à cet utilisateur
            // const getListeClientsResponse = await getListeClients(req.body);
            // jsonExtend(req.body, getListeClientsResponse);

            // // chargement des lots de l'état des stocks
            // const getLotsEtatStocksResponse = await getLotsEtatStocks(req.body);
            // jsonExtend(req.body, getLotsEtatStocksResponse);

            // const getSocietesConseillersResponse = await getSocietesConseillers(req.body);
            // jsonExtend(req.body, getSocietesConseillersResponse);
            // const getFournisseursResponse = await getFournisseurs(req.body);
            // jsonExtend(req.body, getFournisseursResponse);
            // const getComptablesResponse = await getComptables(req.body);
            // jsonExtend(req.body, getComptablesResponse);
            // const getCourtiersResponse = await getCourtiers(req.body);
            // jsonExtend(req.body, getCourtiersResponse);

            // const getAlertesResponse = await getAlertes(req.body);
            // jsonExtend(req.body, getAlertesResponse);

            // const getLignesTPResponse = await getLignesTP(req.body);
            // jsonExtend(req.body, getLignesTPResponse);

            // const getCommentairesResponse = await getCommentaires(req.body);
            // jsonExtend(req.body, getCommentairesResponse);
          } else {
            // pour avoir les couleurs de la société qui va bien dans le pdf
            // (si génération pour quelqu'un d'autre -> donc que admin
            // car si gérant société -> mêmes couleurs)
            if (isUserAdmin(type_user)) {
              // chargement de la liste des clients liés à cet utilisateur
              // const getListeClientsResponse = await getListeClients(req.body);
              // jsonExtend(req.body, getListeClientsResponse);
              // const getSocietesConseillersResponse = await getSocietesConseillers(req.body);
              // jsonExtend(req.body, getSocietesConseillersResponse);
            }

            console.log(`isPdfGeneration = true => liste clients, état stocks, alertes et commentaires PAS chargés`);
            // jsonExtend(
            //   req.body,
            //   {
            //     user: {
            //       ...user,
            //       societe: await getSociete(id_societe, useBaseLocale),
            //       // societe: await getSociete(await getSocieteFromWP(id), useBaseLocale),
            //     }
            // });
            jsonExtend(req.body, { success: true, message: 'OK' });
          }
          break;

        // ********** DISCONNECT **********
        case 'disconnect':
          // console.log(req.body);
          const disconnectResponse = await revokeToken(req.body.token);
          jsonExtend(req.body, disconnectResponse);
          break;

        // ********** GET LOGS **********
        case 'getLogs':
          const getLogsResponse = await getLogs(req.body);
          jsonExtend(req.body, getLogsResponse);
          break;

        // ********** CREATE USER **********
        // case 'createUser':
        //   const createUserResponse = await createUser(req.body);
        //   jsonExtend(req.body, createUserResponse);
        //   break;

        // ********** ENVOI MAIL **********
        // case 'sendMail':
        //   const sendMailResponse = await sendMail(req.body);
        //   jsonExtend(req.body, sendMailResponse);
        //   break;

        // ********** GET USER **********
        // case 'getUser':
        //   const getUserResponse = await getUser(req.body);
        //   jsonExtend(req.body, getUserResponse);
        //   break;

        // ********** UPDATE USER **********
        // case 'updateClient':
        //   const updateClientResponse = await updateClient(req.body);
        //   jsonExtend(req.body, updateClientResponse);
        //   break;


        // ********** UPDATE USER : user_actif **********
        // activation / désactivation d'un user
        case 'updateUserUserActif':
          // const updateUserUserActifResponse = await updateUserUserActif(req.body);
          // jsonExtend(req.body, updateUserUserActifResponse);
          // break;


        // ********** DELETE USER **********
        // case 'deleteClient':
        //   const deleteClientResponse = await deleteClient(req.body);
        //   jsonExtend(req.body, deleteClientResponse);
        //   break;


        // ********** GET LISTE FILES **********
        case 'getListeFiles':
          // const getListeFilesResponse = await getListeFiles(req.body);
          // jsonExtend(req.body, getListeFilesResponse);
          break;

        // ********** UPLOAD FILE **********
        case 'uploadFile':
          // const uploadFileResponse = await uploadFile(req.body);
          // jsonExtend(req.body, uploadFileResponse);
          break;

        // ********** DELETE FILE **********
        case 'deleteFile':
          // const deleteFileResponse = await deleteFile(req.body);
          // jsonExtend(req.body, deleteFileResponse);
          break;


        // ********** UPDATE GENERIQUE avec ID CLIENT **********
        // case 'updateGeneriqueClient':
        //   const updateGeneriqueClientResponse = await updateGeneriqueClient(req.body);
        //   jsonExtend(req.body, updateGeneriqueClientResponse);
        //   break;

        // ********** CREATE ACCES CLIENT **********
        case 'createAccesUser':
          // const createAccesUserResponse = await createAccesUser(req.body);
          // jsonExtend(req.body, createAccesUserResponse);
          break;


        // ********** MODIFICATION DE MOT DE PASSE (cas connecté, jeton normal fourni) **********
        case 'modifPassword':
          // const modifPwdResponse = await modifPassword(req.body);
          // jsonExtend(req.body, modifPwdResponse);
          break;

        // ********** GENERATION DE LIEN D'ACTIVATION DE COMPTE **********
        case 'genereLienActivationCompte':
          const genereLienActivationCompteResponse = await genereLienActivationCompte(req.body);
          jsonExtend(req.body, genereLienActivationCompteResponse);
          break;

        // ********** CREATION D'ACCES CLIENT **********
        case 'hasUserAcces':
          const hasUserAccesResponse = await hasUserAcces(req.body);
          jsonExtend(req.body, hasUserAccesResponse);
          break;

        default:
          break;
      }

      // RENOUVELLEMENT DE JETON SI
      // - requête dans liste des jetons à renouveler
      // - vieux de plus de heuresNonRenouvToken heure
      // - req.body.success = true

      if (!noRenewTokenRequests.includes(requestType) && req.body.success) {
        const valableEncore = tokenExpires - Math.round(new Date().getTime() / 1000);
        // ne renouvelle pas le token sans arrêt
        // (pendant les premiers 10 % de sa durée de validité, pas de renouvellement)
        const secondesNonRenouvToken = Math.floor(DUREE_SECONDES_VALIDITE_TOKEN * 0.9);
        console.log(`requestType = ${requestType}`);
        console.log(`token valableEncore = ${valableEncore
          }, secondesNonRenouvToken = ${secondesNonRenouvToken}`);
        if (valableEncore < secondesNonRenouvToken) {
        console.log(`refresh token`);

          const retRefreshToken = await refreshToken(req.body.token);
          if (retRefreshToken) {
            req.body.tokenRefreshed = true;
          }
        }
      }


      // console.log(req.body);
      // console.log(`res.json(req.body);`);

      sendResponse(res, req);
      return;
    }
  }
);

const server = http.createServer(app);

server.listen(process.env.PORT || 3001, () => {
  console.log('simu listening on *:3001');
});
server.timeout = 300000;
console.log(`timeout serveur : ${server.timeout}`);
