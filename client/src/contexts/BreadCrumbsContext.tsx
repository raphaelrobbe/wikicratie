import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { PieceOfBreadCrumbsProps } from '../../../common/types/structureUrls';


interface BreadCrumbsContextProps {
  breadCrumbs: PieceOfBreadCrumbsProps[];
  addPOBInBreadCrumbs: (pOB: PieceOfBreadCrumbsProps) => void;
  removePOBFromBreadCrumbs: (pOB: PieceOfBreadCrumbsProps) => void;
}
export const BreadCrumbsContext = createContext({} as BreadCrumbsContextProps);
BreadCrumbsContext.displayName = 'BreadCrumbsContext';

export const useBreadCrumbsContext = (): BreadCrumbsContextProps => useContext(BreadCrumbsContext)!;


export const BreadCrumbsContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [breadCrumbs, setBreadCrumbs] = useState<PieceOfBreadCrumbsProps[]>([]);

  const addPOBInBreadCrumbs = (pOB: PieceOfBreadCrumbsProps): void => {
    setBreadCrumbs(bC => {
      const _bC = [...bC];
      _bC.push(pOB);
      return _bC.sort((pC1, pC2) => {
        const diffNombreNiveaux = pC1.chemin.split('/').length - pC2.chemin.split('/').length;
        if (diffNombreNiveaux === 0) {
          if (pC1.chemin.slice(-5) === 'etude') {
            return -1;
          } else if (pC2.chemin.slice(-5) === 'etude') {
            return 1
          } else {
            return 0;
          }
        } else {
          return diffNombreNiveaux;
        }
      });
    })
  }
  const removePOBFromBreadCrumbs = (pOB: PieceOfBreadCrumbsProps): void => {
    const {
      label,
    } = pOB;
    setBreadCrumbs(bC => {
      const _bC = [...bC];
      const retBC = _bC.filter(pOB => pOB.label !== label);
      return retBC;
    })
  }


  return <BreadCrumbsContext.Provider value={{
    breadCrumbs, addPOBInBreadCrumbs, removePOBFromBreadCrumbs,
  }}>
    { children }
  </BreadCrumbsContext.Provider>
}
