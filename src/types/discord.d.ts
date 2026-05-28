import { Collection } from 'discord.js';

declare module 'discord.js' {
    export interface Client {
        // 우리가 client.commands 에 명령어들을 담을 거라는 걸 알려주는 마법!
        commands: Collection<string, any>;
    }
}