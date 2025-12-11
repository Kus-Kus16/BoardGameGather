import type { BoardGame } from "./boardgame";

export type GameSession = {
    id: number;
    data: string;
    playercount: number;
    description: string;
    owner: string;
    boardgame: BoardGame;
};