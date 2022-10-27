// import React, { useEffect, useMemo, useState } from "react";
// import { Article } from "../classes/classeArticle";
// import { useArticlesContext } from "../contexts/ArticlesContext";

// interface ArticleTexteAlineaAtomiqueProps {
//   niveau: number;
//   // texte: string | JSX.Element;
//   // highlighted: boolean;
//   article: Article;
//   handleClick: () => void;
//   pereHighlighted: boolean;
// }

// export const ArticleTexteAlineaAtomique: React.FC<ArticleTexteAlineaAtomiqueProps> = ({
//   niveau,
//   article,
//   handleClick,
//   pereHighlighted,
// }) => {
//   const [enroule, setEnroule] = useState(true);
//   const {
//     texte,
//     highlighted,
//     titre,
//     description,
//   } = article;
//   const {
//     setHighlightedParagraphe,
//   } = useArticlesContext();

//   useEffect(() => {
//     if (highlighted && pereHighlighted) {
//       setHighlightedParagraphe(p => article);
//       setEnroule(false);
//     } else {
//       setEnroule(true);
//     }
    
//     return () => {
//       setHighlightedParagraphe(p => null);
//     }
//   }, [
//     pereHighlighted,
//     highlighted,
//     article,
//     setHighlightedParagraphe,
//   ])

//   if (Array.isArray(texte)) {
//     return null;
//   } else {
//     return <div
//       className={[
//         'alinea-atomique',
//         `niveau${niveau}`,
//       ]
//         .concat(enroule ? 'enroule' : [])
//         // .concat(enroule && placeholder ? 'placeholder-affiche' : [])
//         .concat(highlighted ? 'highlighted' : [])
//         .join(' ')}
//       onClick={handleClick}
//     >
//       {true &&
//       // {!enroule &&
//         <div
//           className="texte-paragraphe"
//         >        
//           {texte}
//         </div>
//       }
//     </div>
//   }
// };
