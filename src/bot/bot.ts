import { Client, Message, RichEmbed } from 'discord.js'
import { err, success, info } from '../SLog';
import { bot } from '../config/const.json'
import Command from './command'
import DB from './cmd/rpg/lib/DB';
import ItemManager from './cmd/rpg/lib/ItemManager';
import RegionManager from './cmd/rpg/lib/RegionManager';

class Bot {
  static client: Client
  static prefix: string = '$'

  static login(): void {
    Bot.client = new Client()
    Command.init()
    ItemManager.init()
    RegionManager.init()

    Bot.client.on('ready', async () => {
      success(`Logged in as ${Bot.client.user.tag}`)

      try {
          await Bot.client.user.setPresence({
            game: {
              name: `$help | 5tarlight.kro.kr`,
              type: "PLAYING"
            },
            status: "online"
          });
        } catch (error) {
          err(error);
        }
    })
    
    Bot.client.on('message', (msg: Message) => {
      if(msg.channel.type == 'dm') {
        return
      }
      if(!msg.content.startsWith(Bot.prefix)) return

      const arg: string[] = []
      msg.content.slice(Bot.prefix.length, msg.content.length).split('\n').forEach(s => {
        s.split(' ').forEach(c => {
          arg.push(c.trim())
        })
      })
      const cmd = arg[0]
      const args = arg.slice(1, arg.length)

      Command.execute(cmd, Bot.client, msg, args)
    
    })
    DB.init()
    Bot.client.login(bot.token)

    setInterval(() => {
      info('Auto rebooting...')
      Bot.client.destroy().then(() => {
        Bot.client.login(bot.token)
        success('Auto reboot success!')
      })
    }, 60 * 60 * 1000)
  }

  static getServers(): number {
    return Bot.client.guilds.size
  }

  static getUsers(): number {
    return Bot.client.users.size
  }
}

export default Bot
