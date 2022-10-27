/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SqlCondition {
  column: string;
  value: string | number | boolean;
  valueWithoutQuote?: boolean;
}
export interface SqlConditionTypee<R> {
  column: keyof R;
  value: string | number;
  valueWithoutQuote?: boolean;
}
export interface SqlConditionArray {
  column: string;
  array: (string | number)[];
  valueWithoutQuote?: boolean;
}

export interface SqlUpdateCondition {
  column  : string;
  value   : string | number | boolean | null;
  valueWithoutQuote?: boolean;
}

export interface SqlUpdateConditionTypee<R> {
  column  : keyof R;
  value   : string | number | boolean | null;
  valueWithoutQuote?: boolean;
}

export interface SqlSignUpCondition {
  column: string;
  value: string | number | null;
  valueWithoutQuote?: boolean;
}

export interface SqlRetValue {
  changedRows : number;
  affectedRows: number;
  insertId    : number;
}

export interface ValidationCodeStillValid {
  stillValid: boolean;
  message: string;
  accountState: number;
}


export interface RowDataPacket {
  [x: string]: any;
}
