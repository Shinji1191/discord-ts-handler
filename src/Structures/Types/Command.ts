import { Message, PermissionResolvable } from "discord.js";
import { ExtendedClient } from "../ExtendedClient";

interface RunOptions {
  client: ExtendedClient;
  message: Message;
  args: string[];
}

type Run = (options: RunOptions) => any;

export type CommandType = {
  name: string;
  description: string;
  category: string;
  aliases?: string[];
  examples?: string[];
  devCommand?: boolean;
  guildCommand?: boolean;
  nsfwCommand?: boolean;
  ownerCommand?: boolean;
  userPermissions?: PermissionResolvable[]
  myPermissions?: PermissionResolvable[]
  run: Run
};
