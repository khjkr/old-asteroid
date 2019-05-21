    
import { Connection, createConnection, queryCallback } from 'mysql'
import * as DBSetting from '../../../config/const.json'
import { success } from '../../../SLog.js';

class DB {
  static conn: Connection

  static init() {
    this.conn = createConnection(DBSetting.db)
    success('DB Connection Ready')
  }

  static query(query: string, values: any, callback: queryCallback) {
    this.conn.query(query, values, callback)
  }
}

export default DB