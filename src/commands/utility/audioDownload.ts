import {
    Client,
    CommandInteraction,
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";
import fs from 'fs';

// 외부 유틸리티 함수들은 실제 경로에 맞게 임포트 해주세요.
import { download } from '@/utils/download.js';
import { encode } from '@/utils/encode.js';
import { upload } from '@/utils/upload.js';

// 정의해주신 SlashCommand 타입을 불러옵니다.
import { SlashCommand } from "@/types/slashCommand.js";

export const audioDownloadCommand: SlashCommand = {
    name: '다운로드',
    description: '빠르게 유튜브 영상을 음원으로 추출 합니다 !',

    // SlashCommandBuilder 대신 객체 배열 형태로 옵션을 정의합니다.
    options: [
        {
            name: '링크',
            description: '유튜브 링크를 넣어주세요 !',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    // 인터페이스 규격에 맞춰 client와 interaction을 매개변수로 받습니다.
    execute: async (client: Client, interaction: CommandInteraction) => {
        // TypeScript 에러 방지: getString()을 쓰기 위해 ChatInputCommandInteraction으로 타입 단언
        const chatInteraction = interaction as ChatInputCommandInteraction;
        const 링크 = chatInteraction.options.getString('링크');

        if (!링크) return;

        console.log('--------------------');
        console.log(`서버: ${chatInteraction.guild?.name}`);
        console.log(`사용자: ${chatInteraction.user.username}`);

        // 답글 대기
        await chatInteraction.deferReply();

        try {
            // 노래 제목 확인 및 다운로드
            const videoTitle = await download(링크);

            // 노래 webm => mp3 인코딩
            await encode(videoTitle);

            // aws S3에 업로드
            const downloadLink = await upload(videoTitle);

            // 버튼 추가
            const button = new ButtonBuilder()
                .setLabel('다운로드')
                .setURL(downloadLink)
                .setStyle(ButtonStyle.Link);

            // TypeScript에서는 제네릭으로 어떤 컴포넌트가 들어가는지 명시해주는 것이 좋습니다.
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(button);

            // 대기 해제 및 답글 전송
            await chatInteraction.editReply({
                content: '다운로드가 완료되었습니다!',
                components: [row],
            });

            // 다운 및 인코딩 한 파일 제거
            fs.unlinkSync(`./${videoTitle}.webm`);
            fs.unlinkSync(`./${videoTitle}.mp3`);

            console.log('--------------------');
        } catch (error) {
            console.error('다운로드 중 에러 발생:', error);
            await chatInteraction.editReply({ content: '처리 중 오류가 발생했습니다 ㅠㅠ' });
        }
    }
};