/* eslint max-len: 0 */
import React from "react";
import { pathRepertoireAudiosArticles } from "../paths";
import { Article } from "../../classes/classeArticle";
import { Paragraphe } from "../../../../common/types/typesArticles";

const intentionPara1 = {
  texte: <>
    <p>{`La constitution provisoire de transition (CPT) a été écrite avec l'intention suivante :`}</p>
    <p>{`Une société équitable et unie doit être basée sur une Constitution écrite et approuvée par le Peuple souverain. Jamais un gouvernement issu de nos institutions actuelles conçues pour maintenir l’oligarchie au pouvoir, ne mettra en œuvre un processus démocratique le permettant.`}</p>
  </>,
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
};

const intentionPara2_1 = {
  texte: <>
    <p>{`Il faut donc prévoir une période de transition institutionnelle permettant de réunir les conditions de cette évolution en attendant que le peuple mobilisé la réclame. La faisabilité est bien sûr la condition pour espérer la mobilisation massive indispensable du peuple derrière cette exigence. Seul le très grand nombre permettra de mettre en œuvre une transition pacifique.`}</p>
    <p>{`Il s’agit donc par ce texte de rendre possible l’amorçage d’un cercle démocratique vertueux. Ce cercle vertueux démocratique devra permettre d’agréger l’immense majorité du peuple pour en finir avec la domination de l’infime minorité que constitue l’oligarchie.`}</p>
  </>,
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
  titre: 'alinéa 1',
};

const intentionPara2_2 = {
  texte: `Les normes juridiques définies en 1958 pour la Vème République ne permettant pas une transition institutionnelle sous contrôle citoyen, ce texte constitutionnel transitoire a été écrit à l’initiative de quelques citoyens volontaires ne cherchant le pouvoir ni pour eux ni pour leurs proches. Il est destiné à permettre d’assurer sans désordre et sans violence un processus constituant, on l’appelle Constitution Provisoire de Transition (CPT). Ses auteurs ne représentent pas tout le peuple et le savent, alors ils y ont inclus et défini les règles de mise en place et de travail d’une assemblée constituante tirée au sort, les règles d’instruction, de délibération, d’écriture des différents articles puis de vote, tout comme le principe d’un référendum final destiné à promulguer cette future Constitution. Rassemblant un échantillon représentatif du peuple dans toute sa diversité (genre, âge, localisation géographique, richesses, profession, habitat, …), cette assemblée tirée au sort représentera mieux le peuple que des politiciens.`,
  tempsDepart: 41.5,
  dateDerniereModif: new Date(2020, 4, 30),
};

const intentionPara2 = {
  texte: [intentionPara2_1, intentionPara2_2],
  tempsDepart: 27.3,
  dateDerniereModif: new Date(2020, 4, 30),
};

const intentionPara3 = {
  texte: `Pour écrire une constitution, ces citoyens non professionnels du droit auront besoin d’être aidés et éclairés (avec neutralité par des débats contradictoires) comme peuvent l’être des jurés lors d’un procès par des intervenants dont les partis pris opposés s'annulent (comme l’accusation et la défense dans un procès).`,
  tempsDepart: 138.2,
  dateDerniereModif: new Date(2020, 4, 30),
};

// export const articleIntention = new Article(
//   `Intention`,
//   'intention',
//   [
//     intentionPara1,
//     intentionPara2,
//     intentionPara3,
//   ],
//   0,
//   null,
//   `${pathRepertoireAudiosArticles}CPT_01Intention.mp3`,
// );
