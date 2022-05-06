import { SlashCommand } from "../../Structures/Classes/SlashCommand";

export default new SlashCommand({
  name: "ping",
  description: "Show my websocket ping.",
  category: "information",
  run: async ({ client, interaction }) => {
    interaction.reply({ embeds: [
      {
        title: "Ping",
        description: `Websocket : \`${client.ws.ping.toLocaleString()}ms\``,
        color: "RANDOM"
      }
    ] })
  }
})