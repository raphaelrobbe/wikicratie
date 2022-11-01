export interface MessageChargement {
  [x: string]: string;
}

export type RequeteCallbackFunction = (ret: any, argsCallback?: any) => void;

export interface EcranChargementProps {
  afficher: boolean;
  message?: string;
  requestType?: string;
  // pour définir classe pour affichage sur une partie de l'écran seulement
  codeAffichagePartiel?: string;
  type: 'normal' | 'pdfLoading';
  idEC?: string;
}
