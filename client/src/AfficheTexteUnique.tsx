import React from 'react';
import { BoutonsParagraphe } from './BoutonsParagraphe';

interface AfficheTexteUniqueProps {
  texte: string | JSX.Element;
  isTitre?: boolean;
  tempsDepart?: number;
}
export const AfficheTexteUnique: React.FC<AfficheTexteUniqueProps> = ({
  texte,
  isTitre = false,
  tempsDepart,
}) => {

  return (
    <div
      className={(['rounded', 'p-1'] as string[])
        .concat(isTitre ? 'titre-paragraphe' : 'paragraphe')
        .concat(tempsDepart !== undefined ? 'avec-audio' : '')
        .join(' ')
      }
    >
      <BoutonsParagraphe
          tempsDepart={tempsDepart}
      />
      {typeof texte === 'string'
        ? <p>{texte}</p>
        : texte
      }
    </div>
  );
};
