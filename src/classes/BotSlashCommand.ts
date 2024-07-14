import type {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

type SlashCommand =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder;
export default class BotSlashCommand {
  public command: SlashCommand;
  public execute: (interaction: ChatInputCommandInteraction) => any;

  constructor(
    command: SlashCommand,
    execute: (interaction: ChatInputCommandInteraction) => any
  ) {
    this.command = command;
    this.execute = execute;
  }
}
