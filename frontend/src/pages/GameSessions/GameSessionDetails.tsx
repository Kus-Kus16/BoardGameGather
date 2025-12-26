import {useContext, useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardMedia, CardContent, CardActions, Button, CircularProgress, Alert, Stack, Tooltip, Grid, Divider } from "@mui/material";
import type {BoardGameTypeFull} from "../../types/BoardGameType.ts";
import api from "../../api/axios";
import {Link as RouterLink} from "react-router";
import {AuthContext} from "../../auth/AuthContext.tsx";
import {ImageNotSupported} from "@mui/icons-material";
import type {GameSessionType} from "../../types/GameSessionType.ts";
import GameSessionInfo from "../../components/GameSessionInfo.tsx";
import BoardGamePreview from "../../components/BoardGamePreview.tsx";

export default function GameSessionDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<GameSessionType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchGameSession = async () => {
            try {
                const { data } = await api.get<GameSessionType>(`/sessions/${id}`);
                setSession(data);
            } catch {
                setError("Nie udało się pobrać danych sesji.");
            } finally {
                setLoading(false);
            }
        };

        fetchGameSession().then();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!session) {
        setError("Nie znaleziono sesji o podanym ID");
        return null;
    }

    return (
        <Card sx={{ p: 2 }}>
            <CardContent>
                <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ maxWidth: "60%" }}>
                        <GameSessionInfo session={session} />
                    </Box>

                    <BoardGamePreview boardGame={session.boardGame} showActions={false}/>
                </Stack>
            </CardContent>

            <Divider />

            {/* Voting */}
            {/*<CardContent>*/}
            {/*    <VotingSection session={session} />*/}
            {/*</CardContent>*/}

            <Divider />

            <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                <Button variant="contained">
                    Dołącz
                </Button>
                <Button variant="outlined" color="error">
                    Opuść
                </Button>
            </CardActions>
        </Card>
    );
}
