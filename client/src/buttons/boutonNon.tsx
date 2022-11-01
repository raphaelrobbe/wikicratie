import React from 'react';

import { BoutonAction } from './boutonAction';

interface BoutonNonProps {
  action: () => void;
  actionSansFermerPopup?: boolean;
  classes?: string[];
  defaultEnter?: boolean;
  defaultEscape?: boolean;
  nom?: string;
  seulementComportement?: boolean;
}
export const BoutonNon: React.FC<BoutonNonProps> = ({
  action,
  actionSansFermerPopup = false,
  classes = ['bouton-non'],
  defaultEnter = false,
  defaultEscape = true,
  nom = 'Non',
  seulementComportement = false,
}) => {

  return (
    <BoutonAction
      action={action}
      actionSansFermerPopup={actionSansFermerPopup}
      classes={classes}
      defaultEnter={defaultEnter}
      defaultEscape={defaultEscape}
      nom={nom}
      seulementComportement={seulementComportement}
    />
  );
}
