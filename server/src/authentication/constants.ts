export const STRING_PREFIXE_JETON = `alezr!.32nap`;

// Durée de non renouvellement du token = 10% de sa durée de validité totale
// exemple : si validité du jeton = 30 minutes, toutes les requêtes faites dans les 3 premières minutes après le renouvellement
// ne donneront pas lieu à un renouvellement
// but : ne pas renouveler sans arrêt à chaque requête
// mais si utilisation intensive, un renouvellement toutes les 3 minutes max
// export const DUREE_SECONDES_VALIDITE_TOKEN = 60 * 60 * 24; // un jour
export const NB_TENTATIVES_MAX_LOGIN = 4;
export const DUREE_SECONDES_VALIDITE_JETON_MODIF_MDP = 60 * 60;
export const DUREE_SECONDES_VALIDITE_JETON_ACTIVATION_COMPTE = 24 * 60 * 60;
