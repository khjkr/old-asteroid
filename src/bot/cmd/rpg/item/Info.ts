import CE from "../../CE";
import { Client, Message, RichEmbed } from "discord.js";
import DB from "../lib/DB";
import { err } from "../../../../SLog";

class Info extends CE {
  command(client: Client, msg: Message, args: string[]) {
    const users = msg.mentions.users

    if(!(users.array().length > 0)) {
      const embed = new RichEmbed()
        .setTitle('실패')
        .addField('해당 유저를 찾을 수 없습니다.', '@mention 을 통해 유저를 지정해 주십시오.')
      
      msg.channel.send(embed)
      return
    }

    DB.query('SELECT * FROM user where id=?', [users.first().id], (error, results, fields) => {
      if(error) {
        err(error.stack || error.toString())
      }

      if(results.length < 1) {
        const embed = new RichEmbed()
          .setTitle('실패')
          .addField('해당 유저의 정보가 없습니다', '`$tos`를 통해 약관에 동의 해 주십시오.')
      
        msg.channel.send(embed)
        return
      }

      const embed = new RichEmbed()
        .setTitle('STAT OF `' + users.first().username + '`')
        .addField('소지품', results[0]['item'])
        .addField('돈', results[0]['money'])

      msg.channel.send(embed)
    })
  }

  desc = {
    name: 'info',
    description: "@mention된 유저의 정보를 봅니다.",
    aliases: ["정보", "stats", "스탯", "stat"]
  }
}

export default Info