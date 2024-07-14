import { Client, Events, GatewayIntentBits } from "discord.js";
import logger from "./logger";
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

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.DISCORD_TOKEN);
