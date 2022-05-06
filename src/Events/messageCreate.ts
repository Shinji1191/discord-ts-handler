import { Event } from "../Structures/Classes/Event";
import { MessageEmbed } from "discord.js";

// Types
import { CommandType } from "../Structures/Types/Command";

// Functions
import { nicerPermissions } from "../Structures/Functions/nicerPermissions";

export default new Event("messageCreate", async (client, message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.toLowerCase().startsWith(client.config.prefix)
  )
    return;

  let [cmd, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/g);

  let command: CommandType = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()))

  if (!command) return

  if (command.devCommand && (await (client.application.fetch())).owner.id !== message.author.id) return;

  if (command.guildCommand && !client.config.guildIDs?.includes(message.guildId)) {
    let embed = new MessageEmbed()
      .setDescription(`${command.name} can only be run in some servers.`)
      .setColor("RED")
    return message.reply({ embeds: [embed] })
  }

  if (command.nsfwCommand && message.channel.type === "GUILD_TEXT" && !message.channel.nsfw) {
    let embed = new MessageEmbed()
      .setDescription(`${command.name} can only be run in nsfw enabled channels.`)
      .setColor("RED")
    return message.reply({ embeds: [embed] })
  }

  if (command.ownerCommand && message.guild.ownerId !== message.author.id) {
    let embed = new MessageEmbed()
      .setDescription(`${command.name} can only be run by the owner of this server.`)
      .setColor("RED")
    return message.reply({ embeds: [embed] })
  }

  if (!message.member.permissions.has(command.userPermissions || [])) {
    let embed = new MessageEmbed()
      .setDescription(`${command.name} requires some permissions for you to use it.`)
      .addFields({
        name: "__Required user permissions__",
        value: `\`\`\`${command.userPermissions.map((permission) => nicerPermissions(permission.toString())).join("\n")}\`\`\``
      })
      .setColor("RED")
    return message.reply({ embeds: [embed] })
  }

  if (!message.guild.me.permissions.has(command.myPermissions || [])) {
    let embed = new MessageEmbed()
      .setDescription(`${command.name} requires some permissions for me to run it.`)
      .addFields({
        name: "__Required user permissions__",
        value: `\`\`\`${command.myPermissions.map((permission) => nicerPermissions(permission.toString())).join("\n")}\`\`\``
      })
      .setColor("RED")
    return message.reply({ embeds: [embed] })
  }

  await command.run({ client, message, args })
});
