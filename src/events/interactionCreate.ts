import { Events, MessageFlags } from 'discord.js';
import { BotEvent } from '@/types/events.js'; // 🌟 경로에 맞게 잘 불러와줘

export const interactionCreate: BotEvent<Events.InteractionCreate> = {
	name: Events.InteractionCreate,
	execute: async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = (interaction.client as any).commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction.client, interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}	
		}
	}
};