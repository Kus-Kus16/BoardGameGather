import type { BoardGameType } from "../../types/boardgame";


export default function BoardGamePreview({ boardGame }: { boardGame: BoardGameType }) {

    return (
        <a href={`/boardgames/${boardGame.id}`} style={{textDecoration: "none"}}>
            <div className="board-game-preview" style={{ border: "1px solid black" }}>
                <h3>{boardGame.title}</h3>
                <p>Players: {boardGame.minPlayers} - {boardGame.maxPlayers}</p>
            </div>
        </a>
    )
}
