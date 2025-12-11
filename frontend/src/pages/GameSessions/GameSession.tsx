import type { GameSessionType } from '../../types/gamesession'

export default function GameSession({ session }: { session: GameSessionType }) {

    const handleJoinSession = () => {
        // TODO
    }

    return (
        <div className="board-game-preview" style={{ border: "1px solid black" }}>
            <h3>{session.boardgame.title}</h3>
            <p>Players: {session.boardgame.minPlayers} - {session.boardgame.maxPlayers}</p>
            <button onClick={handleJoinSession}>Join</button>
        </div>
    )
}
