/* eslint max-len: 0 */
import React from "react";
import { QuestionFAQ } from "../../classes/classeQuestionFAQ";
import { Paragraphe } from "../../../../common/types/typesArticles";

const questionQuEstCeCPTPara1: Paragraphe = {
  texte: <>
    <p>
      <span>{`La CPT, acronyme pour Constitution Provisoire de Transition est une Constitution d’initiative citoyenne. Elle est téléchargeable au format pdf par le lien court `}
        <a href={`http://lc.cx/CPT-pdf`} target={'_blank'}>{`en cliquant ici`}</a>{`.`}
      </span>
    </p>
    </>,
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
};
const questionQuEstCeCPTPara2: Paragraphe = {
  texte: <>
    <p>
      <span>{`Elle permet l’exercice du pouvoir par le peuple par l’intermédiaire de six pouvoirs séparés qu’il contrôle. Elle a vocation à remplacer la Constitution de la Vème République et à être elle meme remplacée par la Constitution qui sera écrite par une assemblée constituante tirée au sort dès que celle ci aura été validée par référendum. Pour ajouter des questions, `}
        <a href={`https://lc.cx/edit_FAQ-CPT`} target={'_blank'}>{`cliquez ici`}</a>{`.`}
      </span>
    </p>
    </>,
  tempsDepart: 5,
  dateDerniereModif: new Date(2020, 4, 30),
};

export const questionQuEstCeCPT = new QuestionFAQ(
  `Qu'est-ce que la CPT ?`,
  [
    questionQuEstCeCPTPara1,
    questionQuEstCeCPTPara2,
  ],
);
