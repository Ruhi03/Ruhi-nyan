import { ClientEvents } from "discord.js";

export interface BotEvent<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (...args: ClientEvents[K]) => Promise<void> | void;
}