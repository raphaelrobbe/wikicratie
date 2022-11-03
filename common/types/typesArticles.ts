import { numerosArticles, numerosArticlesOld } from "../../client/src/datas/numerosArticles";

export interface ParagrapheServeur {
  id_paragraphe: number;
  texte: string | ParagrapheServeur[];
  tempsDepart?: number;
  dateDerniereModif: Date;
  titre?: string,
  type?: 'intention' | 'note'; // udnefied = normal
}
export interface Paragraphe {
  id_paragraphe: number;
  texte: string | JSX.Element | Paragraphe[];
  tempsDepart?: number;
  dateDerniereModif: Date;
  titre?: string,
  type?: 'intention' | 'note'; // udnefied = normal
}

export type NumeroArticle = typeof numerosArticles[number];
export type NumeroArticleOld = typeof numerosArticlesOld[number];

// export interface Article {
//   numero: NumeroArticle;
//   titre: string;
//   description: string;
//   imagePath: string | null;
//   audioPath: string | null;
//   audioElement: HTMLAudioElement | null;
//   pdfPath: string | null;
//   sousArticles: Article[];
//   texte: Paragraphe[];
// }

// export interface AudioFilePlayer {
//   title: string;
//   artist?: string;
//   description?: string;
//   imagePath?: string;
//   audioPath: string;
//   color?: string;
// };
