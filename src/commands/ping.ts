import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import BotSlashCommand from "../classes/BotSlashCommand";

const command = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply("Pong!");
};

export default new BotSlashCommand(command, execute);
