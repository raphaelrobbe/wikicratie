/* eslint max-len: 0 */
import { pathRepertoireAudiosArticles } from "../paths";
import { Article } from "../../classes/classeArticle";
import { Paragraphe } from "../../../../common/types/typesArticles";

const article1Intention: Paragraphe = {
  texte: `Formaliser ce qui caractérise la France que nous voulons définir`,
  tempsDepart: 0,
  dateDerniereModif: new Date(2020, 4, 30),
  type: 'intention',
};
const article1Para1: Paragraphe = {
  texte: `La France, en transition démocratique, est un État laïque, et social. Sa capitale est Paris. Il assure l'égalité devant la loi de tous les citoyens français sans distinction de sexe, d'origine, de région, de domicile, d’ethnie, de religion, ou de préférences sexuelles. Elle respecte toutes les croyances dès lors que cellesci respectent chacun, qu’elles ne discriminent pas les citoyens français entre eux et n’attentent aux droits fondamentaux de personne.`,
  tempsDepart: 5.5,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article1Para2: Paragraphe = {
  texte: `Pour concrétiser la séparation des pouvoirs, une partie de l’organisation de la France est délocalisée en province.`,
  tempsDepart: 33.8,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article1Para3: Paragraphe = {
  texte: `Sauf décision contraire du parlement ou votée par le RIC, la localisation de certains pouvoirs de l’État (parlementaire, exécutant, monétaire, et constituant) reste nationale et localisée dans la capitale Paris pour des raisons pratiques. Les autres pouvoirs (judiciaires, médiatiques et éducatifs), n’ont pas de raisons logistiques d’être localisés dans la même métropole. Toute métropole régionale avec des locaux en capacité de les accueillir peut faire l’affaire. Le pouvoir judiciaire peut déléguer ce choix au pouvoir exécutant. Leur localisation géographique pourra être modifiée, et même être nomade si le pouvoir Parlementaire ou un RIC le décide.`,
  tempsDepart: 41.5,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article1Para4: Paragraphe = {
  texte: `Toute personne née sur le territoire national ou dont l'un des deux parents est citoyen français acquiert de plein droit la nationalité française. A sa majorité, son inscription sur les registres de citoyenneté lui permet d’accéder à l’exercice des droits et devoirs civiques. Est également citoyen français tout individu résidant en France et devenant majeur, après y avoir vécu pendant plus de 10 ans, s’il s’inscrit dans l’année de sa majorité sur ce registre de citoyenneté en acceptant les devoirs légaux qui ouvrent des droits également définis par la loi.`,
  tempsDepart: 20,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article1Para5: Paragraphe = {
  texte: `Les droits et devoirs spécifiques à l’exercice de la citoyenneté sont le droit de vote et des devoirs en cas de tirage au sort pour des missions d’intérêt général.`,
  tempsDepart: 30,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article1Para6: Paragraphe = {
  texte: `La loi favorise l'égal accès des citoyens aux votes et responsabilités citoyennes.`,
  tempsDepart: 40,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article1Para7: Paragraphe = {
  texte: `Ces droits et devoirs constituent le contrat social. Ils comportent la soumission à la Constitution mais ouvrent le droit de la critiquer, pour la faire évoluer par le débat argumenté et le référendum.`,
  tempsDepart: 50,
  dateDerniereModif: new Date(2020, 4, 30),
};
const article1Para8: Paragraphe = {
  texte: `Les ressortissants étrangers maîtrisant le français parlé lu et écrit, et résidant en France depuis plus de 5 ans sont éligibles à devenir français à leur demande après instruction de leur dossier, audition et décision par une commission de 21 citoyens français tirés au sort qui examinera leur demande. Les critères d’admission sont fixés par la loi. Cette commission doit rendre des avis motivés et peut imposer une période d’essai qui ne saurait excéder deux ans, si elle définit clairement des critères d’obtention de la nationalité. En cas de refus un appel est possible. Ensuite, un délai de 5 ans doit être observé avant toute nouvelle demande.`,
  tempsDepart: 60,
  dateDerniereModif: new Date(2020, 4, 30),
};

export const article1 = new Article(
  `Article 1`,
  '1',
  [
    article1Intention,
    article1Para1,
    article1Para2,
    article1Para3,
    article1Para4,
    article1Para5,
    article1Para6,
    article1Para7,
    article1Para8,
  ],
  0,
  null,
  `${pathRepertoireAudiosArticles}CPT_03Article1.mp3`,
  null,
  `La France et la citoyenneté`,
);
