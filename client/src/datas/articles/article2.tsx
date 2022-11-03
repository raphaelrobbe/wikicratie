/* eslint max-len: 0 */
import React from "react";
import { pathRepertoireAudiosArticles } from "../paths";
import { Article } from "../../classes/classeArticle";
import { Paragraphe } from "../../../../common/types/typesArticles";

const article2Intention = {
  texte: `Préciser la nature des pouvoirs à instituer, à séparer et à maintenir sous la tutelle du peuple.`,
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
  type: 'intention',
};
const article2Para1_1 = {
  texte: `Les pouvoirs publics constitutionnels sont des pouvoirs délégués par le peuple, séparés et définis ainsi :`,
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article2Para1_2 = {
  texte: <ul>
    <li>{`Le pouvoir Parlementaire et Législatif`}</li>
    <li>{`Le pouvoir Exécutant`}</li>
    <li>{`Le pouvoir Judiciaire`}</li>
    <li>{`Le pouvoir Financier (monétaire) : Création d’une monnaie nationale appelée le Démoc sans parité fixe par la banque de France seule institution habilitée à créer cette monnaie et à la prêter à l’état français sans intérêts.`}</li>
    <li>{`Le pouvoir Éducatif et Médiatique`}</li>
    <li>{`Le pouvoir Constitutionnel (ou constituant): un conseil constituant permanent (100 membres tirés au sort)`}</li>
    </ul>,
  tempsDepart: 5,
  dateDerniereModif: new Date(2020, 4, 30),
};

const article2Para1 = {
  texte: [
    article2Para1_1,
    article2Para1_2,
  ],
  tempsDepart: 14.8,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article2Para2 = {
  texte: `Aucun de ces pouvoirs ne peut être sous la tutelle d'un des autres. Chacun d'entre eux est soumis au contrôle d’une chambre de citoyens français spécifique tirée au sort et renouvelée par tiers toutes les 10 séances. Des membres sortants de ces chambres peuvent être élus par leur pairs à titre d'expert non votant pour animer et participer aux formations et travaux de ces chambres de contrôle.`,
  tempsDepart: 59.5,
  dateDerniereModif: new Date(2020, 4, 30),
};

// export const article2 = new Article(
//   `Article 2`,
//   '2',
//   [
//     article2Intention,
//     article2Para1,
//     article2Para2,
//   ],
//   0,
//   null,
//   `${pathRepertoireAudiosArticles}CPT_04Article2.mp3`,
//   null,
//   `Les pouvoirs publics`,
// );
