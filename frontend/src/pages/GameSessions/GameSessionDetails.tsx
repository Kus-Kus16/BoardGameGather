import {useContext, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, CardActions, CircularProgress, Alert, Stack } from "@mui/material";
import api from "../../api/axios";
import {AuthContext} from "../../auth/AuthContext.tsx";
import type {GameSessionTypeFull} from "../../types/GameSessionType.ts";
import GameSessionInfo from "../../components/GameSessionInfo.tsx";
import BoardGamePreview from "../../components/BoardGamePreview.tsx";
import GameSessionActionButtons from "../../components/GameSessionActionButtons.tsx";

export default function GameSessionDetails() {
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<GameSessionTypeFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchGameSession = async () => {
            try {
                const { data } = await api.get<GameSessionTypeFull>(`/sessions/${id}`);
                setSession(data);
            } catch {
                setError("Nie udało się pobrać danych sesji.");
            } finally {
                setLoading(false);
            }
        };

        fetchGameSession().then();
    }, [id, auth.username]);

    if (!session && error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
        {session && (
            <Stack direction="column" spacing={5}>
                <Card sx={{ p: 2 }}>
                    <CardContent>
                        <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="start">
                            <Stack sx={{ maxWidth: "60%" }} spacing={2}>
                                <GameSessionInfo session={session} />

                                {error && (
                                    <Alert severity="error" sx={{mb: 2}}>
                                        {error}
                                    </Alert>
                                )}
                            </Stack>

                            <Stack direction="column" spacing={3}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <BoardGamePreview boardGame={session.boardGame} showActions={false}/>
                                </Box>
                                <CardActions sx={{ justifyContent: "flex-end", p: 0}}>
                                    <GameSessionActionButtons session={session} setError={setError}/>
                                </CardActions>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Card sx={{ p: 2 }}>
                    <CardContent>
                        {/*<VotingSection session={session}/>*/}
                    </CardContent>
                </Card>
            </Stack>
        )}
        </>
    );
}
