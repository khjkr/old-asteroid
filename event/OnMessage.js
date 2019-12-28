const Core = require('../data/core.json')
const Logger = require('korean-logger')
const EventHandler = require('./EventHandler')
const CommandExecutor = require('../command/CommandExecutor')
const CheckData = require('../utils/CheckData')
const Lang = require('../lang/Language')

class OnMessage extends EventHandler {
  constructor () {
    super('message')
  }

  bind (client, msg) {
    if (msg.author.bot) return
    if (!msg.content.startsWith(Core.bot.prefix)) return

    CheckData.hasData(msg).then(result => {
      if(!result) {
        CheckData.insertDefault(msg)

        Lang.getLang(msg).then(lang => {
          msg.channel.send(Lang.langs[lang].dataChecker.createNewData)
        })    
      }
    })

    const args = msg.content.slice(Core.bot.prefix.length).trim().split(/ |\n+/g)
    const cmd = args.shift().toLowerCase()

    CommandExecutor.commands.forEach(ce => {
      if (ce.cmd.commandInfo.name === cmd || ce.cmd.commandInfo.aliases.includes(cmd)) {
        Lang.getLang(msg).then(lang => {
          ce.cmd.run(client, msg, args, cmd, Lang.getLangs()[lang])
          Logger.log(`${msg.author.id} : ${cmd}`)
        })
      }
    })
  }
}

module.exports = OnMessage