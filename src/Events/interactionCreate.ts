import { Event } from "../Structures/Classes/Event";
import { CommandInteractionOptionResolver, MessageEmbed } from "discord.js";


// Functions
import { nicerPermissions } from "../Structures/Functions/nicerPermissions";

// Types
import { ExtendedInteraction, SlashCommandType } from "../Structures/Types/SlashCommand"

export default new Event("interactionCreate", async (client, interaction) => {
  if (interaction.isCommand()) {
    const command: SlashCommandType = client.slashCommands.get(interaction.commandName)

    if (!command) return interaction.reply({ embeds: [{ description: "The command used is non-existent.", color: "RED", title: "Invalid Command" }], ephemeral: true })

    if (command.devCommand && (await (client.application.fetch())).owner.id !== interaction.user.id) {
      let embed = new MessageEmbed()
        .setDescription(`${command.name} can only be used by the developer.`)
        .setColor("RED")
      return interaction.reply({ embeds: [embed] })
    }

    if (command.guildCommand && !client.config.guildIDs?.includes(interaction.guildId)) {
      let embed = new MessageEmbed()
        .setDescription(`${command.name} can only be run in some servers.`)
        .setColor("RED")
      return interaction.reply({ embeds: [embed] })
    }

    if (command.nsfwCommand && interaction.channel.type === "GUILD_TEXT" && !interaction.channel.nsfw) {
      let embed = new MessageEmbed()
        .setDescription(`${command.name} can only be run in nsfw enabled channels.`)
        .setColor("RED")
      return interaction.reply({ embeds: [embed] })
    }

    if (command.ownerCommand && interaction.guild.ownerId !== interaction.guild.id) {
      let embed = new MessageEmbed()
        .setDescription(`${command.name} can only be run by the owner of this server.`)
        .setColor("RED")
      return interaction.reply({ embeds: [embed] })
    }

    if (!interaction.memberPermissions.has(command.userPermissions || [])) {
      let embed = new MessageEmbed()
        .setDescription(`${command.name} requires some permissions for you to use it.`)
        .addFields({
          name: "__Required user permissions__",
          value: `\`\`\`${command.userPermissions.map((permission) => nicerPermissions(permission.toString())).join("\n")}\`\`\``
        })
        .setColor("RED")
      return interaction.reply({ embeds: [embed] })
    }

    if (!interaction.guild.me.permissions.has(command.myPermissions || [])) {
      let embed = new MessageEmbed()
        .setDescription(`${command.name} requires some permissions for me to run it.`)
        .addFields({
          name: "__Required user permissions__",
          value: `\`\`\`${command.myPermissions.map((permission) => nicerPermissions(permission.toString())).join("\n")}\`\`\``
        })
        .setColor("RED")
      return interaction.reply({ embeds: [embed] })
    }

    await command.run({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as ExtendedInteraction
    })
  }
})