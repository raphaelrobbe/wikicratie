/* eslint max-len: 0 */
import React from "react";
import { pathRepertoireAudiosArticles } from "../paths";
import { Article } from "../../classes/classeArticle";
import { Paragraphe } from "../../../../common/types/typesArticles";

const preambulePara1_1 = {
  texte: `Le texte qui nous sert de Constitution pour la Vème République a été rédigé en 1958, par quelques hommes autour de la personnalité du Général de Gaulle.`,
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara1_2 = {
  texte: `Ce texte qui nous sert de Constitution, écrit par quelques uns, a été validé par référendum alors que la seule alternative du peuple aurait été de garder l’ancienne Constitution jugée inadaptée.`,
  tempsDepart: 14.7,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara1_3 = {
  texte: `Ce texte a permis depuis à des Présidents de moins en moins consensuels de se faire élire par défaut, ce qui remet en cause leur légitimité à représenter le peuple et à exercer sa souveraineté.`,
  tempsDepart: 20,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara1_4 = {
  texte: `Ce texte, de surcroit, leur donne la quasi exclusivité des révisions constitutionnelles.`,
  tempsDepart: 30,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara1_5 = {
  texte: `En 2021 le peuple Français insurgé décide qu’est enfin venu le temps pour lui d’écrire lui-même les règles du pouvoir, donc sa Constitution, pour établir une société réellement démocratique.`,
  tempsDepart: 40,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara1_6 = {
  texte: `Pour cela, il promulgue l’entrée en vigueur de cette Constitution dite « Provisoire de Transition », écrite par quelques citoyens volontaires ne cherchant pas à exercer le pouvoir mais voulant servir le bien commun.`,
  tempsDepart: 50,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara1_7 = {
  texte: `Ce texte n’a pas pour objectif d’être exhaustif car il est un texte de transition et pour tout ce qui n’y est pas précisé, les dispositions de la constitution de 1958 dans sa version d’origine continueront à s’appliquer jusqu’à ce que le pouvoir constituant provisoire, tiré au sort et indépendant des autres pouvoirs définis plus bas dans ce texte, comble et précise les vides constitutionnels.`,
  tempsDepart: 60,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara1 = {
  texte: [
    preambulePara1_1,
    preambulePara1_2,
    preambulePara1_3,
    preambulePara1_4,
    preambulePara1_5,
    preambulePara1_6,
    preambulePara1_7,
  ],
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
  titre: `Le contexte`,
};
const preambulePara2_1 = {
  texte: <ul>
    <li>{`Définir et contrôler les organes de pilotage de l’état (pouvoirs publics) en leur assignant la tâche de mettre en œuvre les mesures d’urgence sociale et le processus constituant populaire (défini en annexe 5).`}</li>
    <li>{`Définir l’expédition des affaires courantes (fonctionnement des administrations de l’Etat)`}</li>
    </ul>,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara2_2 = {
  texte: ``,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara2_3 = {
  texte: ``,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara2_4 = {
  texte: ``,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara2_5 = {
  texte: ``,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara2_6 = {
  texte: ``,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara2_7 = {
  texte: ``,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara2_8 = {
  texte: ``,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};
const preambulePara2 = {
  texte: [
    preambulePara2_1,
    preambulePara2_2,
    preambulePara2_3,
    preambulePara2_4,
    preambulePara2_5,
    preambulePara2_6,
    preambulePara2_7,
  ],
  tempsDepart: 70,
  dateDerniereModif: new Date(2020, 4, 30),
  titre: `Objectifs de ce texte provisoire`,
};

// export const articlePreambule = new Article(
//   `Préambule`,
//   'preambule',
//   [preambulePara1],
//   0,
//   null,
//   `${pathRepertoireAudiosArticles}CPT_02Preambule.mp3`,
//   null,
//   `Le contexte, Valeurs, principes et modalités`,
// );
