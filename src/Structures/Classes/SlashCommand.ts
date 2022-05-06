import { SlashCommandType } from "../Types/SlashCommand"

export class SlashCommand {
  constructor(options: SlashCommandType) {
    Object.assign(this, options)
  }
}