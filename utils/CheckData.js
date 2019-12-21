const Database = require('./Database')

class CheckData {
  static async hasData(msg) {
    const db = new Database(msg)
    let result = false

    await db.query('SELECT * FROM user WHERE discord=?', [msg.author.id])
    .then(rows => {
      console.log(rows.length)
      if(rows.length > 0) result = true
    })

    await db.close()

    console.log(result)
    return result
  }

  static insertDefault(msg) {
    const db = new Database(msg)
    
    db.query('INSERT INTO user (discord) VALUES (?)', [msg.author.id])
    db.close()
  }
}

module.exports = CheckData