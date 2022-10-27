import { SqlCondition, SqlConditionArray, SqlRetValue, SqlUpdateCondition } from "types/sql";
import { echappeApostrophes } from "utils/utils";
import { RowDataPacket } from "../../../common/types/sql";
import { poolLocal, poolDistant } from '../../database';

export const sqlExecRequete = async (
  requete: string,
  baseLocale: boolean,
  baseVaerdi = false,
): Promise<RowDataPacket[] | false> => {
  let rows;
  // console.log('sqlSelectFromTable, sql=', sql);
  try {
    rows = baseLocale
      ? await poolLocal.query(requete)
      // : (baseVaerdi
      //     ? await poolWPVaerdi.query(requete)
          : await poolDistant.query(requete);
  } catch (e) {
    console.log(e);
    return false;
  }
  // console.log('sqlSelectFromTable, rows=', rows);
  return rows;
}

export const sqlSelectAllFromTable = async (
  table: string,
  conditions: SqlCondition[],
  baseLocale: boolean,
  montreRequete?: boolean,
): Promise<RowDataPacket[] | false> => {
  let rows;
  let g;
  let sql = `SELECT * FROM \`${table}\` WHERE 1 = 1`;
  for (let i = 0; i < conditions.length; i += 1) {
    g = conditions[i].valueWithoutQuote ? '' : '\'';
    sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
  }

  if (montreRequete) {
    console.log(sql);
  }

  try {
    rows = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
    return false;
  }

  // console.log(rows);
  return rows;
}
export const sqlSelectAllFromTableInList = async (
  table: string,
  conditionArray: SqlConditionArray,
  baseLocale: boolean,
  montreRequete?: boolean,
): Promise<RowDataPacket[] | false> => {
  let rows;
  let g;
  const tempListString = conditionArray.array.join(
    conditionArray.valueWithoutQuote
      ? ', '
      : "', '"
  );
  const list = `(${tempListString})`;
  let sql = `SELECT * FROM \`${table}\` WHERE ${conditionArray.column} IN ${list}`;

  if (montreRequete) {
    console.log(sql);
  }

  try {
    rows = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
    return false;
  }

  // console.log(rows);
  return rows;
}

export const sqlSelectFromTable = async (
  table: string,
  columns: string[],
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<RowDataPacket[] | false> => {
  let rows;
  let g;
  let sql = 'SELECT ';

  if (Array.isArray(columns)) {
    for (let i = 0; i < columns.length; i += 1) {
      sql += `\`${columns[i]}\``;
      sql += i < columns.length - 1 ? ', ' : ' ';
    }
  } else {
    sql += `\`${columns}\` `;
  }
  sql += `FROM \`${table}\` WHERE 1 = 1`;

  for (let i = 0; i < conditions.length; i += 1) {
    g = conditions[i].valueWithoutQuote ? '' : '\'';
    sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
  }

  // console.log('sqlSelectFromTable, sql=', sql);
  try {
    rows = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
    return false;
  }
  // console.log('sqlSelectFromTable, rows=', rows);
  return rows;
}

export const sqlSelectFromTableInList = async (
  table: string,
  columns: string[],
  conditionArray: SqlConditionArray,
  baseLocale: boolean,
): Promise<RowDataPacket[] | false> => {
  let rows;
  // let g;
  let sql = 'SELECT ';
  const tempListString = conditionArray.array.join(
    conditionArray.valueWithoutQuote
    ? ', '
    : "', '"
  );
  const list = `(${tempListString})`;

  if (Array.isArray(columns)) {
    for (let i = 0; i < columns.length; i += 1) {
      sql += `\`${columns[i]}\``;
      sql += i < columns.length - 1 ? ', ' : ' ';
    }
  } else {
    sql += `\`${columns}\` `;
  }
  sql += `FROM \`${table}\` WHERE ${conditionArray.column} IN ${list}`;

  // console.log('sqlSelectFromTableInList, sql=', sql);

  try {
    rows = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
    return false;
  }
  // console.log('sqlSelectFromTable, rows=');
  // console.log(rows);
  return rows;
}

export const sqlSelectLikeFromTable = async (
  table: string,
  columns: string[],
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<RowDataPacket[] | false> => {
  let rows;
  // let g;
  let sql = 'SELECT ';

  if (Array.isArray(columns)) {
    for (let i = 0; i < columns.length; i += 1) {
      sql += `\`${columns[i]}\``;
      sql += i < columns.length - 1 ? ', ' : ' ';
    }
  } else {
    sql += `\`${columns}\` `;
  }
  sql += `FROM \`${table}\` WHERE 1 = 1`;

  for (let i = 0; i < conditions.length; i += 1) {
    sql += ` AND \`${conditions[i].column}\` LIKE '%${conditions[i].value}%'`;
  }

  // console.log('sqlSelectFromTable, sql=', sql);
  try {
    rows = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
    return false;
  }
  // console.log('sqlSelectFromTable, rows=');
  // console.log(rows);
  return rows;
}

export const sqlSelectOneFromTable = async (
  table: string,
  column: string,
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<any | false> => {
  let rows;
  let g;
  let sql = `SELECT \`${column}\` FROM \`${table}\` WHERE 1 = 1 `;

  for (let i = 0; i < conditions.length; i += 1) {
    g = conditions[i].valueWithoutQuote ? '' : '\'';
    sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
  }

  // console.log('sqlSelectFromTable, sql=');
  // console.log(sql);
  try {
    rows = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
    return false;
  }
  if (rows.length !== 1) {
    return false;
  }
  // console.log('sqlSelectFromTable, rows=');
  // console.log(rows);
  return rows[0][column];
}

export const sqlSelectOneLikeFromTable = async (
  table: string,
  column: string,
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<any | false> => {
  let rows;
  // let g;
  let sql = `SELECT \`${column}\` FROM \`${table}\` WHERE 1 = 1 `;

  for (let i = 0; i < conditions.length; i += 1) {
    sql += ` AND \`${conditions[i].column}\` LIKE '%${conditions[i].value}%'`;
  }

  // console.log('sqlSelectFromTable, sql=');
  // console.log(sql);
  try {
    rows = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
    return false;
  }
  if (rows.length !== 1) {
    return false;
  }
  // console.log('sqlSelectFromTable, rows=');
  // console.log(rows);
  return rows[0][column];
}


export const sqlSelectAllFromTableWhereIn = async (
  table: string,
  colonneInTableName: string,
  subTable: string,
  colonneInSubTableName: string,
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<RowDataPacket[] | false> => {
  let rows;
  let g;
  let sql = `SELECT * FROM \`${table}\` `;
  sql += `WHERE \`${colonneInTableName}\` `;
  sql += `IN (SELECT \`${colonneInSubTableName}\` FROM \`${subTable}\` WHERE 1 = 1`;
  for (let i = 0; i < conditions.length; i += 1) {
    g = conditions[i].valueWithoutQuote ? '' : '\'';
    sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
  }
  sql += ')';

  // console.log(sql);
  try {
    rows = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
    return false;
  }

  // console.log('sqlSelectAllFromTableWhereIn, returned rows=');
  // console.log(rows);
  return rows;
}

/**
 * update une table
 * @param table nom de la table
 * @param columnsValues liste de triplets colonnes/valeur/valeur sans guillemets (à retirer à l'avenir)
 * des valeurs à modifier.
 * Possibilité d'utiliser le mot-clé ___CURRENT_TIMESTAMP___ avec valueWithoutQuote = true
 * pour mettre la date actuelle
 * @param conditions liste de triplets colonnes/valeur/valeur sans guillemets (à retirer à l'avenir)
 * représentatn les conditions des lignes à modifier (liées par un AND)
 * @param baseLocale true si base locale
 * @returns
 */
export const sqlUpdate = async (
  table: string,
  columnsValues: SqlUpdateCondition[],
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<SqlRetValue & { requete: string }> => {
  let g;
  let value;

  let sql = `UPDATE \`${table}\` SET `;
  if (columnsValues.length === 0) {
    sql = `SELECT * from \`${table}\``;
  } else {
    for (let i = 0; i < columnsValues.length; i += 1) {
      if (typeof columnsValues[i].value === 'string') {
        value = echappeApostrophes(columnsValues[i].value as string);
        if (value === '___CURRENT_TIMESTAMP___') {
          value = 'CURRENT_TIMESTAMP';
        }
      } else {
        value = columnsValues[i].value;
      }
      g = columnsValues[i].valueWithoutQuote ? '' : '\'';
      sql += `\`${columnsValues[i].column}\` = ${g}${value}${g}`;
      sql += i < columnsValues.length - 1 ? ', ' : ' ';
    }
    sql += 'WHERE 1 = 1';
    for (let i = 0; i < conditions.length; i += 1) {
      g = conditions[i].valueWithoutQuote ? '' : '\'';
      sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
    }
  }

  let result = {
    requete: sql,
  } as any;


  // console.log('sql =', sql);
  try {
    const retPool = baseLocale
      ? await poolLocal.query(sql)
      : await poolDistant.query(sql);
    result = {
      ...result,
      ...retPool,
    };
    // console.log('sqlUpdateAuth, result=', result);
    return result;
  } catch (e) {
    console.log(e);
    return result;
  }
}

export const sqlUpdateWithUpdateTimeStamp = async (
  table: string,
  columnsValues: SqlUpdateCondition[],
  validite: { value: number; unite: 'jour' | 'heure'; nomColumn: string },
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<SqlRetValue & { requete: string }> => {
  let g;
  let value;

  let sql = `UPDATE \`${table}\` SET `;
  if (columnsValues.length === 0) {
    sql = `SELECT * from \`${table}\``;
  } else {
    for (let i = 0; i < columnsValues.length; i += 1) {
      if (typeof columnsValues[i].value === 'string') {
        value = echappeApostrophes(columnsValues[i].value as string);
      } else {
        value = columnsValues[i].value;
      }
      g = columnsValues[i].valueWithoutQuote ? '' : '\'';
      sql += `\`${columnsValues[i].column}\` = ${g}${value}${g}`;
      sql += i < columnsValues.length - 1 ? ', ' : `, ${validite.nomColumn} = date_add(current_timestamp, INTERVAL ${
  validite.value} ${validite.unite === 'jour' ? 'DAY' : 'HOUR'}) `;
    }
    sql += 'WHERE 1 = 1';
    for (let i = 0; i < conditions.length; i += 1) {
      g = conditions[i].valueWithoutQuote ? '' : '\'';
      sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
    }
  }

  sql += 'WHERE 1 = 1';
  for (let i = 0; i < conditions.length; i += 1) {
    g = conditions[i].valueWithoutQuote ? '' : '\'';
    sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
  }

  let result = {
    requete: sql,
  } as any;


  console.log(`sqlUpdateTimeStamp, sql = ${sql}`);
  try {
    const retPool = baseLocale
      ? await poolLocal.query(sql)
      : await poolDistant.query(sql);
    result = {
      ...result,
      ...retPool,
    };
    // console.log('sqlUpdateAuth, result=', result);
    return result;
  } catch (e) {
    console.log(e);
    return result;
  }
}

export const sqlUpdateTimeStamp = async (
  table: string,
  validite: { value: number; unite: 'jour' | 'heure'; nomColumn: string },
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<SqlRetValue & { requete: string }> => {
  let g;
  let value;

  let sql = `UPDATE \`${table}\` SET ${validite.nomColumn
    } = date_add(current_timestamp, INTERVAL ${
  validite.value} ${validite.unite === 'jour' ? 'DAY' : 'HOUR'}) `;
  sql += 'WHERE 1 = 1';
  for (let i = 0; i < conditions.length; i += 1) {
    g = conditions[i].valueWithoutQuote ? '' : '\'';
    sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
  }

  let result = {
    requete: sql,
  } as any;


  console.log(`sqlUpdateTimeStamp, sql = ${sql}`);
  try {
    const retPool = baseLocale
      ? await poolLocal.query(sql)
      : await poolDistant.query(sql);
    result = {
      ...result,
      ...retPool,
    };
    // console.log('sqlUpdateAuth, result=', result);
    return result;
  } catch (e) {
    console.log(e);
    return result;
  }
}

// interface SqlUpdateAuthArgs {
//   toUpdate: SqlSignUpCondition[];
//   emailAddress?: string;
//   userId?: number;
// }
// // token should always be defined (if no token, token='no_token')
// export const sqlUpdateAuth = async (args: SqlUpdateAuthArgs): Promise<SqlRetValue> => {
//   let result;
//   let g;
//   const { toUpdate, emailAddress, userId } = args;

//   let sql = `UPDATE \`user\` SET `;
//   for (let i = 0; i < toUpdate.length; i += 1) {
//     g = toUpdate[i].valueWithoutQuote ? '' : '\'';
//     sql += `\`${toUpdate[i].column}\` = ${g}${toUpdate[i].value}${g}`;
//     sql += i < toUpdate.length - 1 ? ', ' : ' ';
//   }

//   sql += emailAddress ? `WHERE \`emailAddress\` = '${emailAddress}'`
//     : `WHERE \`id\` = '${userId}'`;

//   // console.log(sql);
//   try { result = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql); } catch (e) { console.log(e); }

//   // console.log('sqlUpdateAuth, result=');
//   // console.log(result);
//   return result;
// }


export const sqlTruncate = async (
  table: string,
  baseLocale: boolean,
  ): Promise<SqlRetValue> => {
  let result;
  let g;
  let value;

  let sql = `TRUNCATE TABLE \`${table}\``;
  // console.log(sql);
  try { result = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql); } catch (e) { console.log(e); }

  // console.log('sqlInsert, result=');
  // console.log(result);
  return result;
  // return true;
}

export const sqlInsert = async (
  table: string,
  columnsValues: SqlCondition[],
  baseLocale: boolean,
  ): Promise<SqlRetValue> => {
  let result;
  let g;
  let value;

  let sql = `INSERT INTO \`${table}\` (`;
  for (let i = 0; i < columnsValues.length; i += 1) {
    sql += `\`${columnsValues[i].column}\``;
    sql += i < columnsValues.length - 1 ? ', ' : ')';
  }
  sql += ' VALUES (';
  for (let i = 0; i < columnsValues.length; i += 1) {
    if (typeof columnsValues[i].value === 'string') {
      value = echappeApostrophes(columnsValues[i].value as string);
    } else {
      value = columnsValues[i].value;
    }
    g = columnsValues[i].valueWithoutQuote ? '' : '\'';
    sql += `${g}${value}${g}`;
    sql += i < columnsValues.length - 1 ? ', ' : ')';
  }
  // console.log(sql);
  try { result = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql); } catch (e) { console.log(e); }

  // console.log(`sqlInsert, result=${JSON.stringify(result)}`);
  return result;
  // return true;
}

export const sqlInsertWithDatePeremption = async (
  table: string,
  columnsValues: SqlCondition[],
  validite: { value: number; unite: 'jour' | 'heure'; nomColumn: string },
  baseLocale: boolean,
  ): Promise<SqlRetValue> => {
  let result_set;
  let result;
  let g;
  let value;

  // const sql_set = `SET @date_peremption := date_add(current_timestamp, INTERVAL ${
  //   validite.value} ${validite.unite === 'jour' ? 'DAY' : 'HOUR'});`;
  let sql = `INSERT INTO \`${table}\` (`;
  for (let i = 0; i < columnsValues.length; i += 1) {
    sql += `\`${columnsValues[i].column}\``;
    sql +=  ', ';
  }
  sql += `\`${validite.nomColumn}\`)`;

  sql += ' VALUES (';
  for (let i = 0; i < columnsValues.length; i += 1) {
    if (typeof columnsValues[i].value === 'string') {
      value = echappeApostrophes(columnsValues[i].value as string);
    } else {
      value = columnsValues[i].value;
    }
    g = columnsValues[i].valueWithoutQuote ? '' : '\'';
    sql += `${g}${value}${g}`;
    sql += ', ';
  }
  sql += `date_add(current_timestamp, INTERVAL ${
    validite.value} ${validite.unite === 'jour' ? 'DAY' : 'HOUR'}));`;
  // sql += `@date_peremption);`;

  // console.log(sql_set);
  // console.log(sql);
  // try {
  //   result_set = baseLocale
  //     ? await poolLocal.query(sql_set)
  //     : await poolDistant.query(sql_set);
  // } catch (e) {
  //   console.log(e);
  // }
  // console.log('sqlInsert, result set = ', result);

  try {
    result = baseLocale
      ? await poolLocal.query(sql)
      : await poolDistant.query(sql);
  } catch (e) {
    console.log(e);
  }

  // console.log('sqlInsert, result = ', result);

  return result;
  // return true;
}


/**
 * Supprime les lignes d'une table dont le champ nomColonneDate est plus vieux que la date actuelle
 * @param table table dans laquelle supprimer les lignes
 * @param nomColonneDate nom de la colonne contenant la date au format TIMESTAMP
 * @param baseLocale si base locale
 * @returns
 */
export const sqlDeleteLignesPerimees = async (
  table: string,
  nomColonneDate: string,
  baseLocale: boolean,
): Promise<SqlRetValue> => {
  let result;
  let g;

  // console.log('sqlDelete, conditions=');
  // console.log(conditions);
  const dateNow = Math.round(new Date().getTime() / 1000);

  let sql = `DELETE FROM \`${table}\` WHERE ${nomColonneDate} < ${dateNow}`;
  // console.log(sql);
  try { result = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql); } catch (e) { console.log(e); }

  // console.log('sqlDelete, result=');
  // console.log(result);

  return result;
}

// token should always be defined (if no token, token='no_token')
export const sqlDelete = async (
  table: string,
  conditions: SqlCondition[],
  baseLocale: boolean,
): Promise<SqlRetValue> => {
  let result;
  let g;

  // console.log('sqlDelete, conditions=');
  // console.log(conditions);

  let sql = `DELETE FROM \`${table}\` WHERE 1 = 1`;
  for (let i = 0; i < conditions.length; i += 1) {
    g = conditions[i].valueWithoutQuote ? '' : '\'';
    sql += ` AND \`${conditions[i].column}\` = ${g}${conditions[i].value}${g}`;
  }

  // console.log(sql);
  try { result = baseLocale ? await poolLocal.query(sql) : await poolDistant.query(sql); } catch (e) { console.log(e); }

  // console.log('sqlDelete, result=');
  // console.log(result);

  return result;
}
