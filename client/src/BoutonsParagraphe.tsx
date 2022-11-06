import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { BsPause, BsPlay } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { useArticlesContext } from './contexts/ArticlesContext';

interface BoutonsParagrapheProps {
  tempsDepart?: number;
}
export const BoutonsParagraphe: React.FC<BoutonsParagrapheProps> = ({
  tempsDepart,
}) => {
  const {
    articleEnCours,
  } = useArticlesContext();

  const handleClickListen = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (articleEnCours) {
      if (tempsDepart !== undefined) {
        articleEnCours.setAudioCurrentTime(tempsDepart)
      }
      articleEnCours.togglePlayPauseAudio();
    }
  }
  const handleClickEdit = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (articleEnCours) {
      // if (tempsDepart !== undefined) {
      //   articleEnCours.setAudioCurrentTime(tempsDepart)
      // }
      // articleEnCours.playAudio();
    }
  }

  const isPlaying = useMemo(() => {
    if (articleEnCours && articleEnCours.audioElement) {
      return !articleEnCours.audioElement.paused;
    } else {
      return false;
    }
  }, [
    articleEnCours,
  ])

  return (
    <div
      className={'boutons-pargraphe-overlay border rounded border-primary p-1'}
    >
      {articleEnCours && articleEnCours.audioElement &&
        <Button
          type="button"
          className="play-pause"
          onClick={handleClickListen}
          aria-label="Play"
        >
          {!articleEnCours.audioElement.paused ? <BsPlay /> : <BsPause />}
        </Button>
      }
      <Button
        type="button"
        className="edit ms-2"
        onClick={handleClickEdit}
        aria-label="Edit"
      >
        <FiEdit2 />
      </Button>
    </div>
  );
};
