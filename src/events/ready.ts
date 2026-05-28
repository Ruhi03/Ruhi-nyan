import { Events } from 'discord.js';
import { commands } from '@/commands/index.js';
import { BotEvent } from '@/types/events.js';

export const ready: BotEvent<Events.ClientReady> = {
	name: Events.ClientReady,
	once: true,
	execute: async (client) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		if (client.application) {
			await client.application.commands.set(commands);
			console.log("info: command registeredのだ!");
		}
	}
};