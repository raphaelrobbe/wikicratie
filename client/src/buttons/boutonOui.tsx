import React from 'react';

import { BoutonAction } from './boutonAction';

interface BoutonOuiProps {
  action?: () => void;
  actionSansFermerPopup?: boolean;
  classes?: string[];
  classesButton?: string[];
  defaultEnter?: boolean;
  defaultEscape?: boolean;
  nom?: string;
}
export const BoutonOui: React.FC<BoutonOuiProps> = ({
  action = () => {},
  actionSansFermerPopup = false,
  classes = ['bouton-oui'],
  classesButton = ['fond-bleu'],
  defaultEnter = true,
  defaultEscape = false,
  nom = 'Oui',
}) => {

  return (
    <BoutonAction
      action={action}
      actionSansFermerPopup={actionSansFermerPopup}
      classes={classes}
      classesButton={classesButton}
      defaultEnter={defaultEnter}
      defaultEscape={defaultEscape}
      nom={nom}
    />
  );
}
