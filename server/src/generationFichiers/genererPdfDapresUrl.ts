import RenderPDF, { IRenderPdfOptions } from 'chrome-headless-render-pdf';
import { nettoieStringSearchParams } from '../../../client/src/utils/path';

interface genererPdfDapresUrlProps {
  token: string;
  urlObjet: URL;
  callback: (pdfBuffer: Buffer) => void;
}
export const genererPdfDapresUrl = async ({
  token,
  urlObjet,
  callback,
}: genererPdfDapresUrlProps): Promise<void> => {
  const searchParams = urlObjet.searchParams;
  searchParams.append('pdf', '');
  searchParams.append('token', token);
  const searchPramsString = nettoieStringSearchParams(searchParams.toString());

  const url = encodeURI(`${urlObjet.origin}${urlObjet.pathname}?${searchPramsString}`);
  console.log(`genererPdfDapresUrl, url : ${url}`);

  let options: IRenderPdfOptions = {
    noMargins: true,
    includeBackground: true,
    // landscape: !mode_portrait,
    // landscape: !(mode_portrait && (ID === 3 || ID === 8)),
    // windowSize: '1800x1254',
    paperHeight: '11.69',
    paperWidth: '8.27',
    scale: 1,
    // chromeOptions: ['--timeout=5000'],
    // chromeOptions: ['--virtual-time-budget=10000'],
    // printErrors: true,
    // printLogs: true,
  };

  if (process.platform === 'win32') {
    console.log(`Génération sous windows demandée`);
    options = {
      ...options,
      chromeBinary: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
    };
  }

  // console.log(`options de generatePdfBuffer : ${JSON.stringify(options)}`);

  await RenderPDF.generatePdfBuffer(url, options)
    .then((pdfBuffer) => {
      // console.log('generatePdfBuffer then');
      // console.log(pdfBuffer);
      callback(pdfBuffer);
    })
    .catch(err => {
      // console.log(`url, ${url}`);
      console.log('erreur await RenderPDF.generatePdfBuffer', err);
      callback(null);
      return;
    });
  // console.log('apres generatePdfBuffer');

  return;
};
