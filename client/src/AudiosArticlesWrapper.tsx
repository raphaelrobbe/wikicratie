import React, { useEffect } from "react"
import { AudioPlayer } from "./audio/AudioPlayer";
import { useArticlesContext } from "./contexts/ArticlesContext";

interface AudiosArticlesWrapperProps {
}
export const AudiosArticlesWrapper: React.FC<AudiosArticlesWrapperProps> = ({
}) => {
  const {
    articleEnCours,
    articlePrecedent,
    articleSuivant,
    toNextArticle,
    toPrevArticle,
    highlightedParagraphe,
  } = useArticlesContext();

  return (articleEnCours.audioElement
    ? <AudioPlayer
      highlightedParagraphe={highlightedParagraphe}
      articleEnCours={articleEnCours}
      articlePrecedent={articlePrecedent}
      articleSuivant={articleSuivant}
      // audioElementEnCours={articleEnCours.audioElement}
      toNext={(loop?: boolean) => toNextArticle({ play: true, loop })}
      toPrev={(loop?: boolean) => toPrevArticle({ play: true, loop })}
    />
    : null
  )
};