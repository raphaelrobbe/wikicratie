import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { NomModuleNiveau1 } from '../../../common/types/structureUrls';


interface GlobalContextProps {
  // rechargeFiles: boolean;
  // setRechargeFiles: React.Dispatch<React.SetStateAction<boolean>>;

  notChanged: boolean;
  setNotChanged: React.Dispatch<React.SetStateAction<boolean>>;

  autoConnectFini: boolean;
  setAutoConnectFini: React.Dispatch<React.SetStateAction<boolean>>;

  publicDataLoadingFini: boolean;
  setPublicDataLoadingFini: React.Dispatch<React.SetStateAction<boolean>>;

  baseActive: NomModuleNiveau1;
  setBaseActive: React.Dispatch<React.SetStateAction<NomModuleNiveau1>>;
}
export const GlobalContext = createContext({} as GlobalContextProps);
GlobalContext.displayName = 'GlobalContext';

export const useGlobalContext = (): GlobalContextProps => useContext(GlobalContext)!;


export const GlobalContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [baseActive, setBaseActive] = useState<NomModuleNiveau1>('accueil');
  // const [rechargeFiles, setRechargeFiles] = useState(false);
  const [notChanged, setNotChanged] = useState(true);
  const [autoConnectFini, setAutoConnectFini] = useState(false);
  const [publicDataLoadingFini, setPublicDataLoadingFini] = useState(false);

  return <GlobalContext.Provider value={{
    baseActive, setBaseActive,
    // rechargeFiles, setRechargeFiles,
    notChanged, setNotChanged,
    publicDataLoadingFini, setPublicDataLoadingFini,
    autoConnectFini, setAutoConnectFini,
  }}>
    { children }
  </GlobalContext.Provider>
}
