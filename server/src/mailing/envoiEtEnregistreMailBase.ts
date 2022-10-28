import { sqlInsert } from "sqlRequests/basicRequests";
import { SqlCondition } from "types/sql";
import { getListeDestMailsTexte } from "../../../client/src/utils/mailing";
import { toMysqlFormat } from "../../../client/src/utils/utilsDates";
import { InfosMail, NomAdresse, SendEmailResponse } from "../../../common/types/mailing";
import { sendEmail } from "./sendMail";

interface EnvoiMailProps {
  idUserExpediteur: number;
  typeUserExpediteur: number;
  idsUserDestinataire: number[];
  typesUserDesinataires: number[];
  infosMail: InfosMail;
  useBaseLocale?: boolean;
  path?: string;
  from: NomAdresse;
}
const envoiEtEnregistreMailBase = async ({
  idUserExpediteur,
  idsUserDestinataire,
  typeUserExpediteur,
  typesUserDesinataires,
  infosMail,
  useBaseLocale = false,
  path = '',
  from,
}: EnvoiMailProps): Promise<SendEmailResponse> => {
  console.log(`envoiEtEnregistreMailBase`);

  const {
    mail,
    destCc,
    destCci,
    destTo,
    objet,
  } = infosMail;
  const {
    texte,
    html,
  } = mail;

  let returnValue: SendEmailResponse = {
    success: false,
    message: 'probleme envoiEtEnregistreMailBase',
  };

  const ret = await sendEmail(
    infosMail,
    from,
  );

  if (!ret.success) {
    console.log(`envoiEtEnregistreMailBase.ts, envoiEtEnregistreMailBase, ret.info=${JSON.stringify(ret.info)}`);
    returnValue.message = 'Problème de connexion au mailer';
    return returnValue;
  }

  if (path !== '') {
    const dateNowMySql = toMysqlFormat(new Date());

    for (let i = 0; i < idsUserDestinataire.length && i < typesUserDesinataires.length; i += 1) {
      const idUserDestinataire = idsUserDestinataire[i];
      const typeUserDestinataire = typesUserDesinataires[i];

      const toInsertMail: SqlCondition[] = [];
      toInsertMail.push({ column: 'idUserExpediteur', value: idUserExpediteur });
      toInsertMail.push({ column: 'type_user_destinataire', value: typeUserDestinataire });
      toInsertMail.push({ column: 'type_user_expediteur', value: typeUserExpediteur });
      toInsertMail.push({ column: 'id_user_destinataire', value: idUserDestinataire });
      toInsertMail.push({ column: 'html', value: html });
      toInsertMail.push({ column: 'texte', value: texte });
      toInsertMail.push({ column: 'destTo', value: getListeDestMailsTexte(destTo) });
      toInsertMail.push({ column: 'destCc', value: getListeDestMailsTexte(destCc) });
      toInsertMail.push({ column: 'destCci', value: getListeDestMailsTexte(destCci) });
      toInsertMail.push({ column: 'replyTo', value: getListeDestMailsTexte([from]) });
      toInsertMail.push({ column: 'from', value: getListeDestMailsTexte([from]) });
      toInsertMail.push({ column: 'objet', value: objet });
      toInsertMail.push({ column: 'path', value: path });
      toInsertMail.push({ column: 'date_envoi_email', value: dateNowMySql });

      const retInsertMail = await sqlInsert(
        'email',
        toInsertMail,
        useBaseLocale,
      );
      // console.log('parties[i] =', parties[i], ' ret=', ret);

      if (retInsertMail.affectedRows !== 1) {
        console.log(`envoiEtEnregistreMailBase.ts, sqlInsert, retUpdateDateEnvoi=${JSON.stringify(retInsertMail)}`);
        returnValue.message = `Problème de création de mail en base`;
        return returnValue;
      }
    }
  }

  console.log(`envoiEtEnregistreMailBase success`);

  returnValue.success = true;
  returnValue.message = `Mail envoyé à ${getListeDestMailsTexte(infosMail.destTo)}`;

  return returnValue;
}

export default envoiEtEnregistreMailBase;
