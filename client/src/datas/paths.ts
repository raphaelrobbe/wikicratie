import { NomModuleNiveau1 } from "../../../common/types/structureUrls";
import { urlBaseWebsite } from "../utils/constants/project";

export const prefixeUrl = `/CPT`;

export const pathAccueil = `${prefixeUrl}`;
export const pathArticles = `${prefixeUrl}/articles`;
export const pathLexique = `${prefixeUrl}/lexique`;
export const pathFAQ = `${prefixeUrl}/FAQ`;
export const pathAudios = `${prefixeUrl}/audios`;

export const pathFilesAudios = `/audios`;

// export const pathRepertoireAudios = `./audios/`;
export const pathRepertoireAudios = `${urlBaseWebsite}/audios/`;
// export const pathRepertoireAudiosArticles = `./articles/`;
// export const pathRepertoireAudiosArticles = `${pathRepertoireAudios}articles/`;
export const pathRepertoireAudiosArticles = `${pathFilesAudios}/articles/`;



export const nomUrlArticles: NomModuleNiveau1 = 'articles';
export const nomUrlLexique: NomModuleNiveau1 = 'lexique';
export const nomUrlFAQ: NomModuleNiveau1 = 'FAQ';

export const sectionsAutorisees: NomModuleNiveau1[] = [
  nomUrlArticles,
  nomUrlLexique,
  nomUrlFAQ,
];

// CHEMINS POUR FICHIERS (=  chemins url, quand précédés de la version du simu)
// NIVEAU 1
// export const pathFileBaseClients = `/${nomUrlBaseClients}`;
// export const pathFileSuiviProjets = `/${nomUrlSuiviProjets}`;
// export const pathFileTableauProduction = `/${nomUrlTableauProduction}`;
// export const pathFileBasePartenaires = `/${nomUrlBasePartenaires}`;
// export const pathFileBaseProgrammes = `/${nomUrlBaseProgrammes}`;

// MOT DE PASSE (pas de fichiers)
export const pathReinitPassword = `${prefixeUrl}/reinitMdp`;
export const pathActivationCompte = `${prefixeUrl}/activationCompte`;
export const pathMailReinitEnvoye = `${prefixeUrl}/mailReinitEnvoye`;
export const pathMdpOublie = `${prefixeUrl}/oubliMdp`;

// LOGIN (pas de fichiers)
export const pathLogin = `${prefixeUrl}`;

// PARAMETRES (pas de fichiers)
export const pathParametres = `${prefixeUrl}/parametres`;

// DECONNEXION (pas de fichiers)
export const pathDeconnecter = `${prefixeUrl}/deconnecter`;

// OUTILS D'ADMINISTRATION (pas de fichiers)
export const pathAdministration = `${prefixeUrl}/administration`;
export const pathLogsServeur = `${pathAdministration}/logsServeur`;
