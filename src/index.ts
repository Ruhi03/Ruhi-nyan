import { Client, Events, GatewayIntentBits } from "discord.js";
import logger from "./logger";
import commands from "./commands";
import "dotenv/config";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

if (!process.env.DISCORD_TOKEN) {
  logger.error(
    "No token provided. Please provide a token in the DISCORD_TOKEN environment variable."
  );
}

client.on(Events.ClientReady, (client) => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  for (let i = 0; i < commands.length; i += 1) {
    const command = commands[i];

    if (interaction.commandName === command.command.name) {
      try {
        await command.execute(interaction);
      } catch (error) {
        logger.error(error);
        await interaction.reply({
          content: "명령어를 실행하는 도중 오류가 발생했습니다.",
          ephemeral: true,
        });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
