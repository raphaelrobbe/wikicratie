export type NomModuleNiveau1 =
  | 'accueil'
  | 'articles'
  | 'FAQ'
  | 'lexique';

export interface PieceOfBreadCrumbsProps {
  label: string;
  chemin: string;
}
