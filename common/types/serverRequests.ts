export type NomRequete =
  // sans besoin token
  | 'connect'
  | 'activationCompte'
  | 'demandeReinitPassword'

  // avec token
  // connexion
  | 'autoConnect'
  | 'chargementDonnees'
  | 'disconnect'
  | 'reinitPassword'
  | 'modifPassword'

  | 'sendMail'

  // administration
  | 'getLogs'
  | 'genereLienActivationCompte'
  | 'createAccesUser'

  // gestion des fichiers
  | 'getListeFiles' // peut faire partie d'un chargement de données global
  | 'deleteFile'
  | 'uploadFile'
  | 'genererPdf' // xmlhttp.responseType = "arraybuffer"; -> traitement séparé
  | 'getFile'; // xmlhttp.responseType = "arraybuffer"; -> traitement séparé
  ;
