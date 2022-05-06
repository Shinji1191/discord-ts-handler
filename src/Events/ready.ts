import { Event } from "../Structures/Classes/Event";
import chalk from "chalk";

export default new Event("ready", (client) => {
  console.log(
    `${chalk.whiteBright.bold(
      `[ ${chalk.yellowBright.bold("Client")} ]`
    )} Logged in as: ${client.user.tag}`
  )
})