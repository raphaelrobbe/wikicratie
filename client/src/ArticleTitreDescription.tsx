import React from 'react';
import { Article } from './classes/classeArticle';

interface ArticleTitreDescriptionProps {
  article: Article;
}
export const ArticleTitreDescription: React.FC<ArticleTitreDescriptionProps> = ({
  article,
}) => {
  const {
    titre,
    description,
  } = article;
  return (
    <div className="titre-description-article">
      <div className="titre">
        {titre}
      </div>
      {description &&
        <div
          className="description"
        >
          {description}
        </div>
      }
    </div>
  );
};
