/* eslint max-len: 0 */
import React from "react";
import { QuestionFAQ } from "../../classes/classeQuestionFAQ";
import { Paragraphe } from "../../../../common/types/typesArticles";

const questionInteretCPTPara1: Paragraphe = {
  texte: `Il est répondu à cette question dans la première page de la CPT qui décrit l’intention du texte.`,
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
};
const questionInteretCPTPara2: Paragraphe = {
  texte: `Une Constitution provisoire a vocation à être une constitution intermédiaire entre notre Constitution actuelle une Constitution durable écrite dans le cadre d'un processus constituant.`,
  tempsDepart: 5,
  dateDerniereModif: new Date(2020, 4, 30),
};
const questionInteretCPTPara3: Paragraphe = {
  texte: `Il faut y recourir quand les pouvoirs issus de la Constitution en cours ne permettent pas de mener à bien ce processus constituant de façon satisfaisante. C’est bien le cas puisque ceux ci sont constitués de personnes dont la carrière dépend de la Constitution actuelle sont en situation de conflit d’intérêt pour mener ce processus.`,
  tempsDepart: 10,
  dateDerniereModif: new Date(2020, 4, 30),
};

export const questionInteretCPT = new QuestionFAQ(
  `Quel est l'intérêt d'une Constitution provisoire ?`,
  [
    questionInteretCPTPara1,
    questionInteretCPTPara2,
    questionInteretCPTPara3,
  ],
);
