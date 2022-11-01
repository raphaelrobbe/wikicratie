import React from 'react';
import { PopupConfirmOptions } from '../../../common/types/popups';
import { BoutonNon } from '../buttons/boutonNon';
import { BoutonOui } from '../buttons/boutonOui';

export const PopupConfirm: React.FC<PopupConfirmOptions> = (
  {
    titre = '',
    actionSansFermerPopup = false,
    sousTitre = '',
    texte = '',
    actionSiOui,
    actionSiNon = () => { },
    classes = [],
    sansBoutonNon = false,
    children,
  },
) => {
  return (
    <div className={
      ['popup-confirm', 'popup-type1']
        .concat(classes)
        .join(' ')}
    >
      <div className={"contenu"}>
        {titre !== '' && <h1 className="titre">{titre}</h1>}
        {sousTitre !== '' && <h2 className="sous-titre">{sousTitre}</h2>}
        {texte != '' &&
          <div className="popup-texte">
            <p>{texte}</p>
          </div>
        }
        {children}
      </div>
      <div
        className={"boutons-oui-non"}
      >
        <BoutonNon
          action={actionSiNon}
          // actionSansFermerPopup={actionSansFermerPopup}
          seulementComportement={sansBoutonNon}
        />
        <BoutonOui
          action={actionSiOui}
          actionSansFermerPopup={actionSansFermerPopup}
          nom={sansBoutonNon ? `OK` : undefined}
        />
      </div>
    </div>
  );
};
