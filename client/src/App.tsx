import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AudiosArticlesWrapper } from './AudiosArticlesWrapper';
import { pathAccueil, pathArticles, pathAudios, pathFAQ, pathLexique } from './datas/paths';
import { Accueil } from './Accueil';
import { GeneralNavBar } from './navigation/GeneralNavBar';
import { Lexique } from './Lexique';
import { Articles } from './Articles';
import { FAQ } from './FAQ';

export const App: React.FC = () => {
  return (
    <>
      {/* <Container fluid> */}
        <GeneralNavBar />
        <Routes>
          {/* <Route
            path={`${pathAudios}/*`}
            element={<AudiosArticlesWrapper />}
          /> */}
          <Route
            path={`${pathArticles}/*`}
            element={<Articles />}
          />
          <Route
            path={`${pathLexique}/*`}
            element={<Lexique />}
          />
          <Route
            path={`${pathFAQ}/*`}
            element={<FAQ />}
          />
          <Route
            path={pathAccueil}
            // element={<>
            //   <AudiosArticlesWrapper />
            //   </>}
            element={<Accueil />}
          />
          <Route
            path={`*`}
            element={<Navigate replace to={pathAccueil} />}
          />
        </Routes>
      {/* </Container> */}
    </>
  );
};
