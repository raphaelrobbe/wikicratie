import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '../hooks/navigation';

interface PdfContextProps {
  pdfGeneration: boolean;
}
export const PdfContext = React.createContext({} as PdfContextProps);
PdfContext.displayName = 'PdfContext';

export const usePdfContext = (): PdfContextProps => useContext(PdfContext)!;


export const PdfContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const location = useLocation();
  const query = useQuery();
  const navigate = useNavigate();

  const pdfGeneration = useMemo(() => {
    return query.has(`pdf`);
  }, [query]);

  /**
   * Passage en mode pdf par appui sur la touche F4
   */
   useEffect(() => {
    const togglePdf = (forceTo?: boolean): void => {
      console.log(`useEffect toggle mode pdf`);
      const wasPdf = query.has('pdf');
      if (wasPdf) {
        if (forceTo !== undefined && forceTo) {
          return;
        }
        query.delete('pdf');
      } else {
        if (forceTo !== undefined && !forceTo) {
          return;
        }
        query.append('pdf', '');
      }
      const queryString = query.toString().replace(/=(?=&|$)/g, '');
      const urlString = `${location.pathname}${queryString.length === 0 ? '' : `?${queryString}`}`;
      navigate(urlString, { replace: true });
    }
    const unsetPdf = () => togglePdf(false);
    const setPdf = () => togglePdf(true);
    const handleKeyDown = (event: KeyboardEvent): void => {
      event.stopPropagation();
      if (event.code === 'F4') {
        togglePdf();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeprint', setPdf);
    window.addEventListener('afterprint', unsetPdf);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeprint', setPdf);
      window.removeEventListener('afterprint', unsetPdf);
    };
  }, [
    query,
    location,
    navigate,
  ]);

  useEffect(() => {
    if (pdfGeneration) {
      document.getElementsByTagName('html')[0].classList.remove('screen-mode');
      document.getElementsByTagName('html')[0].classList.add('pdf-mode');
    } else {
      document.getElementsByTagName('html')[0].classList.remove('pdf-mode');
      document.getElementsByTagName('html')[0].classList.add('screen-mode');
    }
  }, [
    pdfGeneration,
  ])

  return <PdfContext.Provider value={{
    pdfGeneration,
}}>
    { children }
  </PdfContext.Provider>
}
