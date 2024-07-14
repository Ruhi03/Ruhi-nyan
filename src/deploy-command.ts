import { REST, Routes } from "discord.js";
import commands from "./commands";
import logger from "./logger";

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  logger.error("Token or Client ID not found in environment variables.");
  setTimeout(() => {
    process.exit(1);
  }, 1000);
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

  const commandNames = commandsInJson.map((command) => command.name);
  logger.info(`Deployed commands:\n${commandNames}`);
} catch (error) {
  logger.error(error);
}
