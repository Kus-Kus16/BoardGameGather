interface BoardGameTypeBasic {
    description?: string;
    minutesPlaytime: number;
}

export interface BoardGameTypeUpdate extends BoardGameTypeBasic {
    removeImage: boolean;
    removeRulebook: boolean;
}

export interface BoardGameTypeCreate extends BoardGameTypeBasic {
    title: string;
    minPlayers: number;
    maxPlayers: number;
}

export interface BoardGameTypeFull extends BoardGameTypeCreate {
    id: number;
    discontinued: boolean;
    imageUrl?: string;
    rulebookUrl?: string;
}

