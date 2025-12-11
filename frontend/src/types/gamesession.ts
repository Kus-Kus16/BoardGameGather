import type { BoardGame } from "./boardgame";

export type GameSessionType = {
    id: number;
    data: string;
    playercount: number;
    description: string;
    owner: string;
    boardgame: BoardGame;
};