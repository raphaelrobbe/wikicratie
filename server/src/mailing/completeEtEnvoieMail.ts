import { getListeDestMailsTexte, replaceAllFromAllDuets } from '../../../client/src/utils/mailing';
import { InfosMail, NomAdresse, ReplaceDuet, SendEmailResponse } from '../../../common/types/mailing';
import envoiEtEnregistreMailBase from './envoiEtEnregistreMailBase';

interface CompleteEtEnvoieMailProps {
  idUserExpediteur: number;
  typeUserExpediteur: number;
  idsUserDestinataire: number[];
  typesUserDesinataires: number[];
  infosMail: InfosMail;
  replaceDuets: ReplaceDuet[];
  useBaseLocale?: boolean;
  path?: string;
  from: NomAdresse | null;
}
const completeEtEnvoieMail = async ({
  idUserExpediteur,
  typeUserExpediteur,
  idsUserDestinataire,
  typesUserDesinataires,
  infosMail,
  replaceDuets,
  useBaseLocale = false,
  path = '',
  from,
}: CompleteEtEnvoieMailProps): Promise<SendEmailResponse> => {
  console.log(`completeEtEnvoieMail`);

  const {
    mail,
  } = infosMail;
  const {
    texte,
    html,
  } = mail;

  let returnValue: SendEmailResponse = {
    success: false,
    message: 'probleme completeEtEnvoieMail',
  };

  const newTexte = replaceAllFromAllDuets(texte, replaceDuets);
  const newHtml = replaceAllFromAllDuets(html, replaceDuets);

  const newInfosMail: InfosMail = {
    ...infosMail,
    mail: {
      texte: newTexte,
      html: newHtml,
    }
  }

  const retEnvoiEtEnregistreMail = await envoiEtEnregistreMailBase({
    idUserExpediteur,
    typeUserExpediteur,
    typesUserDesinataires,
    idsUserDestinataire,
    infosMail: newInfosMail,
    useBaseLocale,
    path,
    from,
  });

  if (!retEnvoiEtEnregistreMail.success) {
    console.log(`completeEtEnvoieMail.ts, completeEtEnvoieMail, ${retEnvoiEtEnregistreMail.message}`);
    returnValue.message = retEnvoiEtEnregistreMail.message;
    return returnValue;
  }

  returnValue.success = true;
  returnValue.message = `Mail de suivi client envoyé à ${getListeDestMailsTexte(infosMail.destTo)}`;
  // returnValue.message = `email envoyé à ${_emailAddressTo}`;

  // console.log('Message %s envoyé : %s', ret.info.messageId, ret.info.response);

  return returnValue;
}

export default completeEtEnvoieMail;
