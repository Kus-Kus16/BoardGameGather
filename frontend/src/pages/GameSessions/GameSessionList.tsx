import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Divider,
    CircularProgress,
    Alert,
    Stack,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import api from "../../api/axios"
import type {GameSessionType} from "../../types/GameSessionType.ts";
import GameSessionPreview from "../../components/GameSessionPreview.tsx";
import AddElementCard from "../../components/AddElementCard.tsx";

export default function GameSessionList() {
    const [sessions, setSessions] = useState<GameSessionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameSessions = async () => {
            try {
                const { data } = await api.get<GameSessionType[]>('/sessions');
                setSessions(data);
            } catch {
                setError("Nie udało się pobrać listy gier.");
            } finally {
                setLoading(false);
            }
        };

        fetchGameSessions().then();
    }, []);

    return (
        <Box>
            <Box sx={{p: 3}}>
                <Typography variant="h4" gutterBottom>
                    Sesje gier
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
                    <Stack spacing={3}>
                        <AddElementCard title={"Dodaj nową sesję"}
                                        onClick={() => navigate("/sessions/new")}/>

                        {sessions.map((session) => (
                            <GameSessionPreview session={session}/>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );
}
