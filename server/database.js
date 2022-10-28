// https://medium.com/@mhagemann/create-a-mysql-database-middleware-with-node-js-8-and-async-await-6984a09d49f4

import mysql from 'mysql';
import util from 'util';

const createPoolDistant = (host) => {
  return mysql.createPool({
    connectionLimit: 10,
    host,
    port: '3306',
    user: '',
    password: '',
    database: '',
    waitForConnections: true,
    queueLimit: 100,
  });
}

const createPoolLocal = (host) => {
  return mysql.createPool({
    connectionLimit: 10,
    host,
    port: '3306',
    user: '',
    password: '',
    database: '',
    waitForConnections: true,
    queueLimit: 100,
  });
}
export const poolLocal = createPoolLocal('localhost');
export const poolDistant = createPoolDistant('82.165.254.81');


const logErrCode = (err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  if (connection) connection.release();
}

poolDistant.getConnection(logErrCode);
poolLocal.getConnection(logErrCode);
// poolWPVaerdi.getConnection(logErrCode);

poolDistant.query = util.promisify(poolDistant.query);
poolLocal.query = util.promisify(poolLocal.query);
// poolWPVaerdi.query = util.promisify(poolWPVaerdi.query);

// host: 'eu-cdbr-west-02.cleardb.net', // heroku
// user: 'b21c09bfbc54c1', // heroku
// password: 'f68d6e68', // heroku
// database: 'heroku_49f8efcb633a516', // heroku
