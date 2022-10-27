/* eslint-disable no-case-declarations */
import path from 'path';
import express from 'express';
import http from 'http';
// import timeout from 'connect-timeout';
import fs from 'fs';
import { getUniqueId } from '../../client/src/utils/utilRandom';
import { NomRequete } from '../../common/types/serverRequests';
import { REQUETE_STATE_NON_TRAITEE } from '../../client/src/utils/serverConstants';
import { acceptedRequests } from '../../client/src/utils/aCLs';
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
// const loggerInfoSansPassword = (message: string, args: any) => {
//   const argsStringified = JSON.stringify(args);
//   const argsStringifiedLength = argsStringified.length;
//   if (argsStringifiedLength > 1000) {
//     logger.info(message, {
//       tresLongueRequete: true,
//       centPremiersCar: argsStringified.substring(0, 100),
//       _ipSender: args._ipSender,
//       _uniqueId: args._uniqueId,
//       _state: args._state,
//       type_user: args.type_user,
//       id: args.id,
//       useBaseLocale: args.useBaseLocale,
//       token: args.token,
//       requestType: args.requestType,
//       longueurRequete: argsStringifiedLength,
//       password: undefined,
//       oldPassword: undefined,
//       newPassword: undefined,
//     });
//   } else {
//     logger.info(message, { ...args, password: undefined, oldPassword: undefined, newPassword: undefined });
//   }
// }

const sendResponse = (res: express.Response, req: express.Request, message = '') => {
  const body = req.body;
  // logger.info(
  //   `réponse serveur${message !== '' ? ` - ${message}` : ''}`,
  //   {
  //     _file: false,
  //     _pdf: false,
  //     _uniqueId: body._uniqueId,
  //     _state: REQUETE_STATE_TRAITEE,
  //     _idCertifie: body.id,
  //     _typeUserCertifie: body.type_user,
  //     success: body.success,
  //     requestType: body.requestType,
  //     // ip: res.getHeader()
  //   }
  // );
  res.json(body);
}
// const sendPdfResponse = (res: express.Response, req: express.Request, buffer?: Buffer) => {
//   const body = req.body;
//   logger.info('réponse serveur pdf', {
//     _file: false,
//     _pdf: true,
//     _uniqueId: body._uniqueId,
//     _state: REQUETE_STATE_TRAITEE,
//     _idCertifie: body.id,
//     _typeUserCertifie: body.type_user,
//     success: !!buffer,
//     requestType: body.requestType,
//     // ip: res.getHeader()
//   });
//   if (buffer) {
//     res.end(buffer);
//   } else {
//     res.end();
//   }
// }
// const sendFileResponse = (res: express.Response, req: express.Request, readStream?: fs.ReadStream) => {
//   const body = req.body;
//   logger.info('réponse serveur file', {
//     _file: true,
//     _pdf: false,
//     _uniqueId: body._uniqueId,
//     _state: REQUETE_STATE_TRAITEE,
//     _idCertifie: body.id,
//     _typeUserCertifie: body.type_user,
//     success: !!readStream,
//     requestType: body.requestType,
//     // ip: res.getHeader()
//   });
//   if (readStream) {
//     readStream.pipe(res);
//   } else {
//     res.end();
//   }
// }

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
      // comme plus wordpress pour authentification,
      // plus de bypass useBaseLocale en mode dév
      // if (useBaseLocale && process.env.NODE_ENV === 'development') {
      // console.log(`Base locale, mode dév, pas besoin de token`);
      // } else {

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




    ///////////////////////////////////////////////////////
    // TESTS DROITS creatComparaison -> à mettre dans les requêtes
    ///////////////////////////////////////////////////////


    // REJET si l'utilisateur ne peut pas accéder à la simu
    if (
      requestType === 'createComparaison'
    ) {
      let accesToutesSimusOk = true;
      let simusNonVerrouillees = true;
      const nbEtudes = req.body.idsSimus !== undefined ? req.body.idsSimus.length : 0;
      for (let i = 0; i < nbEtudes && accesToutesSimusOk && simusNonVerrouillees; i += 1) {
        const idSimuATester = req.body.idsSimus[i];
        accesToutesSimusOk = accesToutesSimusOk && await canUserAccessSimu(
          id,
          type_user,
          idClient,
          idSimuATester,
          useBaseLocale,
        );
      }
      if (!accesToutesSimusOk || !simusNonVerrouillees) {
        loggerInfoSansPassword(
          `tentative d'accès à une simu ${accesToutesSimusOk ? `` : `non affectée à ce conseiller`} ${simusNonVerrouillees ? `` : `verrouillée`}
          ${requestType === 'createComparaison'
            ? `(lors d'une comparaison)`
            : `(lors d'un envoi de mail de suivi client)`}`,
          {
            ...req.body,
          }
        );
        // console.log('tentative d'accès à une simu non affectée à ce conseiller');
        // console.log('req.body = ', req.body);
        // req.body.message = `tentative d'accès à une simu non affectée à ce conseiller`;
        sendResponse(res, req);
        // res.json(req.body);
        return;
      }
    }


    /////////////// FIN DES TESTS A REVOIR


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
      let droits: GetDroitsResponse = getDroitsResponseVide;
      const stringLog1 = `| Demande droit ${typeAcces.toLocaleUpperCase()} sur ${accesA} ${req.body[keyIdToCheck]}`;
      let droitsEnCoursSurRequeteTraites = true;
      switch (accesA) {
        case 'client':
          droits = await getDroitsUserXSurUserY({
            idXCertifie: id,
            typeUserXCertifie: type_user,
            idY: req.body[keyIdToCheck],
            typeUserY: TYPE_USER_CLIENT,
            useBaseLocale,
          });
          break;
        case 'courtier':
          droits = await getDroitsUserXSurUserY({
            idXCertifie: id,
            typeUserXCertifie: type_user,
            idY: req.body[keyIdToCheck],
            typeUserY: TYPE_USER_COURTIER,
            useBaseLocale,
          });
          break;
        case 'comptable':
          droits = await getDroitsUserXSurUserY({
            idXCertifie: id,
            typeUserXCertifie: type_user,
            idY: req.body[keyIdToCheck],
            typeUserY: TYPE_USER_COMPTABLE,
            useBaseLocale,
          });
          break;
        case 'fournInterlocuteur':
          droits = await getDroitsUserXSurUserY({
            idXCertifie: id,
            typeUserXCertifie: type_user,
            idY: req.body[keyIdToCheck],
            typeUserY: TYPE_USER_FOURN_INTERLOCUTEUR,
            useBaseLocale,
          });
          break;
        case 'simu':
          droits = await getDroitsUserXSurSimu({
            idXCertifie: id,
            typeUserXCertifie: type_user,
            idSimu: req.body[keyIdToCheck],
            useBaseLocale,
          });
          break;
        case 'lot':
          // condition sur l'idLot :
          // - on cherche l'idSimu correspondant
          // - si on ne trouve pas, on renvoie aucun droit (success = false mais aucun droit)
          // - si on trouve, on renvoie les droits sur la simu d'id idSimu
          const simuDeCeLot = await getIdSimuFromIdLot({ idLot, useBaseLocale });
          if (simuDeCeLot === -1) {
            droits.success = true;
            break;
          } else {
            droits = await getDroitsUserXSurSimu({
              idXCertifie: id,
              typeUserXCertifie: type_user,
              idSimu: simuDeCeLot,
              useBaseLocale,
            });
          }
          break;
        case 'ligneTP':
          droits = await getDroitsUserXSurLigneTP({
            idXCertifie: id,
            typeUserXCertifie: type_user,
            idLot: req.body[keyIdToCheck],
            useBaseLocale,
          });
          break;
        case 'societe':
        case 'cabinetComptable':
        case 'cabinetCourtage':
        case 'fournisseur':
          droits = await getDroitsUserXSurSociete({
            idXCertifie: id,
            typeUserXCertifie: type_user,
            idSociete: req.body[keyIdToCheck],
            useBaseLocale,
          });
          break;
        case 'traitementTresParticulier':
          switch (requestType) {
            case 'connectAs':
            case 'hasUserAcces':
            case 'createAccesUser':
            case 'updateUserUserActif':
            case 'genereLienActivationCompte':
              droits = await canConnectAs({
                idXCertifie: id,
                typeUserXCertifie: type_user,
                idY: req.body[requestType === 'connectAs' ? 'idAs' : 'idBasePropre'],
                typeUserY: req.body[requestType === 'connectAs' ? 'idAs' : 'typeUser'],
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
                if (nomModuleNiveau1 === 'baseProgrammes') {
                  if (isUserAdmin(type_user)) {
                    droits = returnValueSuccessCGUD;
                  } else {
                    droits = returnValueSuccessG; // voir si fournisseurs peuvent uploader (besoin U)
                  }
                } else if (
                  nomModuleNiveau1 === 'baseClients' ||
                  nomModuleNiveau1 === 'suiviProjets'
                ) {
                  if (!infosTypeFichier.idsClientSimuLot) {
                    droits = returnValueSuccessAucunDroit;
                  } else {
                    droits = await getDroitsSurClientSimuLot(
                      id,
                      type_user,
                      infosTypeFichier.idsClientSimuLot,
                      useBaseLocale,
                    );
                  }
                } else {
                  droits = returnValueSuccessAucunDroit;
                }
              }
              break;
            case 'envoiMail':
              const infosMailCoteClient = (req.body as DataEnvoiMailRequest).infosMailCoteClient;
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
                  for (let indexPJ = 0; indexPJ < listeInfosPJ.length; indexPJ += 1) {
                    const infosPJ = listeInfosPJ[indexPJ];
                    console.log(`| Contrôle des droits du destinataire email d'id ${idTypeUser.id
                      } et de type_user ${idTypeUser.type_user
                    } sur la pièce jointe concernant le client d'id ${
                      infosPJ.idsClientSimuLot.idClient
                      }`);

                    const _droitsPJ = await getDroitsSurClientSimuLot(
                      idTypeUser.id,
                      idTypeUser.type_user,
                      infosPJ.idsClientSimuLot,
                      useBaseLocale,
                    );
                    console.log(`|   résultat : ${_droitsPJ.get ? 'OK' : 'pas ok'}`);

                    droits = ANDGetDroitsResponse(droits, _droitsPJ);
                  }
                }
                break;
              }
            case 'createComparaison':
              droits = await getDroitsSurClientSimuLot(
                id,
                type_user,
                {
                  idClient,
                  idSimu: -1,
                  idLot: -1,
                },
                useBaseLocale,
              );
              break;
            case 'getPropositionsBancaires':
              droits = await getDroitsSurClientSimuLot(
                id,
                type_user,
                {
                  idClient,
                  idSimu,
                  idLot,
                },
                useBaseLocale,
              );
              break;
            case 'deletePropositionBancaire':
              droits = await getDroitsSurClientSimuLot(
                id,
                type_user,
                {
                  idClient,
                  idSimu,
                  idLot,
                },
                useBaseLocale,
              );
              break;
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

      const nomFichier = `${date2ReadableFileDate(new Date())}.pdf`;

      const urlOriginEnLigne = `https://ajnae.fr`;
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

      const urlComplete = `${urlOrigine}${nomSimuPourUrl}${urlSansDebut}`;
      let urlObjet: URL;
      try {
        urlObjet = new URL(urlComplete);
      } catch (e) {
        console.log(`Url invalide`);
        console.log(e);
        sendPdfResponse(res, req, Buffer.from(''));
        return;
      }

      genererPdfFromUrl({
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

      // const cheminFichier = getCheminFichierPdf(req.body.idClient, req.body.idSimu, req.body.indexLot);
      // const nomFichier = getNomFichierPdf(req.body.idClient, req.body.idSimu);

      let stat;
      try {
        stat = fs.statSync(cheminFichier); // mode fichier
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
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

        // ********** CONNECT AS **********
        case 'connectAs':
          const connectAsResponse = await createTokenAs(req.body, ipAddress);
          jsonExtend(req.body, connectAsResponse);
          // console.log('fin connect, req.body =', req.body);
          break;


        // ********** AUTO-CONNECT **********
        case 'autoConnect':
          let conseiller = conseillerVide;;
          let client = clientInfosBaseVide;
          let courtier = courtierVide;
          let comptable = comptableVide;
          let fournInterlocuteur = fournInterlocuteurVide;

          let traite = false;

          // connexion client
          if (isUserClient(type_user)) {
            console.log(`isUserClient(type_user)`);
            traite = true;
            client = await getClientInfosBaseById(id, useBaseLocale);
            if (client === null) {
              console.log(`isUserClient(type_user), retGetClient === null`);
              sendResponse(res, req);
              // res.json(req.body);
              return;
            }
            const retIdTUCOns = await getIdConseillerByClientId(id, useBaseLocale);
            if (retIdTUCOns.id !== -1) {
              conseiller = await getConseiller(retIdTUCOns.id, TYPE_USER_CONSEILLER, useBaseLocale);
              if (conseiller === null) {
                console.log(`autoConnect : conseiller non trouvé`);
                sendResponse(res, req);
                return;
              }
              conseiller.type_user = TYPE_USER_CONSEILLER;
              const societe = await getSociete(conseiller.id_societe, useBaseLocale);
              if (societe === null) {
                console.log(`autoConnect de client : société non trouvée`);
                sendResponse(res, req);
                return;
              }
              conseiller.societe = { ...societe };
              console.log(`autoConnect de client, id = ${id}`);
            }

            // connexion conseiller
          } else if (isUserConseiller(type_user) || isUserAdmin(type_user)) {
            traite = true;
            conseiller = await getConseiller(id, type_user, useBaseLocale);
            if (conseiller === null) {
              console.log(`autoConnect : conseiller non trouvé`);
              sendResponse(res, req);
              return;
            }
            conseiller.type_user = type_user;
            console.log(`autoConnect, conseiller.id_societe = ${conseiller.id_societe}`);
            const societe = await getSociete(conseiller.id_societe, useBaseLocale);
            if (societe === null) {
              console.log(`autoConnect : société non trouvée`);
              sendResponse(res, req);
              return;
            }
            const preferencesConseiller = await getPreferencesConseiller(id, useBaseLocale);
            if (preferencesConseiller === null) {
              console.log(`autoConnect : preferencesConseiller non trouvées`);
              sendResponse(res, req);
              return;
            }
            conseiller.preferences = { ...preferencesConseiller };
            conseiller.societe = { ...societe };
            console.log(`autoConnect, id = ${id}`);

            // connexion fournisseur
          } else if (isUserFournInterlocuteur(type_user)) {
            traite = true;
            fournInterlocuteur = await getFournInterlocuteur(id, type_user, useBaseLocale);
            if (fournInterlocuteur === null) {
              console.log(`autoConnect : fournInterlocuteur non trouvé`);
              sendResponse(res, req);
              return;
            }
            fournInterlocuteur.type_user = type_user;
            console.log(`autoConnect, fournInterlocuteur.id_fournisseur = ${fournInterlocuteur.id_fournisseur}`);
            const fournisseur = await getFournisseur(fournInterlocuteur.id_fournisseur, useBaseLocale);
            if (fournisseur === null) {
              console.log(`autoConnect : fournisseur non trouvé`);
              sendResponse(res, req);
              return;
            }
            fournInterlocuteur.fournisseur = { ...fournisseur };
            console.log(`autoConnect, id = ${id}`);

            // connexion courtier
          } else if (isUserCourtier(type_user)) {
            traite = true;
            courtier = await getCourtier(id, type_user, useBaseLocale);
            if (courtier === null) {
              console.log(`autoConnect : courtier non trouvé`);
              sendResponse(res, req);
              return;
            }
            courtier.type_user = type_user;
            console.log(`autoConnect, courtier.id_cabinet_courtage = ${courtier.id_cabinet_courtage}`);
            const cabinetCourtage = await getCabinetCourtage(courtier.id_cabinet_courtage, useBaseLocale);
            if (cabinetCourtage === null) {
              console.log(`autoConnect : cabinetCourtage non trouvé`);
              sendResponse(res, req);
              return;
            }
            courtier.cabinetCourtage = { ...cabinetCourtage };
            console.log(`autoConnect, id = ${id}`);

            // connexion comptable
          } else if (isUserComptable(type_user)) {
            traite = true;
            comptable = await getComptable(id, type_user, useBaseLocale);
            if (comptable === null) {
              console.log(`autoConnect : comptable non trouvé`);
              sendResponse(res, req);
              return;
            }
            comptable.type_user = type_user;
            console.log(`autoConnect, comptable.id_cabinet_comptable = ${comptable.id_cabinet_comptable}`);
            const cabinetComptable = await getCabinetComptable(comptable.id_cabinet_comptable, useBaseLocale);
            if (cabinetComptable === null) {
              console.log(`autoConnect : cabinetComptable non trouvé`);
              sendResponse(res, req);
              return;
            }
            comptable.cabinetComptable = { ...cabinetComptable };
            console.log(`autoConnect, id = ${id}`);
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
            conseiller,
            client,
            courtier,
            comptable,
            fournInterlocuteur,
          }
          jsonExtend(req.body, { connectedUser: { ...connectedUser } });
          jsonExtend(req.body, { success: true, message: 'OK' });
          break;

        // ********** CHARGEMENT DES DONNEES **********
        case 'chargementDonnees':
          // console.log('autoConnect, user = ', user);
          req.body.listeClients = [];

          if (!req.body.isPdfGeneration) {
            log(`isPdfGeneration = false => liste clients, état stocks, alertes et commentaires chargés`);

            // chargement de la liste des clients liés à cet utilisateur
            const getListeClientsResponse = await getListeClients(req.body);
            jsonExtend(req.body, getListeClientsResponse);

            // chargement des lots de l'état des stocks
            const getLotsEtatStocksResponse = await getLotsEtatStocks(req.body);
            jsonExtend(req.body, getLotsEtatStocksResponse);

            const getSocietesConseillersResponse = await getSocietesConseillers(req.body);
            jsonExtend(req.body, getSocietesConseillersResponse);
            const getFournisseursResponse = await getFournisseurs(req.body);
            jsonExtend(req.body, getFournisseursResponse);
            const getComptablesResponse = await getComptables(req.body);
            jsonExtend(req.body, getComptablesResponse);
            const getCourtiersResponse = await getCourtiers(req.body);
            jsonExtend(req.body, getCourtiersResponse);

            const getAlertesResponse = await getAlertes(req.body);
            jsonExtend(req.body, getAlertesResponse);

            const getLignesTPResponse = await getLignesTP(req.body);
            jsonExtend(req.body, getLignesTPResponse);

            const getCommentairesResponse = await getCommentaires(req.body);
            jsonExtend(req.body, getCommentairesResponse);
          } else {
            // pour avoir les couleurs de la société qui va bien dans le pdf
            // (si génération pour quelqu'un d'autre -> donc que admin
            // car si gérant société -> mêmes couleurs)
            if (isUserAdmin(type_user)) {
              // chargement de la liste des clients liés à cet utilisateur
              const getListeClientsResponse = await getListeClients(req.body);
              jsonExtend(req.body, getListeClientsResponse);
              const getSocietesConseillersResponse = await getSocietesConseillers(req.body);
              jsonExtend(req.body, getSocietesConseillersResponse);
            }

            log(`isPdfGeneration = true => liste clients, état stocks, alertes et commentaires PAS chargés`);
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

        // ********** GET LISTE VILLES **********
        case 'getListeVilles':
          const getListeVillesResponse = await getListeVilles(req.body);
          jsonExtend(req.body, getListeVillesResponse);
          break;

        // ********** GET LOGS **********
        case 'getLogs':
          const getLogsResponse = await getLogs(req.body);
          jsonExtend(req.body, getLogsResponse);
          break;

        // ********** CREATE CLIENT **********
        case 'createClient':
          const createClientResponse = await createClient(req.body);
          jsonExtend(req.body, createClientResponse);
          break;

        // ********** SEND MAIL CONTACT **********
        case 'sendMailContact':
          console.log(`avant await sendMailContact`);
          const sendMailContactResponse = await sendMailContact(req.body);
          jsonExtend(req.body, sendMailContactResponse);
          console.log(`après await sendMailContact`);
          break;

        // ********** ENVOI MAIL **********
        case 'envoiMail':
          const envoiMailResponse = await envoiMail(req.body);
          jsonExtend(req.body, envoiMailResponse);
          break;

        // ********** CREATE SIMU **********
        case 'createSimu':
          const createSimuResponse = await createSimu(req.body);
          jsonExtend(req.body, createSimuResponse);
          break;

        // ********** CREATE LOT **********
        case 'createLot':
          const createLotResponse = await createLot(req.body);
          jsonExtend(req.body, createLotResponse);
          break;

        // ********** GET CLIENT **********
        case 'getClient':
          const getClientResponse = await getClient(req.body);
          jsonExtend(req.body, getClientResponse);
          break;

        // ********** GET SIMU (INVESTISSEMENT PARTICULIER D'UN CLIENT) **********
        case 'getSimu':
          const getSimuResponse = await getSimu(req.body);
          jsonExtend(req.body, getSimuResponse);
          break;

        // ********** GET COMPARAISON **********
        case 'getComparaison':
          const getComparaisonResponse = await getComparaison(req.body);
          jsonExtend(req.body, getComparaisonResponse);
          break;

        // ********** GET RESUMESLOTS **********
        case 'getResumesLots':
          const getResumesLotsResponse = await getResumesLots(req.body);
          delete req.body.user;
          jsonExtend(req.body, getResumesLotsResponse);
          break;

        // ********** UPDATE CLIENT **********
        case 'updateClient':
          const updateClientResponse = await updateClient(req.body);
          jsonExtend(req.body, updateClientResponse);
          break;

        // ********** CHANGE CONSEILLER DE CLIENT **********
        case 'changeConseillerClient':
          const changeConseillerClientResponse = await changeConseillerClient(req.body);
          jsonExtend(req.body, changeConseillerClientResponse);
          break;

        // ********** UPDATE SIMU **********
        case 'updateSimu':
          const updateSimuResponse = await updateSimu(req.body);
          jsonExtend(req.body, updateSimuResponse);
          break;

        // ********** UPDATE LOT **********
        case 'updateLot':
          const {
            lot,
            partie,
            idClient,
            idSimu,
            idLot,
            neutraliserEE,
          } = req.body as DataUpdateLotRequest;
          if (neutraliserEE && isCredit(lot)) {
            const retGetSimu = await getSimu({
              idClient,
              idSimu,
              useBaseLocale,
            } as DataGetSimuRequest);
            const retGetClient = await getClient({
              idClient,
              useBaseLocale,
            } as DataGetClientRequest);
            if (retGetSimu.success && retGetClient.success) {
              const retGetANEETF = await getANEETF(
                {
                  client: retGetClient.client,
                  simu: retGetSimu.simu,
                  useBaseLocale,
                  idLot,
                } as DataGetANEETFRequest
              );
              if (retGetANEETF.success) {
                const {
                  apport,
                } = retGetANEETF;
                req.body.apportANEEF = apport;
                console.log(`server, updateLot, req.body.apportANEEF : ${req.body.apportANEEF}`);

                // console.log(`modif de l'apport fourni`);

                lot.financement_investissement.apport_fourni = apport;
              }
            }
          }

          const updateLotResponse = await updateLot({
            lot,
            idLot,
            partie,
            useBaseLocale,
          });
          jsonExtend(req.body, updateLotResponse);
          break;

        // ********** ARCJHIVE / DESARCHIVER LOT **********
        case 'archiverLot':
          const archiverLotResponse = await archiverLot(req.body);
          jsonExtend(req.body, archiverLotResponse);
          break;

        // ********** UPDATE USER : user_actif **********
        // activation / désactivation d'un user
        case 'updateUserUserActif':
          const updateUserUserActifResponse = await updateUserUserActif(req.body);
          jsonExtend(req.body, updateUserUserActifResponse);
          break;

        // ********** UPDATE USER : GERANT DE SOCIETE **********
        // passage d'un user au statut de gérant de société
        case 'updateUserGerant':
          const updateUserGerantResponse = await updateUserGerant(req.body);
          jsonExtend(req.body, updateUserGerantResponse);
          break;

        // // ********** GET SIMULATION **********
        // case 'getSimulation':
        //   const getSimulationResponse = await getSimulation(req.body);
        //   jsonExtend(req.body, getSimulationResponse);
        //   break;

        // ********** GET ETUDES POUR COMPARAISON **********
        case 'createComparaison':
          const createComparaisonResponse = await createComparaison(req.body);
          jsonExtend(req.body, createComparaisonResponse);
          break;

        // ********** MISE A JOUR DES OPTIONS DE COMPARAISON **********
        // exemple : perf fin, horizons...
        case 'updateComparaison':
          const updateComparaisonResponse = await updateComparaison(req.body);
          jsonExtend(req.body, updateComparaisonResponse);
          break;

        // ********** DELETE CLIENT **********
        case 'deleteClient':
          const deleteClientResponse = await deleteClient(req.body);
          jsonExtend(req.body, deleteClientResponse);
          break;

        // ********** DELETE SIMU **********
        case 'deleteSimu':
          const deleteSimuResponse = await deleteSimu(req.body);
          jsonExtend(req.body, deleteSimuResponse);
          break;

        // ********** DELETE LOT **********
        case 'deleteLot':
          const deleteLotResponse = await deleteLot(req.body);
          jsonExtend(req.body, deleteLotResponse);
          break;

        // ********** DUPLICATE SIMU **********
        case 'duplicateSimu':
          const duplicateSimuResponse = await duplicateSimu(req.body);
          jsonExtend(req.body, duplicateSimuResponse);
          break;
        // ********** LOCK SIMU **********
        case 'lockSimu':
          const lockSimuResponse = await lockSimu(req.body);
          jsonExtend(req.body, lockSimuResponse);
          break;

        // ********** GET DATAS LOTS ES POUR CLIENT **********
        case 'getDatasLotsESPourClient':
          const getDatasLotsESPourClientResponse = await getDatasLotsESPourClient(req.body);
          jsonExtend(req.body, getDatasLotsESPourClientResponse);
          break;

        // ********** GET ETUDE DETAILLEE **********
        case 'getEtudeDetaillee':
          const getEtudeDetailleeResponse = await getEtudeDetaillee(req.body);
          jsonExtend(req.body, getEtudeDetailleeResponse);
          break;

        // ********** GET ETUDE DETAILLEE GLOBALE **********
        case 'getEtudeDetailleeGlob':
          const getEtudeDetailleeGlobResponse = await getEtudeDetailleeGlob(req.body);
          jsonExtend(req.body, getEtudeDetailleeGlobResponse);
          break;

        // ****** GET APPORT NEUTRALISANT L'EFFORT D'EPARGNE AU TERME DU FINANCEMENT ******
        case 'getANEETF':
          jsonExtend(req.body, { shouldUpdateSimu: true });
          const getANEETFResponse = await getANEETF(req.body);
          jsonExtend(req.body, getANEETFResponse);
          break;

        // ****** GET APPORT POUR TAUX D'ENDETTEMENT SPECIFIQUE ******
        // en fait pas besoin de serveur !!!!!!!! -> car pas besoin d'étude détaillée
        // case 'getApportPourTE':
        //   // jsonExtend(req.body, { shouldUpdateSimu: true });
        //   const getApportPourTEResponse = await getApportPourTE(req.body);
        //   jsonExtend(req.body, getApportPourTEResponse);
        //   break;

        // ********** GET LOTS ETATS TOCKS **********
        case 'getLotsEtatStocks':
          const getLotsEtatStocksResponse = await getLotsEtatStocks(req.body);
          jsonExtend(req.body, getLotsEtatStocksResponse);
          break;

        // ********** UPDATE LOT ETAT STOCKS **********
        case 'updateLotES':
          const updateLotESResponse = await updateLotES(req.body);
          jsonExtend(req.body, updateLotESResponse);
          break;

        // ********** DELETE LOT ETAT STOCKS **********
        case 'deleteLotES':
          const deleteLotESResponse = await deleteLotES(req.body);
          jsonExtend(req.body, deleteLotESResponse);
          break;

        // ********** CREATE LOT ETAT STOCKS **********
        case 'createLotES':
          const createLotESResponse = await createLotES(req.body);
          jsonExtend(req.body, createLotESResponse);
          break;

        // ********** UPDATE PROGRAMME ETAT STOCKS **********
        case 'updateProgramme':
          const updateProgrammeResponse = await updateProgramme(req.body);
          jsonExtend(req.body, updateProgrammeResponse);
          break;

        // ********** DELETE PROGRAMME ETAT STOCKS **********
        // case 'deleteProgramme':
        //   const deleteProgrammeResponse = await deleteProgramme(req.body);
        //   jsonExtend(req.body, deleteProgrammeResponse);
        //   break;

        // // ********** CREATE LOTPROGRAMME ETAT STOCKS **********
        // case 'createProgramme':
        //   const createProgrammeResponse = await createProgramme(req.body);
        //   jsonExtend(req.body, createProgrammeResponse);
        //   break;

        // ********** GET TOUTES CHARGES **********
        case 'getToutesCharges':
          const getToutesChargesResponse = await getToutesCharges(req.body);
          jsonExtend(req.body, getToutesChargesResponse);
          break;

        // ********** UPDATE CHARGES **********
        case 'updateCharges':
          const updateChargesResponse = await updateCharges(req.body);
          jsonExtend(req.body, updateChargesResponse);
          break;

        // ********** DELETE CHARGES **********
        case 'deleteCharges':
          const deleteChargesResponse = await deleteCharges(req.body);
          jsonExtend(req.body, deleteChargesResponse);
          break;

        // // ********** CREATE CHARGES **********
        case 'createCharges':
          const createChargesResponse = await createCharges(req.body);
          jsonExtend(req.body, createChargesResponse);
          break;

        // ********** GET LISTE FILES **********
        case 'getListeFiles':
          const getListeFilesResponse = await getListeFiles(req.body);
          jsonExtend(req.body, getListeFilesResponse);
          break;

        // ********** UPLOAD FILE **********
        case 'uploadFile':
          const uploadFileResponse = await uploadFile(req.body);
          jsonExtend(req.body, uploadFileResponse);
          break;

        // ********** DELETE FILE **********
        case 'deleteFile':
          const deleteFileResponse = await deleteFile(req.body);
          jsonExtend(req.body, deleteFileResponse);
          break;

        // ********** UPDATE SUIVI PROJET **********
        case 'updateSuiviProjet':
          const updateSuiviProjetResponse = await updateSuiviProjet(req.body);
          jsonExtend(req.body, updateSuiviProjetResponse);
          break;

        // ********** UPDATE ETAPE SOUS-ETAPE EN COURS **********
        case 'mAJEtapeSousEtapeCouranteSP':
          const mAJEtapeSousEtapeCouranteSPResponse = await mAJEtapeSousEtapeCouranteSP(req.body);
          jsonExtend(req.body, mAJEtapeSousEtapeCouranteSPResponse);
          break;

        // ********** GET SUIVI PROJET **********
        case 'getSuiviProjet':
          const getSuiviProjetResponse = await getSuiviProjet(req.body);
          jsonExtend(req.body, getSuiviProjetResponse);
          break;

        // ********** GET ENFANTS et PLACEMENTS FINANCIERS **********
        case 'getEnfantsEtPlacementsFinanciers':
          const getEnfantsEtPlacementsFinanciersResponse = await getEnfantsEtPlacementsFinanciers(req.body);
          jsonExtend(req.body, getEnfantsEtPlacementsFinanciersResponse);
          break;

        // ********** DELETE PLACEMENT FINANCIER **********
        case 'deletePlacementFinancier':
          const deletePlacementFinancierResponse = await deletePlacementFinancier(req.body);
          jsonExtend(req.body, deletePlacementFinancierResponse);
          break;

        // ********** DELETE ENFANT **********
        case 'deleteEnfant':
          const deleteEnfantResponse = await deleteEnfant(req.body);
          jsonExtend(req.body, deleteEnfantResponse);
          break;

        // ********** CREATE PLACEMENT FINANCIER **********
        case 'createPlacementFinancier':
          const createPlacementFinancierResponse = await createPlacementFinancier(req.body);
          jsonExtend(req.body, createPlacementFinancierResponse);
          break;

        // ********** CREATE ENFANT **********
        case 'createEnfant':
          const createEnfantResponse = await createEnfant(req.body);
          jsonExtend(req.body, createEnfantResponse);
          break;

        // ********** CREATE PRET **********
        case 'createPret':
          const createPretResponse = await createPret(req.body);
          jsonExtend(req.body, createPretResponse);
          break;

        // ********** CREATE PRET **********
        case 'getPropositionsBancaires':
          const getPropositionsBancairesResponse = await getPropositionsBancaires(req.body);
          jsonExtend(req.body, getPropositionsBancairesResponse);
          break;

        // ********** UPDATE PRET **********
        case 'updatePret':
          const updatePretResponse = await updatePret(req.body);
          jsonExtend(req.body, updatePretResponse);
          break;

        // ********** UPDATE LIGNE TP **********
        case 'updateLigneTP':
          const updateLigneTPResponse = await updateLigneTP(req.body);
          jsonExtend(req.body, updateLigneTPResponse);
          break;

        // ********** DELETE LIGNE TP **********
        case 'deleteLigneTP':
          const deleteLigneTPResponse = await deleteLigneTP(req.body);
          jsonExtend(req.body, deleteLigneTPResponse);
          break;



        // ********** UPDATE GENERIQUE avec ID CLIENT **********
        case 'updateGeneriqueClient':
          const updateGeneriqueClientResponse = await updateGeneriqueClient(req.body);
          jsonExtend(req.body, updateGeneriqueClientResponse);
          break;

        // ********** GET ALERTES **********
        case 'getAlertes':
          const getAlertesResponse = await getAlertes(req.body);
          jsonExtend(req.body, getAlertesResponse);
          break;

        // ********** DELETE ALERTE **********
        case 'deleteAlerte':
          const deleteAlerteResponse = await deleteAlerte(req.body);
          jsonExtend(req.body, deleteAlerteResponse);
          break;

        // ********** UPDATE ALERTE **********
        case 'updateAlerte':
          const updateAlerteResponse = await updateAlerte(req.body);
          jsonExtend(req.body, updateAlerteResponse);
          break;

        // ********** CREATE ALERTE **********
        case 'createAlerte':
          const createAlerteResponse = await createAlerte(req.body);
          jsonExtend(req.body, createAlerteResponse);
          break;

        // ********** CREATE ALERTES (tableau d'alertes) **********
        case 'createAlertes':
          const createAlertesResponse = await createAlertes(req.body);
          jsonExtend(req.body, createAlertesResponse);
          break;


        // ********** DELETE ALERTE **********
        case 'deleteCommentaire':
          const deleteCommentaireResponse = await deleteCommentaire(req.body);
          jsonExtend(req.body, deleteCommentaireResponse);
          break;
        // ********** DELETE PROPOSITION BANCAIRE **********
        case 'deletePropositionBancaire':
          const deletePropositionBancaireResponse = await deletePropositionBancaire(req.body);
          jsonExtend(req.body, deletePropositionBancaireResponse);
          break;

        // ********** UPDATE ALERTE **********
        case 'updateCommentaire':
          const updateCommentaireResponse = await updateCommentaire(req.body);
          jsonExtend(req.body, updateCommentaireResponse);
          break;

        // ********** CREATE ALERTE **********
        case 'createCommentaire':
          const createCommentaireResponse = await createCommentaire(req.body);
          jsonExtend(req.body, createCommentaireResponse);
          break;


        // ********** CREATE ACCES CLIENT **********
        case 'createAccesUser':
          const createAccesUserResponse = await createAccesUser(req.body);
          jsonExtend(req.body, createAccesUserResponse);
          break;

        /* **************************** */
        /* ***  BASE PARTENAIRES    *** */
        /* **************************** */

        ////////// CREATE BASE PARTENAIRES //////////

        // ********** CREATE SOCIETE **********
        case 'createSociete':
          const createSocieteResponse = await createSociete(req.body);
          jsonExtend(req.body, createSocieteResponse);
          break;

        // ********** CREATE CONSEILLER **********
        case 'createConseiller':
          const createConseillerResponse = await createConseiller(req.body);
          jsonExtend(req.body, createConseillerResponse);
          break;

        // ********** CREATE FOURNISSEUR **********
        case 'createFournisseur':
          const createFournisseurResponse = await createFournisseur(req.body);
          jsonExtend(req.body, createFournisseurResponse);
          break;

        // ********** CREATE INTERLOCUTEUR FOURNISSEUR **********
        case 'createFournInterlocuteur':
          const createFournInterlocuteurResponse = await createFournInterlocuteur(req.body);
          jsonExtend(req.body, createFournInterlocuteurResponse);
          break;

        // ********** CREATE CABINET COMPTABLE **********
        case 'createCabinetComptable':
          const createCabinetComptableResponse = await createCabinetComptable(req.body);
          jsonExtend(req.body, createCabinetComptableResponse);
          break;

        // ********** CREATE COMPTABLE **********
        case 'createComptable':
          const createComptableResponse = await createComptable(req.body);
          jsonExtend(req.body, createComptableResponse);
          break;

        // ********** CREATE CABINET DE COURTAGE **********
        case 'createCabinetCourtage':
          const createCabinetCourtageResponse = await createCabinetCourtage(req.body);
          jsonExtend(req.body, createCabinetCourtageResponse);
          break;

        // ********** CREATE COURTIER **********
        case 'createCourtier':
          const createCourtierResponse = await createCourtier(req.body);
          jsonExtend(req.body, createCourtierResponse);
          break;

        ////////// UPDATE BASE PARTENAIRES //////////

        // ********** UPDATE SOCIETE **********
        case 'updateSociete':
          const updateSocieteResponse = await updateSociete(req.body);
          jsonExtend(req.body, updateSocieteResponse);
          break;

        // ********** UPDATE CONSEILLER **********
        case 'updateConseiller':
          const updateConseillerResponse = await updateConseiller(req.body);
          jsonExtend(req.body, updateConseillerResponse);
          break;

        // ********** UPDATE FOURNISSEUR **********
        case 'updateFournisseur':
          const updateFournisseurResponse = await updateFournisseur(req.body);
          jsonExtend(req.body, updateFournisseurResponse);
          break;

        // ********** UPDATE FOURNISSEUR INTERLOCUTEUR **********
        case 'updateFournInterlocuteur':
          const updateFournInterlocuteurResponse = await updateFournInterlocuteur(req.body);
          jsonExtend(req.body, updateFournInterlocuteurResponse);
          break;

        // ********** UPDATE CABINET COMPTABLE **********
        case 'updateCabinetComptable':
          const updateCabinetComptableResponse = await updateCabinetComptable(req.body);
          jsonExtend(req.body, updateCabinetComptableResponse);
          break;

        // ********** UPDATE COMPTABLE **********
        case 'updateComptable':
          const updateComptableResponse = await updateComptable(req.body);
          jsonExtend(req.body, updateComptableResponse);
          break;

        // ********** UPDATE CABINET DE COURTAGE **********
        case 'updateCabinetCourtage':
          const updateCabinetCourtageResponse = await updateCabinetCourtage(req.body);
          jsonExtend(req.body, updateCabinetCourtageResponse);
          break;

        // ********** UPDATE COURTIER **********
        case 'updateCourtier':
          const updateCourtierResponse = await updateCourtier(req.body);
          jsonExtend(req.body, updateCourtierResponse);
          break;


        ////////// DELETE BASE PARTENAIRES //////////

        // ********** DELETE SOCIETE **********
        case 'deleteSociete':
          const deleteSocieteResponse = await deleteGenerique(
            (req.body as DataDeleteSocieteRequest).idSociete,
            'id',
            'societe',
            [],
            useBaseLocale,
          );
          jsonExtend(req.body, deleteSocieteResponse);
          break;

        // ********** DELETE CONSEILLER **********
        case 'deleteConseiller':
          const deleteConseillerResponse = await deleteConseiller(req.body);
          jsonExtend(req.body, deleteConseillerResponse);
          break;

        // ********** DELETE FOURNISSEUR **********
        case 'deleteFournisseur':
          const deleteFournisseurResponse = await deleteGenerique(
            (req.body as DataDeleteFournisseurRequest).id_fournisseur,
            'id_fournisseur',
            'fournisseur',
            [],
            useBaseLocale,
          );
          jsonExtend(req.body, deleteFournisseurResponse);
          break;

        // ********** DELETE INTERLOCUTEUR FOURNISSEUR **********
        case 'deleteFournInterlocuteur':
          const deleteFournInterlocuteurResponse = await deleteGenerique(
            (req.body as DataDeleteFournInterlocuteurRequest).id_fournInterlocuteur,
            'id_fournisseur_interlocuteur',
            'fournisseur_interlocuteur',
            [TYPE_USER_CHEF_FOURNISSEUR, TYPE_USER_FOURN_INTERLOCUTEUR],
            useBaseLocale,
          );
          jsonExtend(req.body, deleteFournInterlocuteurResponse);
          break;

        // ********** DELETE CABINET COMPTABLE **********
        case 'deleteCabinetComptable':
          const deleteCabinetComptableResponse = await deleteGenerique(
            (req.body as DataDeleteCabinetComptableRequest).id_cabinet_comptable,
            'id_cabinet',
            'cabinet_comptable',
            [],
            useBaseLocale,
          );
          jsonExtend(req.body, deleteCabinetComptableResponse);
          break;

        // ********** DELETE COMPTABLE **********
        case 'deleteComptable':
          const deleteComptableResponse = await deleteGenerique(
            (req.body as DataDeleteComptableRequest).id_comptable,
            'id_comptable',
            'comptable',
            [TYPE_USER_CHEF_CABINET_COMPTABLE, TYPE_USER_COMPTABLE],
            useBaseLocale,
          );
          jsonExtend(req.body, deleteComptableResponse);
          break;

        // ********** DELETE CABINET COURTAGE **********
        case 'deleteCabinetCourtage':
          const deleteCabinetCourtageResponse = await deleteGenerique(
            (req.body as DataDeleteCabinetCourtageRequest).id_cabinet_courtage,
            'id_cabinet',
            'cabinet_courtage',
            [],
            useBaseLocale,
          );
          jsonExtend(req.body, deleteCabinetCourtageResponse);
          break;

        // ********** DELETE COURTIER **********
        case 'deleteCourtier':
          const deleteCourtierResponse = await deleteGenerique(
            (req.body as DataDeleteCourtierRequest).id_courtier,
            'id_courtier',
            'courtier',
            [TYPE_USER_CHEF_CABINET_COURTAGE, TYPE_USER_CHEF_CABINET_COURTAGE],
            useBaseLocale,
          );
          jsonExtend(req.body, deleteCourtierResponse);
          break;



        // ********** MODIFICATION DE MOT DE PASSE (cas connecté, jeton normal fourni) **********
        case 'modifPassword':
          // console.log(req.body);
          const modifPwdResponse = await modifPassword(req.body);
          jsonExtend(req.body, modifPwdResponse);
          break;

        // ********** GENERATION DE LIEN D'ACTIVATION DE COMPTE **********
        case 'genereLienActivationCompte':
          // console.log(req.body);
          const genereLienActivationCompteResponse = await genereLienActivationCompte(req.body);
          jsonExtend(req.body, genereLienActivationCompteResponse);
          break;

        // ********** CREATION D'ACCES CLIENT **********
        case 'hasUserAcces':
          // console.log(req.body);
          const hasUserAccesResponse = await hasUserAcces(req.body);
          jsonExtend(req.body, hasUserAccesResponse);
          break;

        // ********** GET FOURNISSEURS **********
        // case 'getFournisseurs':
        //   const getFournisseursResponse = await getFournisseurs(req.body);
        //   jsonExtend(req.body, getFournisseursResponse);
        //   break;

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
