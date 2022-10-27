export type RegionName = `Auvergne-Rhône-Alpes` |
  `Hauts-de-France` |
  `Auvergne-Rhône-Alpes` |
  `Provence-Alpes-Côte d'Azur` |
  `Grand Est` |
  `Occitanie` |
  `Normandie` |
  `Bretagne` |
  `Bourgogne-Franche-Comté` |
  `Centre-Val de Loire` |
  `Pays de la Loire` |
  `Île-de-France` |
  `Corse` |
  `Martinique` |
  `Guyane` |
  `La Réunion` |
  `Mayotte` |
  `Guadeloupe` |
  `Nouvelle-Aquitaine`;

export interface Departement {
  numDep: string | number;
  depName: string;
  regionName: RegionName;
}
