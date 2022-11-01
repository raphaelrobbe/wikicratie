import React, { PropsWithChildren, useEffect } from 'react';
import { useKeyboardContext } from '../contexts/KeyboardContext';
import { usePopupContext } from '../contexts/PopupContext';

interface BoutonActionProps extends PropsWithChildren {
  action: () => void;
  nom: string | JSX.Element;
  defaultEnter?: boolean;
  defaultEscape?: boolean;
  actionSansFermerPopup?: boolean;
  classes?: string[];
  classesButton?: string[];
  disabled?: boolean;
  titleNotDisabled?: string;
  titleDisabled?: string;
  stopPropagation?: boolean;
  seulementComportement?: boolean;
}
export const BoutonAction: React.FC<BoutonActionProps> = ({
  action,
  actionSansFermerPopup = false,
  classes = [],
  classesButton = ['fond-bleu'],
  defaultEnter = false,
  defaultEscape = false,
  nom,
  disabled = false,
  titleNotDisabled = '',
  titleDisabled = titleNotDisabled,
  stopPropagation = false,
  seulementComportement = false,
  children,
}) => {
  const { closePopup } = usePopupContext();
  const {
    enterDown, setEnterDown,
    escapeDown, setEscapeDown,
  } = useKeyboardContext();

  // const handleClick = (e: React.MouseEvent): void => {
  const handleClick = (e?: React.MouseEvent): void => {
    if (e !== undefined && stopPropagation) {
      e.stopPropagation();
    }
    action();
    if (!actionSansFermerPopup) {
      closePopup();
    }
  }

  useEffect(() => {
    if (enterDown && defaultEnter) {
      handleClick();
    }
    setEnterDown(false);
  }, [
    enterDown,
    setEnterDown,
    defaultEnter,
  ]);

  useEffect(() => {
    if (escapeDown && defaultEscape) {
      handleClick();
    }
    setEscapeDown(false);
  }, [
    escapeDown,
    setEscapeDown,
    defaultEscape,
  ]);

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (
      event.key === 'Escape'
      // && nbSelectsDeroules === 0
    ) {
      event.preventDefault();
      event.stopPropagation();
      setEscapeDown(true);
    }
    if (
      event.key === 'Enter'
      // && nbSelectsDeroules === 0
    ) {
      event.preventDefault();
      event.stopPropagation();
      setEnterDown(true);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  if (seulementComportement) {
    return <></>;
  }
  return (
    <div className={['bouton-action'].concat(classes).join(' ')}>
      <button
        className={classesButton.join(' ')}
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={disabled ? titleDisabled : titleNotDisabled}
      >
        {typeof nom === 'string'
          ? <span>{nom}</span>
          : nom
        }
        {children}
      </button>
    </div>
  );
}
