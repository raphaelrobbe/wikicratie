import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { ConnectedUser } from '../../../common/types/users';
import { disconnectInLS, getUserInLS } from '../utils/localStorage/localStorageUsers';
import { getNPUtilisateur } from '../utils/miseEnFormeNomPrenom';
import { isUserAdmin, isUserPublic, isUserUtilisateur, isUserVisiteur } from '../utils/roles';
import { DUREE_SECONDES_VALIDITE_TOKEN } from '../utils/constants/serverConstants';

interface ConnexionContextProps {
  useBaseLocale: boolean;
  // setUseBaseLocale: (useBaseLocale: boolean) => void;
  connectedUser: ConnectedUser;
  setConnectedUser: React.Dispatch<React.SetStateAction<ConnectedUser>>;

  type_user: number;
  isConnectedUserAdmin: boolean;

  isConnectedUserUtilisateur: boolean;

  isConnectedUserVisiteur: boolean;
  isConnectedUserPublic: boolean;

  dateIndexHtmlCharge: Date | null;
  setDateIndexHtmlCharge: React.Dispatch<React.SetStateAction<Date | null>>;
  dateIndexHtmlDisponible: Date | null;
  setDateIndexHtmlDisponible: React.Dispatch<React.SetStateAction<Date | null>>;

  affichageNP: string;

  reinitTimerJeton: () => void;
}
export const ConnexionContext = React.createContext({} as ConnexionContextProps);
ConnexionContext.displayName = 'ConnexionContext';

export const useConnexionContext = (): ConnexionContextProps => useContext(ConnexionContext)!;

export const ConnexionContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [reinitTimer, setReinitTimer] = useState(0);
  // const [useBaseLocale, setUseBaseLocale] = useState(false);
  const [connectedUser, setConnectedUser] = useState(getUserInLS());
  const [dateIndexHtmlCharge, setDateIndexHtmlCharge] = useState<Date | null>(null);
  const [dateIndexHtmlDisponible, setDateIndexHtmlDisponible] = useState<Date | null>(null);

  const {
    type_user,
  } = connectedUser;

  const isConnectedUserAdmin = useMemo(() => isUserAdmin(type_user), [type_user]);
  const isConnectedUserUtilisateur = useMemo(() => isUserUtilisateur(type_user), [type_user]);
  const isConnectedUserVisiteur = useMemo(() => isUserVisiteur(type_user), [type_user]);
  const isConnectedUserPublic = useMemo(() => isUserPublic(type_user), [type_user]);

  const useBaseLocale = useMemo(() => {
    return Boolean(
      window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );
    // return query.has(`useBaseLocale`);
  }, [window.location.hostname]);

  const {
    user,
  } = connectedUser;

  const affichageNP = useMemo(() => {
    if (user.id_user === -1) {
      return '';
    }
    return getNPUtilisateur(user, { avecCivilite: true });
  }, [
    user,
  ]);



  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setConnectedUser(cU => ({
          ...cU,
          token: '',
        }));
        disconnectInLS();
      },
      (DUREE_SECONDES_VALIDITE_TOKEN - 5) * 1000,
  );
    return () => clearTimeout(timeout);
  }, [
    reinitTimer,
  ])

  const reinitTimerJeton = () => {
    setReinitTimer(n => n + 1);
  }

  return <ConnexionContext.Provider value={{
    useBaseLocale,
    // setUseBaseLocale,
    connectedUser, setConnectedUser,
    type_user,

    isConnectedUserAdmin,
    isConnectedUserUtilisateur,
    isConnectedUserVisiteur,
    isConnectedUserPublic,

    affichageNP,
    dateIndexHtmlCharge, setDateIndexHtmlCharge,
    dateIndexHtmlDisponible, setDateIndexHtmlDisponible,

    reinitTimerJeton,
  }}>
    { children }
  </ConnexionContext.Provider>
}
