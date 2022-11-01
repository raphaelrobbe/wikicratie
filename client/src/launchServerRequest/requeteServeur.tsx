import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { EcranChargementProps, RequeteCallbackFunction } from '../../../common/types/clientCommServer';
import { DataJsonRequest } from '../../../common/types/serverRequests';
import { useConnexionContext } from '../contexts/ConnexionContext';
import { usePopupContext } from '../contexts/PopupContext';
import { ACLsDetaillees } from '../utils/aCLs';
import { disconnectInLS } from '../utils/localStorage/localStorageUsers';
import { sendEncryptedJson } from '../utils/security/sendEncryptedJson';
import { getUniqueId } from '../utils/utilRandom';
import { loadingMessages } from './loadingMessages';

interface RequeteServeurProps extends PropsWithChildren {
  data: DataJsonRequest;
  apiPath?: string;
  successCallback?: RequeteCallbackFunction;
  failureCallback?: RequeteCallbackFunction;
  argsFailureCallback?: any;
  argsSuccessCallback?: any;
  dontCloseEcranChargement?: boolean;
  avecEcranChargement?: boolean;
  codeAffichagePartiel?: string;
}
const RequeteServeur: React.FC<RequeteServeurProps> = ({
  children,
  data,
  apiPath = '/api',
  successCallback,
  failureCallback,
  argsFailureCallback,
  argsSuccessCallback,
  dontCloseEcranChargement = false,
  avecEcranChargement = true,
  codeAffichagePartiel,
}) => {
  const [sendedRequest, setSendedRequest] = useState(false);
  const {
    setEcranChargement,
    alertPopup,
  } = usePopupContext();
  const {
    connectedUser, setConnectedUser,
    dateIndexHtmlCharge, setDateIndexHtmlCharge,
    dateIndexHtmlDisponible, setDateIndexHtmlDisponible,
    reinitTimerJeton,
  } = useConnexionContext();
  const {
    token,
    type_user,
  } = connectedUser;
  const {
    useBaseLocale,
  } = useConnexionContext();

  const _data: DataJsonRequest = useMemo(() => {
    return {
      ...data,
      token,
      useBaseLocale: useBaseLocale,
    }
  }, [
    data,
    token,
    useBaseLocale,
  ]);
  const {
    requestType,
  } = _data;

  const ACLGlobaleRequete = useMemo(() => {
    const ACL = { ...ACLsDetaillees[requestType] };
    if (ACL === undefined) {
      return [];
    }
    return [...ACL.ACLGlobale];
  }, [
    requestType,
  ]);

  const sendJsonServerRequest = useCallback((): void => {
    // console.log('data= ', data);
    // console.log('args= ', args);
    // console.log('data.requestType= ', data.requestType);
    // console.log('displayAlertModal= ', displayAlertModal);

    const eC: EcranChargementProps = {
      afficher: true,
      message: loadingMessages[requestType] ? loadingMessages[requestType] : 'Chargement...',
      type: 'normal',
      requestType,
      idEC: getUniqueId(),
      codeAffichagePartiel,
    };

    if (avecEcranChargement) {
      console.log(`requestType : ${requestType}`,
        // { highlightLabel: 'envoi requête' },
      );
      setEcranChargement(eC);
    }

    const xmlhttp = new XMLHttpRequest();
    // xmlhttp.open('POST', '/api_v3');
    xmlhttp.open('POST', apiPath);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = (): void => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          // if (!dontCloseEcranChargement) {
          if (avecEcranChargement) {
            eC.afficher = false;
            setEcranChargement(eC);
          }
          // }

          // console.log('xmlhttp.responseText after response server');
          // console.log(xmlhttp.responseText);
          const ret = JSON.parse(xmlhttp.responseText);

          // console.log('ret a data after response server');
          // console.log(ret, data);

          if (ret.success) {
            if (ret.dateIndexHtml) {
              if (dateIndexHtmlCharge) {
                setDateIndexHtmlDisponible(ret.dateIndexHtml);
              } else {
                setDateIndexHtmlCharge(ret.dateIndexHtml);
              }
            }
            if (ret.tokenRefreshed) {
              reinitTimerJeton();
            }
            if (successCallback) {
              if (argsSuccessCallback) {
                successCallback(ret, argsSuccessCallback);
              } else {
                successCallback(ret);
              }
            }
          } else {
            // console.log('ret et ret.invalidToken = ', ret, ret.invalidToken);
            if (ret.invalidToken) {
              setConnectedUser(cU => ({
                ...cU,
                token: '',
              }));
              disconnectInLS();
            }
            if (failureCallback) {
              if (argsFailureCallback) {
                failureCallback(ret, argsFailureCallback);
              } else {
                failureCallback(ret);
              }
            } else {
              // console.log(`!!!!!!!! Echec de la requête ${requestType} !!!!!!!! `);
            }


            if (ret.message !== 'SR_database_line_creation_pb'
              && ret.message !== 'SR_database_line_deletion_pb') {
              if (failureCallback) {
                if (argsFailureCallback) {
                  failureCallback(ret, argsFailureCallback);
                } else {
                  failureCallback(ret);
                }
              } else {
                if (alertPopup) {
                  alertPopup({ titre: ret.message });
                } else {
                  alert(ret.message);
                }
              }
            }
          }
        } else {
          if (alertPopup) {
            alertPopup({
              titre: `Le serveur semble ne pas répondre, essayer ultérieurement.`,
              // texte: `xmlhttp.readyState : ${xmlhttp.readyState}, xmlhttp.status = ${xmlhttp.status}`,
            });
          }
          console.log('sendJsonServerRequest, xmlhttp.status !== 200');
          if (avecEcranChargement) {
            eC.afficher = false;
            setEcranChargement(eC);
          }
          // alert('Le serveur semble occupé. Veuillez réessayer dans quelques minutes.');
        }
        // console.log(`sendJsonServerRequest, 3, requête : ${requestType}`,
        // { highlightLabel: 'sendJsonServerRequest' });
        // if (!dontCloseEcranChargement) {
        if (avecEcranChargement) {
          eC.afficher = false;
          setEcranChargement(eC);
        }
        // }
      }
    };
    sendEncryptedJson(xmlhttp, JSON.stringify(_data), token);
    // xmlhttp.send(JSON.stringify(_data));
  }, [
    _data,
    alertPopup,
    apiPath,
    argsFailureCallback,
    argsSuccessCallback,
    avecEcranChargement,
    codeAffichagePartiel,
    dateIndexHtmlCharge,
    failureCallback,
    reinitTimerJeton,
    requestType,
    setConnectedUser,
    setDateIndexHtmlCharge,
    setDateIndexHtmlDisponible,
    setEcranChargement,
    successCallback,
    token,
  ]);

  useEffect(() => {
    // if (ACLGlobaleRequete.includes(type_user)) {
    if (!sendedRequest) {
      setSendedRequest(true);
      sendJsonServerRequest();
    }
    // } else {
    //   log(`${requestType} non envoyée, rôle insuffisant`)
    // }
  }, [
    sendedRequest,
    sendJsonServerRequest,
    // ACLGlobaleRequete,
  ]);

  return <>{children}</>;
}
export default RequeteServeur;
