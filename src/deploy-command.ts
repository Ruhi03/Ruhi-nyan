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
  logger.info("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(clientId), {
    body: commandsInJson,
  });

  logger.info("Successfully reloaded application (/) commands.");

  logger.info(`Deployed commands:`);
  commands.forEach((command) => {
    logger.info(`- ${command.command.name}`);
  });
} catch (error) {
  logger.error(error);
}
