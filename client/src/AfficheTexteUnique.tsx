import React from 'react';
import { useArticlesContext } from './contexts/ArticlesContext';

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
  const {
    articleEnCours,
  } = useArticlesContext();

  const handleClick = (): void => {
    if (articleEnCours && tempsDepart !== undefined) {
      articleEnCours.setAudioCurrentTime(tempsDepart)
    }
  }

  return (
    <div
      className={([] as string[])
        .concat(isTitre ? 'titre-paragraphe' : 'paragraphe')
        .concat(tempsDepart !== undefined ? 'avec-audio' : '')
        .join(' ')
      }
      onClick={handleClick}
    >
      {typeof texte === 'string'
        ? <p>{texte}</p>
        : texte
      }
    </div>
  );
};
