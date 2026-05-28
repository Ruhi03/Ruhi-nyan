import dotenv from "dotenv";
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { commands } from './src/commands/index.js';
import { events } from './src/events/index.js';

// .env 파일 로드
dotenv.config();

// 디스코드 클라이언트 생성
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// 명령어 로드
(client as any).commands = new Collection();
for (const command of commands) {
    (client as any).commands.set(command.name, command);
}
console.log(`[시스템] ${commands.length}개의 명령어를 client.commands에 장전 완료のだ! 🔫`);

// 이벤트 로드
for (const event of events) {
    if (event.once) {
        client.once(event.name as any, (...args: any[]) => (event as any).execute(...args));
    } else {
        client.on(event.name as any, (...args: any[]) => (event as any).execute(...args));
    }
}
console.log(`[시스템] ${events.length}개의 이벤트를 귀 기울여 듣기 시작했어のだ! 👂`);

// 디스코드 봇 로그인
client.login(process.env.DISCORD_TOKEN);