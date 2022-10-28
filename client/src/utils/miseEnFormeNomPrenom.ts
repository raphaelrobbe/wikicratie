export const valueMonsieur = 'M.';
export const valueMadame = 'Mme';
// export const optionsCivilite: OptionsParam[] = [
//   { value: valueMonsieur, label: valueMonsieur },
//   { value: valueMadame, label: valueMadame },
// ];

/**
 * Rend une chaîne de caractère du style "Raphaël Robbe", ou "Mme Jeannette Dupont" ou "Chers Jean et Jeanne Durand"
 * @param _client objet (si undefined, retourne retourDefaut) contenant les clés civilite nom prenom et éventuellement civlite2, nom2 et prenom2
 * @param avecCivilite si false : pas de civilité, si true, civilité, si 'cher', Cher ou Chère ou Chers ou Chères avec virgule à la fin
 * @param retourDefaut valeur de retour si _client undefined
 * @returns la chaîne, retourDefaut si paramètre _client undefined
 */
interface GetNPOptionsProps {
  avecCivilite?: boolean;
  avecCher?: boolean;
  avecPrenom?: boolean;
  avecNom?: boolean;
  retourDefaut?: string;
}
const optsVides: GetNPOptionsProps = {
  avecCher: false,
  avecCivilite: false,
  avecPrenom: true,
  avecNom: true,
  retourDefaut: '',
};

export interface GetNPProps {
  civilite?: string;
  nom: string;
  prenom: string;
}

export const getNPUtilisateur = (
  _client: GetNPProps | undefined,
  opts = optsVides,
): string => {
  const {
    avecCher = false,
    avecCivilite = false,
    avecPrenom = true,
    avecNom = true,
    retourDefaut = '',
  } = opts;
  let ret = retourDefaut;
  if (_client === undefined) {
    return retourDefaut;
  }
  const {
    civilite,
    nom,
    prenom,
  } = _client;
  if (!(civilite === ''
    && prenom === ''
    && nom === ''
  )) {
    const stringFinal1: string[] = [];
    // if (avecCher) {
    //   stringFinal1.push(civilite === valueMadame ? 'Chère' : 'Cher');
    // }
    if (avecCivilite) {
      stringFinal1.push(civilite === valueMadame ? valueMadame : valueMonsieur);
    }
    if (avecPrenom && prenom !== '') {
      stringFinal1.push(prenom);
    }
    if (avecNom && nom !== '') {
      stringFinal1.push(nom);
    }

    // const nP1 = `${civilite && avecCivilite === true ? `${civilite} ` : ''
    //   }${prenom ? `${prenom} ` : ''
    //   }${nom ? `${nom}` : ''}`;

    const nP1 = stringFinal1.join(' ');
    if (avecCher) {
      ret = `${civilite === valueMadame ? `Chère ` : `Cher `}${nP1},`;
    } else {
      ret = nP1;
    }
  }

  // if (prenom2 === 'Jeanne') {
  //   console.log(`getNPUtilisateur Jeanne : ${ret}`);
  // }

  return ret.trim();

  // return `${nP1}${situation_familiale
  //     && isMarieOuPacseFunc(situation_familiale)
  //     && nP2 !== ''
  //     ? ` et ${nP2}`
  //     : ''}`;
  // return `${civilite ? `${civilite }` : ''}${prenom} ${nom}${
  //   situation_familiale && (situation_familiale.toString() === Const.SITFAM_PACSES
  //     || situation_familiale.toString() === Const.SITFAM_MARIES)
  //   && civilite2 && nom2 && prenom2 && civilite2 !== '' && civilite2 !== '-'
  //   ? ` et ${civilite2} ${prenom2} ${nom2}` : ''
  //     }`;
}
