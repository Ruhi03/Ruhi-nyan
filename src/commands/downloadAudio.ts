import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { readFileSync, unlinkSync } from "fs";
import BotSlashCommand from "../classes/BotSlashCommand";
import downloadAudio from "../utils/youtube/downloadAudio";
import uploadFile from "../utils/s3/uploadFile";

import type {
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
} from "discord.js";
import type { Payload } from "youtube-dl-exec";
import logger from "../logger";

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

  const filename = crypto.randomUUID();
  const basename = `${filename}.mp3`;
  const path = `temp/${basename}`;
  const metadataPath = `${path}.info.json`;

  await downloadAudio(link, path);
  const metadata: Payload = JSON.parse(
    readFileSync(metadataPath, { encoding: "utf-8" })
  );
  logger.info(`Downloaded: ${metadata.title}`);

  const uploadFileName = `${metadata.title}.mp3`.replace(
    /<|>|:|"|\/|\\|\||\?|\*/gm,
    "-"
  );
  await uploadFile(path, uploadFileName);

  const downloadLink = `https://${
    process.env.AWS_S3_BUCKET
  }.s3.ap-northeast-2.amazonaws.com/${encodeURIComponent(uploadFileName)}`;
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

  unlinkSync(path);
  unlinkSync(metadataPath);
};

export default new BotSlashCommand(command, execute);
