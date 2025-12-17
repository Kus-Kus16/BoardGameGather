import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import type { GameSessionType } from "../../types/gamesession";
import { AuthContext } from "../../context/AuthContext";

export default function GameSessionInsight() {

    const auth = useContext(AuthContext);

    const { id } = useParams<{ id: string }>();

    const [gameSession, setGameSession] = useState<GameSessionType | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getGameSession = async () => {
            try {
                const response = await fetch(`http://localhost:8080/sessions/${id}`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setGameSession(data);
            } catch (err) {
                setError("Something went wrong");
                console.log(err); 
            }
        };

        getGameSession();
    }, [id]);

    const handleJoinSession = async () => {
        try {
            const formData = { username: auth?.username };

            console.log(formData);
            

            const response = await fetch(`http://localhost:8080/sessions/${id}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error('Failed to join session')

            alert('Session joined successfully!')
        } catch (err) {
            console.log(err);
            alert('An error occurred while joining the session.');
        }
    }

    return (
        <div>
            {gameSession === null ? <p>{error}</p> : 
            <div>
                <h1>Sesja: {gameSession.boardGame.title}</h1>
                <p>Players: {gameSession.boardGame.minPlayers} - {gameSession.boardGame.maxPlayers}</p>
                <p>Date: {new Date(gameSession.date).toLocaleDateString()}</p>
                <p>Time: {gameSession.boardGame.minutesPlaytime} minutes</p>
                <p>Description: {gameSession.boardGame.description}</p>
                <p>Owner: {gameSession.owner.username}</p>
                <p>Participants: {gameSession.participants.length}/{gameSession.numberOfPlayers}</p>
                <ul>
                    {gameSession.participants.map((participant) => (
                        <li key={participant.id}>{participant.username}</li>
                    ))}
                </ul>
                <button onClick={handleJoinSession}>Join</button>
            </div>
            }
        </div>
    )
}
