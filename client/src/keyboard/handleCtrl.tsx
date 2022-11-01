import React, { useEffect } from 'react';

interface HandleCtrlProps {
  setCtrlPressed: React.Dispatch<React.SetStateAction<boolean>>;
}
export const HandleCtrl: React.FC<HandleCtrlProps> = ({
  setCtrlPressed,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.code === "ControlLeft" || event.code === "ControlRight") {
        setCtrlPressed(true);
      }
    }
    const handleKeyUp = (event: KeyboardEvent): void => {
      if (event.code === "ControlLeft" || event.code === "ControlRight") {
        setCtrlPressed(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setCtrlPressed]);

  return <React.Fragment />;
}
