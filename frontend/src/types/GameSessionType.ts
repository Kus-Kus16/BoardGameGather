import type { BoardGameTypeFull } from "./BoardGameType.ts";
import type {UserType} from "./UserType.ts";
import type {VoteType} from "./VoteType.ts";

interface GameSessionTypeBasic {
    title: string;
    date: string;
    numberOfPlayers: number;
    description: string;
}

export interface GameSessionTypeAdd extends GameSessionTypeBasic {
    boardGamesIds: number[];
}

export interface GameSessionTypeFull extends GameSessionTypeBasic {
  id: number;

  ownerId: number;
  participants: UserType[];

  selectedBoardGameId?: number;
  boardGames: BoardGameTypeFull[];

  votes: VoteType[];
}