export interface PopupOptions {
  titre?: string;
  sousTitre?: string;
  texte?: string;
  classes?: string[];
  actionSansFermerPopup?: boolean;
  children?: JSX.Element;
}
export interface PopupConfirmOptions extends PopupOptions {
  actionSiOui: () => void;
  actionSiNon?: () => void;
  sansBoutonNon?: boolean;
}
export interface PopupAlertOptions extends PopupOptions {
  fermerTousPopups?: boolean;
  myHandleClick?: () => void;
}
