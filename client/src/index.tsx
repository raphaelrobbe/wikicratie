import React from 'react';
import ReactDOM from "react-dom/client";
// import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './styles/custom.scss';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { disableReactDevTools } from './disableReactDevTools';
import { App } from './App';
import { ArticlesContextProvider } from './contexts/ArticlesContext';
import { GlobalContextProvider } from './contexts/GlobalContext';
import { PdfContextProvider } from './contexts/PdfContext';
import { BreadCrumbsContextProvider } from './contexts/BreadCrumbsContext';
import PublicDataLoader from './DataLoader';
import { KeyboardContextProvider } from './contexts/KeyboardContext';
import { ConnexionContextProvider } from './contexts/ConnexionContext';
import { PopupContextProvider } from './contexts/PopupContext';

const rootElement = ReactDOM.createRoot(document.getElementById('root') as Element);

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

rootElement.render(
  <BrowserRouter>
    <KeyboardContextProvider>
      <PdfContextProvider>
        <GlobalContextProvider>
          <PopupContextProvider>
            <ConnexionContextProvider>
              <BreadCrumbsContextProvider>
                <ArticlesContextProvider>
                  <App />
                  <PublicDataLoader />
                </ArticlesContextProvider>
              </BreadCrumbsContextProvider>
            </ConnexionContextProvider>
          </PopupContextProvider>
        </GlobalContextProvider>
      </PdfContextProvider>
    </KeyboardContextProvider>
  </BrowserRouter>
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
