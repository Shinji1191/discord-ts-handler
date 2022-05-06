import { CommandType } from "../Types/Command"

export class Command {
  constructor(options: CommandType) {
    Object.assign(this, options)
  }
}