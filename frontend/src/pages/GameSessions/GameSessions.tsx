import { useEffect, useState } from "react";
import type { GameSessionType } from "../../types/gamesession";
import GameSession from "./GameSession";

export default function GameSesions() {

  const [gameSessions, setGameSessions] = useState<GameSessionType[]>([]);
  const [error, setError] = useState<string | null>(null);
    useEffect(() => {

    const loadGameSessions = async () => {
      try {
        const response = await fetch('http://localhost:8080/sessions');
        if (!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        setGameSessions(data);
      } catch (err) {
        setError("Failed to load game sessions");
        console.error(err);
      }
    };

    loadGameSessions();
  }, []);

  return (
    <>
      {error ? (<div>{error}</div>) : 
        (<div>
          {gameSessions.map((session) => (
            <GameSession
              key={session.id}
              session={session}
            />
          ))}
        </div>)
      }
    </>
  )
  }
