import type { BoardGameTypeFull } from "./BoardGameType.ts";
import type {UserType} from "./UserType.ts";
import type {VoteType} from "./VoteType.ts";

export interface GameSessionType {
  id: number;
  title: string;
  date: string;
  numberOfPlayers: number;
  description: string;

  ownerId: number;
  participants: UserType[];

  selectedBoardGameId?: number;
  boardGames: BoardGameTypeFull[];

  votes: VoteType[];
}

/*
* Dla listowania: Tytuł, Data, pozostałe miejsca, Stan sesji: {wybrana planszówka/głosowanie aktywne}
* Dla detailsów: -||- oraz opis, właściciel, lista graczy, lista gier z możliwością głosowania, wyniki głosowania,
*   przyciski: dołącz/opuść
* */