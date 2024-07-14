import { REST, Routes } from "discord.js";
import commands from "./commands";
import logger from "./logger";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  logger.error("Token or Client ID not found in environment variables.");
  process.exit(1);
}

const commandsInJson = commands.map((command) => {
  if (!command.command || !command.execute) {
    logger.error("Command is missing command or execute function.");
    process.exit(1);
  } else {
    return command.command.toJSON();
  }
});

const rest = new REST({ version: "10" }).setToken(token);

try {
  const isProduction = process.env.NODE_ENV === "production";
  const guildId = process.env.TO_REGISTER_GUILD;

  if (!isProduction) {
    logger.warn("Using guild commands deployment in development mode.");
    if (!guildId) {
      logger.error("Guild ID not found in environment variables.");
      process.exit(1);
    }
  }

  logger.info("Started refreshing application (/) commands.");

  if (!isProduction && guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandsInJson,
    });
  } else {
    await rest.put(Routes.applicationCommands(clientId), {
      body: commandsInJson,
    });
  }

  logger.info("Successfully reloaded application (/) commands.");

  logger.info(`Deployed commands:`);
  commands.forEach((command) => {
    logger.info(`- ${command.command.name}`);
  });
} catch (error) {
  logger.error(error);
}
