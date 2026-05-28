import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

export type SlashCommand = ChatInputApplicationCommandData & {
    name: string;
    description: string;
    execute: (client: Client, interaction: CommandInteraction) => Promise<void> | void;
} 