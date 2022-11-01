import React, {
  createContext, PropsWithChildren, RefObject,
  useContext, useRef, useState,
} from 'react';
import { EcranChargementProps } from '../../../common/types/clientCommServer';
import { PopupAlertOptions, PopupConfirmOptions } from '../../../common/types/popups';
import { PopupAlert } from '../popups/PopupAlert';
import { PopupConfirm } from '../popups/PopupConfirm';

export type TypeInput = 'textArea' | 'text' | 'number';
export interface EtatSaisie {
  inInput: boolean;
  typeInput: TypeInput;
}

interface PopupContextProps {
  nbEcransChargement: number;
  setNbEcransChargement: React.Dispatch<React.SetStateAction<number>>;
  ecransChargement: EcranChargementProps[];
  setEcranChargement: (props: EcranChargementProps) => void;
  // setEcranChargement: React.Dispatch<React.SetStateAction<EcranChargementProps>>;
  popupsAffiches: JSX.Element[];
  affichePopup: (element: JSX.Element, simu?: boolean) => void;
  closePopup: (all?: boolean) => void;
  remplacePopup: (element: JSX.Element, dernierSeulement?: boolean) => void;
  confirmPopup: (options: PopupConfirmOptions) => void;
  alertPopup: (options: PopupAlertOptions) => void;
  refPopup: RefObject<HTMLDivElement>;
}
export const PopupContext = createContext({} as PopupContextProps);
PopupContext.displayName = 'PopupContext';

export const usePopupContext = (): PopupContextProps => useContext(PopupContext)!;

export const PopupContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [nbEcransChargement, setNbEcransChargement] = useState(0);
  const [ecransChargement, setEcransChargement] = useState<EcranChargementProps[]>([]);
  const [popupsAffiches, setPopupsAffiches] = useState<JSX.Element[]>([]);
  const refPopup = useRef<HTMLDivElement>(null);

  const closePopup = (all?: boolean): void => {
    // console.log('closePopup');
    // setTimeout(() => {
      if (all) {
        setPopupsAffiches(p => []);
      } else {
        setPopupsAffiches(p => {
          const _popupsAffiches = [...p];
          _popupsAffiches.pop();
          return _popupsAffiches;
        });
      }
    // }, 380);
  }

  const remplacePopup = (element: JSX.Element, dernierSeulement = false): void => {
    // setTimeout(() => {
      if (dernierSeulement) {
        setPopupsAffiches(p => {
          const _popupsAffiches = [...p];
          _popupsAffiches.pop();
          _popupsAffiches.push(element);
          return _popupsAffiches;
        });
    } else {
      setPopupsAffiches(p => [element]);
    }
    // }, 380);
  }

  const _setEcranChargement = (props: EcranChargementProps): void => {
    const {
      afficher,
      requestType,
      idEC,
    } = props;

    if (afficher) {
      // console.log(`ajout d'un écran : ${requestType} ${idEC}`);
      setNbEcransChargement(n => n + 1);
      setEcransChargement(eC => {
        const _eC = [...eC];
        _eC.push(props);
        return _eC;
      });
    } else {
      // console.log(`retrait d'un écran : ${requestType} ${idEC}`);
      setNbEcransChargement(n => n - 1);
      setEcransChargement(eC => {
        let _eC = [...eC];
        if (idEC) {
          _eC = [..._eC.filter(e => e.idEC !== idEC)];
        } else {
          _eC.pop();
        }
        return _eC;
      });
    }
  }

  // useEffect(() => {
  //   alert(`nombre de popups affichés : ${popupsAffiches.length}`)
  // }, [
  //   popupsAffiches.length,
  // ]);

  const affichePopup = (element: JSX.Element): void => {
    setPopupsAffiches(p => {
      const _popupsAffiches = [...p];
      _popupsAffiches.push(element);
      return _popupsAffiches;
    });
  }
  const confirmPopup = (options: PopupConfirmOptions): void => {
    // const children = options.children === undefined ? undefined : options.children;
    // delete options.children;
    affichePopup(<PopupConfirm
      {...options}
    />);
  }

  const alertPopup = (options: PopupAlertOptions): void => {
    affichePopup(<PopupAlert
      {...options}
    />);
  }


  return <PopupContext.Provider value={{
    nbEcransChargement, setNbEcransChargement,
    ecransChargement, setEcranChargement: _setEcranChargement,
    popupsAffiches, confirmPopup,
    refPopup,
    closePopup, remplacePopup,
    affichePopup,
    alertPopup,
  }}>
    { children }
  </PopupContext.Provider>
}
