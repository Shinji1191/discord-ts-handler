import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, Message, MessageEmbed, TextChannel } from "discord.js";
import mongoose from "mongoose";
import { botConfig } from "./Config/bot";

// Terminal Colors
import chalk from "chalk";

// Glob and promisify
import { promisify } from "util"
import glob from "glob"

// Promises
const globPromise = promisify(glob)

// Types And Classes
import { CommandType } from "./Types/Command";
import { SlashCommandType } from "./Types/SlashCommand";
import { Event } from "./Classes/Event";

// Interfaces
import { RegisterCommandOptions } from "./Interfaces/RegisterCommands"


export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  slashCommands: Collection<string, SlashCommandType> = new Collection()
  aliases: Collection<string, string> = new Collection()
  config = botConfig
  constructor() {
    super({
      intents: [
        "DIRECT_MESSAGES",
        "GUILDS",
        "GUILD_BANS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_PRESENCES",
        "GUILD_VOICE_STATES",
      ],
    });
  }

  start() {
    console.clear()
    this.login(this.config.token)
    this.loadFiles()
  }

  private async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  private async loadCommands({ commands, guildID }: RegisterCommandOptions) {
    if (guildID) {
      this.guilds.cache.get(guildID)?.commands.set(commands);
      console.log(
        `${chalk.whiteBright.bold(
          `[ ${chalk.yellowBright.bold("Client")} ]`
        )} Loaded to: ${chalk.blueBright.bold(
          `${this.guilds.cache.get(guildID).name}`
        )}`
      );
    } else {
      this?.application?.commands.set(commands);
      console.log(
        `${chalk.whiteBright.bold(
          `[ ${chalk.yellowBright.bold("Client")} ]`
        )} Loaded to: ${chalk.blueBright.bold("All Guilds")}`
      );
    }
  }

  private async loadFiles() {
    const commandFiles = await globPromise(`${__dirname}/../Commands/**/*.ts`);
    console.log(`${chalk.white.bold("━".repeat(30))}[ ${chalk.blueBright.bold("Commands")} ]`);
    commandFiles.forEach(async (filePath) => {
      const file: CommandType = await this.importFile(filePath);
      let splitted = filePath.split("/");
      let directory = splitted[splitted.length - 2];

      if (file?.name) {
        let properties = { directory, ...file };
        this.commands.set(file.name, properties);
        console.log(
          `${chalk.whiteBright.bold(
            `[ ${chalk.yellowBright.bold("Command")} ]`
          )} Loaded: ${file.name}`
        );
      } else return;

      if (file.aliases && Array.isArray(file.aliases))
        file.aliases.forEach((alias) => this.aliases.set(alias, file.name));
    });

    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const slashCommandFiles = await globPromise(
      `${__dirname}/../SlashCommands/**/*.ts`
    );
    console.log(`${chalk.white.bold("━".repeat(30))}[ ${chalk.blueBright.bold("Slash Commands")} ]`);
    slashCommandFiles.forEach(async (filePath) => {
      const file: SlashCommandType = await this.importFile(filePath);
      let splitted = filePath.split("/");
      let directory = splitted[splitted.length - 2];

      if (file?.name) {
        let properties = { directory, ...file };
        this.slashCommands.set(file.name, properties);
        slashCommands.push(file);
        console.log(
          `${chalk.whiteBright.bold(
            `[ ${chalk.yellowBright.bold("Command")} ]`
          )} Loaded: ${file.name}`
        );
      } else return;
    });

    const eventFiles = await globPromise(`${__dirname}/../Events/*.ts`);
    console.log(`${chalk.white.bold("━".repeat(30))}[ ${chalk.blueBright.bold("Events")} ]`);
    eventFiles.forEach(async (filePath) => {
      let file: Event<keyof ClientEvents> = await this.importFile(filePath);

      if (file.event) {
        this.on(file.event, file.run.bind(null, this));
        console.log(
          `${chalk.whiteBright.bold(
            `[ ${chalk.yellowBright.bold("Events")} ]`
          )} Loaded: ${file.event}`
        );
      }
    });

    this.on("ready", async () => {
      console.log(`${chalk.white.bold("━".repeat(30))}[ ${chalk.blueBright.bold("Client")} ]`);
      await this.loadCommands({
        commands: slashCommands,
        // guildId: "Guild ID here"
      });

      if (!this.config.mongooseURLConnection) return;

      await mongoose
        .connect(this.config.mongooseURLConnection)
        .then(() =>
          console.log(
            `${chalk.whiteBright.bold(
              `[ ${chalk.blueBright.bold("Client")} ]`
            )} Connection: Connected`
          )
        )
        .catch(() =>
          console.log(
            `${chalk.whiteBright.bold(
              `[ ${chalk.blueBright.bold("Client")} ]`
            )} Connection: Error`
          )
        );
    });
  }
}
