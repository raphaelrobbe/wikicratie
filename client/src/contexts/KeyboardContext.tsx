import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { HandleCtrl } from '../keyboard/handleCtrl';

interface KeyboardContextProps {
  shiftPressed: boolean;
  setShiftPressed: (shiftPressed: boolean) => void;
  ctrlPressed: boolean;
  setCtrlPressed: (shiftPressed: boolean) => void;
  enterDown: boolean;
  setEnterDown: (enterDown: boolean) => void;
  escapeDown: boolean;
  setEscapeDown: (escapeDown: boolean) => void;

  inhibeSetCtrlPressed: boolean;
  setInhibeSetCtrlPressed: React.Dispatch<React.SetStateAction<boolean>>;
  inhibeNavigationClavier: boolean;
  setInhibeNavigationClavier: React.Dispatch<React.SetStateAction<boolean>>;
  inhibeHandlerEnter: boolean;
  setInhibeHandlerEnter: React.Dispatch<React.SetStateAction<boolean>>;
  inhibeHandlerShift: boolean;
  setInhibeHandlerShift: React.Dispatch<React.SetStateAction<boolean>>;
}
export const KeyboardContext = createContext({} as KeyboardContextProps);
KeyboardContext.displayName = 'KeyboardContext';

export const useKeyboardContext = (): KeyboardContextProps => useContext(KeyboardContext)!;


export const KeyboardContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [shiftPressed, setShiftPressed] = useState(false);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [enterDown, setEnterDown] = useState(false);
  const [escapeDown, setEscapeDown] = useState(false);

  const [inhibeHandlerEnter, setInhibeHandlerEnter] = useState(false);
  const [inhibeHandlerShift, setInhibeHandlerShift] = useState(false);
  const [inhibeNavigationClavier, setInhibeNavigationClavier] = useState(false);
  const [inhibeSetCtrlPressed, setInhibeSetCtrlPressed] = useState(false);

  return <KeyboardContext.Provider value={{
    shiftPressed, setShiftPressed,
    ctrlPressed, setCtrlPressed,
    enterDown, setEnterDown,
    escapeDown, setEscapeDown,

    inhibeHandlerEnter, setInhibeHandlerEnter,
    inhibeHandlerShift, setInhibeHandlerShift,
    inhibeNavigationClavier, setInhibeNavigationClavier,
    inhibeSetCtrlPressed, setInhibeSetCtrlPressed,
  }}>
    {!inhibeSetCtrlPressed && <HandleCtrl
      setCtrlPressed={setCtrlPressed}
    />}
    {children}
  </KeyboardContext.Provider>
}
