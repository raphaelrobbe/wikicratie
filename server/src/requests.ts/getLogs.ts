import * as winston from 'winston';

// import { format } from 'winston';
import { logger } from 'logger';
import { DataGetLogsRequest } from '../../../common/types/serverRequests';
import { GetLogsResponse } from '../../../common/types/serverResponses';

const getLogs = async (
  reqBody: DataGetLogsRequest,
): Promise<GetLogsResponse> => {
  const returnValue: GetLogsResponse = {
    success: false,
    message: 'probleme getLogs',
    logs: {},
    idRequeteGetLogs: '',
  };
  const {
    fromNbSecondesPasse,
    toNbSecondesPasse,
    limit,
  } = reqBody;

  let tFrom: Date | undefined = new Date();
  if (fromNbSecondesPasse === undefined) {
    tFrom = undefined;
  } else {
    tFrom.setSeconds(tFrom.getSeconds() - fromNbSecondesPasse);
  }
  let tTo: Date | undefined = new Date();
  if (toNbSecondesPasse === undefined) {
    tTo = undefined;
  } else {
    tTo.setSeconds(tTo.getSeconds() - toNbSecondesPasse);
  }
  // t.setSeconds(t.getSeconds() - (24 * 60 * 60));
  const options: winston.QueryOptions = {
    from: tFrom,
    until: tTo,
    limit: Infinity,
    start: 0,
    order: 'desc',
    fields: null,
  };

  //
  // Find items logged between today and yesterday.
  //
  // logger.query = util.promisify(logger.query);

  // const resolve = (results: any): void => {
  //   returnValue.logs = results;
  //   returnValue.success = true;
  //   returnValue.message = 'OK';
  // }

const loggerQuery = () => {
  return new Promise((resolve, reject) => logger.query(options, (err, results) => {
    if (err) {
      reject(err);
    }
    // console.log('results.file = ', results.file);
    resolve(results);
  }));
}

await loggerQuery()
  .catch(err => {
    returnValue.message = 'problème logger';
    throw err;
  })
  .then(results => {
    // console.log('query logs ok');
    returnValue.logs = results;
    returnValue.success = true;
    returnValue.message = 'OK';
  });

  // console.log('returnValue.logs = ', returnValue.logs);

  returnValue.logs.file = (returnValue.logs.file as any[]).map(ligne => {
    const _log = { ...ligne };
    delete _log.token;
    return _log;
  })
  returnValue.idRequeteGetLogs = (reqBody as any)._uniqueId;
  return returnValue;

}

export default getLogs;
