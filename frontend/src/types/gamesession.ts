import type { BoardGameType } from "./boardgame";
import type {User} from "./user.ts";

export interface GameSessionType {
    id: number;
    date: string;
    playercount: number;
    description: string;
    owner: User;
    boardGame: BoardGameType;
}