import React, { useEffect, useState } from 'react';
import { DataPublicDataLoadingRequest } from '../../common/types/serverRequests';
import { PublicDataLoadingResponse } from '../../common/types/serverResponses';
import { useArticlesContext } from './contexts/ArticlesContext';
import { useGlobalContext } from './contexts/GlobalContext';
import { usePdfContext } from './contexts/PdfContext';
import RequeteServeur from './launchServerRequest/requeteServeur';

const PublicDataLoader: React.FC = () => {
  const [envoiRequetePublicDataLoading, setEnvoiRequetePublicDataLoading] = useState(false);
  const {
    setPublicDataLoadingFini,
  } = useGlobalContext();
  const {
    pdfGeneration,
  } = usePdfContext();
  const {
    initialiseArticles,
  } = useArticlesContext();

  const getPublicDataLoadingFailure = (
    ret: PublicDataLoadingResponse,
    ): void => {
    setEnvoiRequetePublicDataLoading(false);
  }
  const getPublicDataLoadingSuccess = (
    ret: PublicDataLoadingResponse,
  ): void => {
    setEnvoiRequetePublicDataLoading(false);

    // BASE ARTICLES
    if (ret.articles) {
      initialiseArticles(ret.articles);
    }

    setPublicDataLoadingFini(true);
  }

  useEffect(() => {
    setEnvoiRequetePublicDataLoading(true);
  }, []);

  return (
    <>
      {envoiRequetePublicDataLoading &&
        <RequeteServeur
          data={{
            requestType: 'publicDataLoading',
            isPdfGeneration: pdfGeneration,
          } as DataPublicDataLoadingRequest}
          successCallback={getPublicDataLoadingSuccess}
          failureCallback={getPublicDataLoadingFailure}
        // avecEcranChargement={false}
        />
      }
    </>
  );
}

export default PublicDataLoader;
