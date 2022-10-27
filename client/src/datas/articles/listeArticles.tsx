import { Article } from "../../classes/classeArticle";
import { article1 } from "./article1";
import { article2 } from "./article2";
import { articleIntention } from "./intention";
import { articlePreambule } from "./preambule";

// export const CPT = new Article(
//   `Constitution Provisoire de Transition`
//   'sans',
// );
export const listeArticles: Article[] = [
  articleIntention,
  articlePreambule,
  article1,
  article2,
  // article3,
  // article4,
  // article5,
  // article6,
  // article7,
  // article8,
  // article9,
  // article10,
];
