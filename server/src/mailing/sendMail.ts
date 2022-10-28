import nodeMailer from 'nodemailer';

import { getListeDestMailsTexte } from '../../../client/src/utils/mailing';

import { InfosMail, NomAdresse, SendEmailResponse } from "../../../common/types/mailing";

export const sendEmail = async (
  infosMail: InfosMail,
  from: NomAdresse | null,
  shouldSendAccuseLecture = true,
  shouldSendAccuseReception = true,
): Promise<SendEmailResponse & { info: any }> => {
  const returnValue = {
    success: false,
    message: 'not set',
    info: null as any,
  };
  const {
    destCc,
    destCci,
    destTo,
    objet,
    mail,
    pathsPiecesJointes,
  } = infosMail;
  const {
    texte,
    html,
  } = mail;

  // console.log(`sendEmail, emailAddressFrom : ${emailAddressFrom}`);

  const _from: NomAdresse = from === null
    ? { label: 'Ne pas répondre', adresse: 'noreply@vaerdi.fr' }
    : from;
  // if (from === null) {
    // console.log(`Adresse de l'expéditeur absente`);
    // returnValue.message = `Adresse de l'expéditeur absente`;
    // return returnValue;
  // }

  const authUser = 'postmaster@vaerdi.fr';
  const authPass = `kBe'eg3:!`;

  const transporter = nodeMailer.createTransport({
    host: 'ssl0.ovh.net',
    port: 465,
    secure: true,
    auth: {
      user: authUser,
      pass: authPass,
    },
  });

  // verify connection configuration
  try {
    await transporter.verify();
  } catch (err) {
    returnValue.message = 'Problème de connexion au mailer';
    console.log(`Problème de connexion au mailer lors de transporter.verify();`);
    console.log(err);
    return returnValue;
  }

  const nomAdresseToMailAddress = (nomAd: NomAdresse): Mail.address => {
    return {
      name: nomAd.label,
      address: nomAd.adresse,
    };
  }

  const headers: any = { rien: 'rien' };
  if (shouldSendAccuseLecture) {
    headers['Return-Receipt-to'] = getListeDestMailsTexte([_from]);
    // headers['Return-Path'] = getListeDestMailsTexte([_from]);
  }
  if (shouldSendAccuseReception) {
    headers['Disposition-Notification-To'] = getListeDestMailsTexte([_from]);
    // headers['Return-Path'] = getListeDestMailsTexte([_from]);
  }
  delete headers.rien;
  // console.log(`sendMail, headers = ${JSON.stringify(headers)}`);
  console.log(`sendMail, _from = ${JSON.stringify(_from)}`);


  const mailOptions: Mail.Options = {
    from: nomAdresseToMailAddress(_from),
    to: destTo.map((el): Mail.Address => nomAdresseToMailAddress(el)),
    cc: destCc.map((el): Mail.Address => nomAdresseToMailAddress(el)),
    bcc: destCci.map((el): Mail.Address => nomAdresseToMailAddress(el)),
    subject: objet, // Subject line
    text: texte,
    html,
    headers,
    attachments: pathsPiecesJointes.map(path => ({
      path,
    })),
  };

  try {
    returnValue.info = await transporter.sendMail(mailOptions);
    console.log(`Mail envoyé avec succès. retour sendMail : ${JSON.stringify(returnValue.info)}`);
  } catch (err) {
    returnValue.message = 'Problème de connexion au mailer';
    console.log(`Problème de connexion au mailer lors de transporter.sendMail`);
    console.log(err);
    return returnValue;
  }

  returnValue.success = true;

  return returnValue;
}
