import { PermissionResolvable } from "discord.js";

export function nicerPermissions(permission: string) {
  return permission.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
}