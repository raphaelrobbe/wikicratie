import React from 'react';
import { PopupAlertOptions } from '../../../common/types/popups';

export const PopupAlert: React.FC<PopupAlertOptions> = ({
  titre = '',
  sousTitre = '',
  myHandleClick,
  texte = '',
  classes = [],
  fermerTousPopups = false,
  children,
}) => {
  return (
    <div className={
      ['popup-alert', 'popup-type1']
        .concat(classes)
        .join(' ')}
    >
      <div className="boutons-popup">
        <div>
          {/* BoutonClose affiché car il capte l'appui sur echap ou le clic à côté */}
          {/* <BoutonClose
            fermeTous={fermerTousPopups}
            // sansSaisie={sansSaisie}
            tabIndex={0}
            myHandleClick={myHandleClick}
          // autoFocus
          /> */}
        </div>
      </div>
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
    </div>
  );
};
