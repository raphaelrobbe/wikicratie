import React, {
  PropsWithChildren, useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Article } from '../classes/classeArticle';
import { listeArticles } from '../datas/articles/listeArticles';

interface ArticlesContextProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  articlePrecedent: Article | null;
  articleEnCours: Article | null;
  articleSuivant: Article | null;
  indexArticleEnCours: number;
  // setIndexArticleEnCours: React.Dispatch<React.SetStateAction<number>>;
  toNextArticle: (props: { play?: boolean, loop?: boolean }) => void;
  toPrevArticle: (props: { play?: boolean, loop?: boolean }) => void;
  directToArticle: (props: { index: number, play?: boolean, loop?: boolean }) => void;
  highlightedParagraphe: Article | null;
  setHighlightedParagraphe: React.Dispatch<React.SetStateAction<Article | null>>;
}

export const ArticlesContext = React.createContext({} as ArticlesContextProps);
ArticlesContext.displayName = 'ArticlesContext';

export const useArticlesContext = (): ArticlesContextProps => useContext(ArticlesContext)!;


export const ArticlesContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [playAuto, setPlayAuto] = useState(false);
  const [indexArticleEnCours, setIndexArticleEnCours] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  // const [articles, setArticles] = useState([...listeArticles]);
  const [highlightedParagraphe, setHighlightedParagraphe] = useState<Article | null>(null);

  const articleEnCours = useMemo((): Article | null => {
    if (articles.length > 0) {
      const _art = articles[indexArticleEnCours];
      _art.getAndSetAudioElementIfDontExist();
      return _art;
    } else {
      return null;
    }
  }, [
    indexArticleEnCours,
    articles,
  ]);

  useEffect(() => {
    if (playAuto && articleEnCours) {
      articleEnCours.playAudio();
    }
  }, [
    playAuto,
    articleEnCours,
  ]);

  const articleSuivant = useMemo((): Article | null => {
    if (indexArticleEnCours + 1 < articles.length) {
      const _art = articles[indexArticleEnCours + 1];
      _art.getAndSetAudioElementIfDontExist();
      return _art;
    } else {
      return null;
    }
  }, [
    indexArticleEnCours,
    articles,
  ]);

  const articlePrecedent = useMemo((): Article | null => {
    if (indexArticleEnCours > 0) {
      const _art = articles[indexArticleEnCours - 1];
      _art.getAndSetAudioElementIfDontExist();
      return _art;
    } else {
      return null;
    }
  }, [
    indexArticleEnCours,
    articles,
  ]);

  const getNextIndex = useCallback((i: number, loop = false) => {
    if (i + 1 < articles.length) {
      return i + 1;
    } else {
      return loop ? 0 : articles.length - 1;
    }
  }, [
    articles.length,
  ]);

  const getPrevIndex = useCallback((i: number, loop = false) => {
    if (i > 0) {
      return i - 1;
    } else {
      return loop ? articles.length - 1 : 0;
    }
  }, [
    articles.length,
  ]);

  const toNextArticle = useCallback((props: { play?: boolean, loop?: boolean }) => {
    const {
      play = false,
      loop = false,
    } = props;
    if (articleEnCours) {
      articleEnCours.pauseAndRembobine();
    }
    // setPlayAuto(play);
    setIndexArticleEnCours(i => getNextIndex(i, loop));
  }, [
    getNextIndex,
    articleEnCours,
  ]);

  const toPrevArticle = useCallback((props: { play?: boolean, loop?: boolean }) => {
    const {
      play = false,
      loop = false,
    } = props;
    // setPlayAuto(play);
    if (articleEnCours) {
      articleEnCours.pauseAndRembobine();
    }
    setIndexArticleEnCours(i => getPrevIndex(i, loop));
  }, [
    getPrevIndex,
    articleEnCours,
  ]);

  const directToArticle = useCallback((props: { index: number, play?: boolean }) => {
    const {
      index,
      play = false,
    } = props;
    // setPlayAuto(play);
    if (articleEnCours) {
      articleEnCours.pauseAndRembobine();
    }
    if (index >= 0 && index < articles.length) {
      setIndexArticleEnCours(i => index);
    }
  }, [
    articleEnCours,
    articles.length,
  ]);

  return <ArticlesContext.Provider value={{
    indexArticleEnCours,
    articles, setArticles,
    articleEnCours,
    articlePrecedent,
    articleSuivant,
    toNextArticle,
    toPrevArticle,
    directToArticle,
    highlightedParagraphe, setHighlightedParagraphe,
  }}>
    {children}
  </ArticlesContext.Provider>
}
