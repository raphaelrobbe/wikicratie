import { getNPUtilisateur } from "../../../client/src/utils/miseEnFormeNomPrenom";
import { NomAdresse } from "../../../common/types/mailing";

export const getNomAdresseUser = async (
  id: number,
  type_user: number,
  useBaseLocale: boolean,
): Promise<NomAdresse | null> => {
  // const nPAdresse = await getNPEtAdresseMail(id, type_user, useBaseLocale);
  // if (!nPAdresse.success) {
  //   return null;
  // }
  const nomAdresse: NomAdresse = {
    adresse: 'adresse_fake@fake.com',
    label: getNPUtilisateur({ nom: 'Fake', prenom: 'Roger' }),
  };
  return nomAdresse;
}
