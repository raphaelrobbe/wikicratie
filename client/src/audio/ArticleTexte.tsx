// import React, { useEffect, useMemo } from "react";
// import { Accordion } from "react-bootstrap";
// import { Article } from "../classes/classeArticle";
// import { ArticleTexteAlineaAtomique } from "./ArticleTexteAlineaAtomique";


// // type ParagrapheAffichage = Paragraphe & { highlighted?: boolean };
// interface ArticleTexteProps {
//   article: Article;
//   currentTime: number;
//   afficherTout?: boolean;
//   pereHighlighted: boolean;
//   diffDepartTime?: number;
//   niveau?: number;
//   setAudioCurrentTime: (t: number) => void;
//   highlightMyself: () => void;
// }

// export const ArticleTexte: React.FC<ArticleTexteProps> = ({
//   article,
//   currentTime,
//   pereHighlighted,
//   afficherTout = false,
//   diffDepartTime = 0,
//   niveau = 1,
//   setAudioCurrentTime,
//   highlightMyself,
// }) => {
//   const {
//     paragraphes,
//     highlighted,
//     tempsDepart,
//     titre,
//     description,
//   } = article;

//   const tempsDepartAbsolu = useMemo(() => {
//     return diffDepartTime + tempsDepart;
//   }, [
//     tempsDepart,
//     diffDepartTime,
//   ])

//   useEffect(() => {
//     if (Array.isArray(paragraphes.texte)) {
//       let i = texte.length - 1;
//       let jobDone = false;
//       while (i >= 0 && !jobDone) {
//         const para = texte[i];
//         const {
//           tempsDepart,
//         } = para;
//         const tempsDepartAbsoluPara = tempsDepart + tempsDepartAbsolu;
//         console.log(`tempsDepartAbsolu = ${tempsDepartAbsoluPara}, currentTime = ${currentTime}`);
      
//         if (currentTime >= tempsDepartAbsoluPara) {
//           console.log(`hightlight para n° ${i}`);
//           jobDone = true;
//           article.in(i);
//         }
//         i -= 1;
//       }
//     }
//   }, [
//     tempsDepartAbsolu,
//     texte,
//     article,
//     currentTime,
//   ])

//   const placeholder = useMemo(() => {
//     if (titre) {
//       return titre;
//     } else if (description) {
//       return description;
//     } else {
//       return '...';
//     }
//   }, [
//     description,
//     titre,
//   ])

//   return <Accordion
//     className={([] as string[])
//       .concat(Array.isArray(texte) ? [] : 'dernier-niveau')
//       .concat(highlighted ? 'highlighted' : [])
//       .join(' ')
//     }
//     // defaultActiveKey="0"
//   >
//     <Accordion.Item eventKey={"1"}>
//       <Accordion.Header>{placeholder}</Accordion.Header>
//       <Accordion.Body>
//         {!Array.isArray(texte)
//           ? ((true || afficherTout || highlighted)
//             ? <ArticleTexteAlineaAtomique
//               niveau={niveau}
//               article={article}
//               handleClick={() => {
//                 setAudioCurrentTime(tempsDepartAbsolu);
//                 highlightMyself();
//               }}
//               pereHighlighted={pereHighlighted}
//             />
//             : null
//           )
//           : <div
//             className={`article niveau${niveau}`}
//           >
//             {texte.map((para, i) => {
//               const {
//                 highlighted,
//               } = para;
//               if (true || afficherTout || highlighted) {
//                 return <ArticleTexte
//                   key={`para-${i}`}
//                   article={para}
//                   currentTime={currentTime}
//                   afficherTout
//                   diffDepartTime={tempsDepartAbsolu}
//                   niveau={niveau + 1}
//                   setAudioCurrentTime={setAudioCurrentTime}
//                   highlightMyself={() => article.indexSelectedPara = i}
//                   pereHighlighted={article.highlighted}
//                 />
//               } else {
//                 return null;
//               }
//             })}
//           </div>
//         }
//       </Accordion.Body>
//     </Accordion.Item>
//   </Accordion>
// };
