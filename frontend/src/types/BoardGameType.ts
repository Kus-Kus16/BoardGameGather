export interface BoardGameTypeAdd {
    title: string;
    description?: string;
    minPlayers: number;
    maxPlayers: number;
    minutesPlaytime: number;
}

export interface BoardGameTypeFull extends BoardGameTypeAdd {
    id: number;
    discontinued: boolean;
    imageUrl?: string;
    rulebookUrl?: string;
}

