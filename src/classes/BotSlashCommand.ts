import type {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

export default class BotSlashCommand {
  public command: SlashCommandBuilder;
  public execute: (interaction: ChatInputCommandInteraction) => any;

  constructor(
    command: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction) => any
  ) {
    this.command = command;
    this.execute = execute;
  }
}
