import { ExtendedClient } from "../ExtendedClient";
import { ClientEvents } from "discord.js"

export class Event<Key extends keyof ClientEvents> {
  constructor(
    public event: Key,
    public run: (client: ExtendedClient, ...args: ClientEvents[Key]) => any
  ) {}
}