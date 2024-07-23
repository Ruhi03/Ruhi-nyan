import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { unlinkSync } from "fs";
import sanitize from "sanitize-filename";
import BotSlashCommand from "../classes/BotSlashCommand";
import downloadAudio from "../utils/youtube/downloadAudio";
import uploadFile from "../utils/s3/uploadFile";
import logger from "../logger";

import type {
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
} from "discord.js";

const command = new SlashCommandBuilder()
  .setName("다운로드")
  .setDescription("유튜브 영상의 음원을 다운로드합니다.")
  .addStringOption((option) => {
    return option
      .setName("링크")
      .setDescription("유튜브 영상 URL")
      .setRequired(true);
  });

const execute = async (interaction: ChatInputCommandInteraction) => {
  const link = interaction.options.getString("링크");

  logger.info(
    `${interaction.commandName}: ${interaction.user.username} ${
      interaction.guild?.name
    }#${(interaction.channel as GuildTextBasedChannel)?.name} ${link}`
  );

  await interaction.deferReply();

  if (!link) {
    return interaction.editReply("링크를 입력해주세요.");
  }

  const filename = `${crypto.randomUUID()}.mp3`;
  const filepath = `temp/${filename}`;

  const metadata = await downloadAudio(link, filepath);
  logger.info(`Downloaded: ${metadata.title}`);

  const uploadFileName = sanitize(`${metadata.title}.mp3`);
  await uploadFile(filepath, uploadFileName);

  const s3Link = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`;
  const downloadLink = `${s3Link}/${encodeURIComponent(uploadFileName)}`;
  logger.info(`Uploaded to S3: ${downloadLink}`);

  const button = new ButtonBuilder()
    .setLabel("다운로드")
    .setURL(downloadLink)
    .setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  await interaction.editReply({
    content: metadata.title,
    components: [row],
  });

  unlinkSync(filepath);
};

export default new BotSlashCommand(command, execute);
