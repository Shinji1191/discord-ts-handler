import {
  PermissionResolvable,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ChatInputApplicationCommandData,
  GuildMember,
} from "discord.js";
import { ExtendedClient } from "../ExtendedClient";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type Run = (options: RunOptions) => any;

export type SlashCommandType = {
  category: string;
  examples?: string[];
  devCommand?: boolean;
  guildCommand?: boolean;
  nsfwCommand?: boolean;
  ownerCommand?: boolean;
  userPermissions?: PermissionResolvable[];
  myPermissions?: PermissionResolvable[];
  run: Run;
} & ChatInputApplicationCommandData;
