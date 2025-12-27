import {useContext, useEffect, useState} from "react";
import {
    Box,
    Typography,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";
import api from "../../api/axios"
import type {GameSessionTypeFull} from "../../types/GameSessionType.ts";
import GameSessionPreview from "../../components/GameSessionPreview.tsx";
import {AuthContext} from "../../auth/AuthContext.tsx";

export default function GameSessionListUser() {
    const auth = useContext(AuthContext);
    const [sessions, setSessions] = useState<GameSessionTypeFull[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGameSessions = async (username: string | null) => {
            try {
                const { data } = await api.get<GameSessionTypeFull[]>('/sessions', {
                    params: {
                        username: username,
                    }
                });
                setSessions(data);
            } catch {
                setError("Nie udało się pobrać listy gier.");
            } finally {
                setLoading(false);
            }
        };

        if (auth.isAuthenticated) {
            fetchGameSessions(auth.username).then();
        } else {
            setError("Nie jesteś zalogowany");
        }
    }, [auth.isAuthenticated, auth.username]);

    return (
        <Box>
            <Box sx={{p: 3}}>
                <Typography variant="h4" gutterBottom>
                    Twoje sesje
                </Typography>
                <Divider />
            </Box>

            <Box sx={{ p: 3 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <Box>
                        {sessions.map((session) => (
                            <GameSessionPreview key={session.id} session={session}/>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
