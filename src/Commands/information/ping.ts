import { Command } from "../../Structures/Classes/Command";

export default new Command({
  name: "ping",
  description: "Show my ebsocket ping",
  category: "information",
  run: async ({ client, message }) => {
    message.reply({
      embeds: [
        {
          title: "Ping",
          description: `Websocket : \`${client.ws.ping.toLocaleString()}ms\``,
          color: "RANDOM",
        },
      ],
    });
  },
});
