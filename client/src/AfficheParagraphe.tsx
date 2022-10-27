import React, { useMemo } from 'react';
import { Paragraphe } from '../../common/types/typesArticles';
import { AfficheTexteUnique } from './AfficheTexteUnique';
import { TitreIntention } from './TitreIntention';

interface AfficheParagrapheProps {
  paragraphe: Paragraphe;
  diffTime: number;
}
export const AfficheParagraphe: React.FC<AfficheParagrapheProps> = ({
  paragraphe,
  diffTime,
}) => {
  const {
    texte,
    titre,
    type,
    tempsDepart,
  } = paragraphe;
  const isIntention = useMemo(() => {
    return type === 'intention';
  }, [
    type,
  ])
  const _tempsDepart = useMemo(() => {
    return tempsDepart === undefined
      ? undefined
    : diffTime + tempsDepart;
  }, [
    tempsDepart,
    diffTime,
  ])
  if (!Array.isArray(texte)) {
    return <div
      className={isIntention ? 'paragraphe-intention' : 'paragraphe'}
    >
      {isIntention &&
        <TitreIntention />
      }
      <AfficheTexteUnique
        texte={texte}
        tempsDepart={_tempsDepart}
      />
    </div>;
  }
  return (<>
    {titre &&
      <AfficheTexteUnique
        texte={titre}
        isTitre
        tempsDepart={_tempsDepart}
      />
    }
    <div
      className={isIntention ? 'paragraphe-intention' : 'paragraphe'}
    >
      {isIntention &&
        <TitreIntention />
      }
      {texte.map((p, i) => <AfficheParagraphe
        key={`para-${i}`}
        paragraphe={p}
        diffTime={_tempsDepart !== undefined ? _tempsDepart : diffTime}
      />)}
    </div>
  </>
  );
};
