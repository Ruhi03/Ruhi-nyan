import { ActionRowBuilder, ButtonBuilder, ButtonStyle,SlashCommandBuilder } from 'discord.js';
import ytdl from 'ytdl-core';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from 'fs';
import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config({
	path: '.env'
});

const s3 = new S3Client({ region: "ap-northeast-2" })

export const data = new SlashCommandBuilder()
    .setName('다운로드')
    .setDescription('빠르게 유튜브 영상을 음원으로 추출 합니다 !')
    .addStringOption(option =>
        option.setName('링크')
        .setDescription('유튜브 링크를 넣어주세요 !')
        .setRequired(true)
    )

export async function execute(interaction) {
    const 링크 = interaction.options.getString('링크');

    console.log('--------------------')
    console.log(`서버: ${interaction.guild.name}`)
    console.log(`사용자: ${interaction.user.username}`)

    // 답글 대기
    await interaction.deferReply();

    // 노래 제목 확인 및 다운로드
    const videoTitle = await download(링크);

    // 노래 webm => mp3 인코딩
    await encode(videoTitle);

    // asw S3에 업로드
    const downloadLink = await upload(videoTitle);

    // 버튼 추가
    const button = new ButtonBuilder()
        .setLabel('다운로드')
        .setURL(downloadLink)
        .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder()
		.addComponents(button);

    // 대기 해제 및 답글 전송
    await interaction.editReply({
        content: '',
        components: [row],
    });

    // 다운 및 인코딩 한 파일 제거
    fs.unlinkSync(`./${videoTitle}.webm`);
    fs.unlinkSync(`./${videoTitle}.mp3`);

    console.log('--------------------')
}

function download(url) {
    const options = {
        filter: 'audioonly',
        quality: 'highestaudio'
    };

    return new Promise((resolve, reject) => {
        ytdl.getInfo(url, options)
            .then((info) => {
                const videoTitle = info.videoDetails.title.replace(/<|>|:|"|\/|\\|\||\?|\*|^COM[0-9]$|^LPT[0-9]$|^CON$|^PRN$|^AUX$|^NUL$/gm, "-");
                const video = ytdl(url, options)
                    
                video.pipe(fs.createWriteStream(`./${videoTitle}.webm`))
                    
                video.on('end', () => {
                    console.log(`노래제목: ${videoTitle}`)
                    console.log('다운로드 완료');
                    resolve(videoTitle);
                });
            })
            .catch((err) => {
                console.error('비디오 정보를 가져오는 중 오류 발생:', err);
                reject(err);
            })
    })
}

async function encode(videoTitle) {
    return new Promise((resolve, reject) => {
        const encodingAudio = spawn("./ffmpeg", ["-i", `./${videoTitle}.webm`, `./${videoTitle}.mp3`])

        encodingAudio.on('exit', () => {
            console.log('인코딩 완료');
            resolve(encodingAudio);
        })

        encodingAudio.on('error', (err) => {
            console.error(err);
            reject(err);
        })
    })
}

function upload(videoTitle) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(`./${videoTitle}.mp3`);

        fileStream.on('error', function (err) {
            console.log('File Error', err);
            reject(err);
        });

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: videoTitle + '.mp3',
            Body: fileStream
        };

        s3.send(new PutObjectCommand(uploadParams))
            .then(() => {
                console.log('업로드 완료');
                resolve(`https://ruhi-nyan.s3.ap-northeast-2.amazonaws.com/${encodeURIComponent(videoTitle)}.mp3`);
            })
            .catch((err) => {
                console.log("Error", err);
                reject(err);
            })
    })
}