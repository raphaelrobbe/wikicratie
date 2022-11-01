import { ConnectedUser } from '../../../../common/types/users';
import { siteLSDefault } from '../../defaultObjects/localStorage';
import { connectedUserDefault } from '../../defaultObjects/users';
import { nomProjet } from '../constants/project';
import { NO_SUCH_USER } from '../constants/serverConstants';
import * as LS from './localStorage';

export const getUserInLS = (): ConnectedUser => {
  const siteLS = LS.getSiteLocalStorage(nomProjet);
  if (
    siteLS
    && siteLS.connectedUser
  ) {
    // if (typeof vaerdi.connectedUser.conseiller.societe !== 'string') {
      return siteLS.connectedUser;
    // }
  }
  return connectedUserDefault;
}

export const getTokenInLS = (): string => {
  const userLS = getUserInLS();
  if (userLS.token) {
    return userLS.token;
  }
  return NO_SUCH_USER;
}

export const setConnectedUserInLS = (connectedUser: ConnectedUser): void => {
  const siteLS = LS.getSiteLocalStorage(nomProjet);
  if (siteLS) {
    LS.setSiteLocalStorage({
      ...siteLS,
      connectedUser,
    },
      nomProjet,
    );
  } else {
    LS.setSiteLocalStorage({
      ...siteLSDefault,
      connectedUser,
    },
      nomProjet,
    );
  }
}


export const setNewTokenInLS = (token: string): void => {
  let siteLS = LS.getSiteLocalStorage(nomProjet);
  if (!(siteLS && siteLS.connectedUser)) {
  // if (!(vaerdi && vaerdi.connectedUser && vaerdi.connectedUser.token)) {
    siteLS = { ...siteLSDefault };
  }
  siteLS.connectedUser.token = token;
  LS.setSiteLocalStorage({ ...siteLS }, nomProjet);
}

export const disconnectInLS = (): void => {
  const userLS = getUserInLS();
  setConnectedUserInLS({
    ...userLS,
    token: '',
  });
  return;
}

export const openConnectedTabInLS = (): void => {
  const siteLS = LS.getSiteLocalStorage(nomProjet);
  if (siteLS) {
    const {
      nbOpenedConnectedTabs = 0,
    } = siteLS;
    LS.setSiteLocalStorage({
      ...siteLS,
      nbOpenedConnectedTabs: nbOpenedConnectedTabs + 1,
    },
      nomProjet,
    );
  }
  return;
}
export const closeConnectedTabInLS = (): void => {
  const siteLS = LS.getSiteLocalStorage(nomProjet);
  if (siteLS) {
    const {
      nbOpenedConnectedTabs = 0,
    } = siteLS;
    const newNbOpenedConnectedTabs = Math.max(0, nbOpenedConnectedTabs - 1);
    LS.setSiteLocalStorage({
      ...siteLS,
      nbOpenedConnectedTabs: newNbOpenedConnectedTabs,
    },
      nomProjet,
    );
    if (newNbOpenedConnectedTabs === 0) {
      disconnectInLS();
    }
  }
  return;
}
