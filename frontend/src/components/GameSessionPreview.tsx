import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    Button,
    Tooltip,
    Stack,
    Alert,
    CardActions,
    Chip
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type {GameSessionTypeFull} from "../types/GameSessionType.ts";
import {useContext, useState} from "react";
import {AuthContext} from "../auth/AuthContext.tsx";
import GameSessionActionButtons from "./GameSessionActionButtons.tsx";

export default function GameSessionPreview({ session }: { session: GameSessionTypeFull }) {
    const auth = useContext(AuthContext);
    const [error, setError] = useState("");

    const isPastSession = new Date(session.date) < new Date();
    const isParticipant = session.participants
        .find((u) => u.username === auth.username) != null;
    const isFull = session.participants.length >= session.numberOfPlayers;
    const isDisabled = isPastSession || isParticipant || isFull || !auth.isAuthenticated;

    // Todo Change after new api
    let selectedBoardGame
    selectedBoardGame = session.boardGame;
    // selectedBoardGame.imageUrl = "https://picsum.photos/id/870/200/300?grayscale&blur=2"
    // const selectedBoardGame = session.boardGames.find(
    //     (bg) => bg.id === session.selectedBoardGameId
    // );

    const getJoinTooltip = () => {
        if (!auth.isAuthenticated) {
            return "Musisz być zalogowany, aby dołączyć do sesji";
        }
        if (isPastSession) {
            return "Sesja już się odbyła";
        }
        if (isParticipant) {
            return "Już bierzesz udział w tej sesji";
        }
        if (isFull) {
            return "Sesja jest pełna";
        }
        return "";
    };

    return (
        <Card
            sx={{ display: "flex", width: "100%", minHeight: 100, mb: 2 }}
        >
            <CardActionArea
                component={RouterLink}
                to={`/sessions/${session.id}`}
                sx={{ display: "flex", alignItems: "stretch", flex: 1 }}
            >

                <CardContent sx={{ flex: 1 }}>
                    <Stack spacing={1}>
                        <Typography variant="h5">
                            {session.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {new Date(session.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pozostałe miejsca: {session.numberOfPlayers - session.participants.length}
                        </Typography>
                        {selectedBoardGame && (
                            <Typography variant="h6">
                                {selectedBoardGame.title}
                            </Typography>
                        )}
                    </Stack>
                </CardContent>

                <Stack spacing={2}
                    sx={{
                        width: 300,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/*{isPastSession && (*/}
                    {/*    <Chip color="warning" label="Sesja już się odbyła" sx={{ width: "85%" }}/>*/}
                    {/*)}*/}

                    {/*{selectedBoardGame ? (*/}
                    {/*    <Chip color="success" label="Gra wybrana" sx={{ width: "85%" }}/>*/}
                    {/*) : (*/}
                    {/*    <Chip color="info" label="Głosowanie aktywne" sx={{ width: "85%" }}/>*/}
                    {/*)}*/}

                    {/*{error && (*/}
                    {/*    <Chip color="error" label={error} sx={{ width: "85%" }}/>*/}
                    {/*)}*/}
                    {isPastSession && (
                        <Alert severity="warning" sx={{ width: "85%" }}>
                            Sesja już się odbyła
                        </Alert>
                    )}

                    {selectedBoardGame ? (
                        <Alert severity="success" sx={{ width: "85%" }} >
                            Gra wybrana
                        </Alert>
                    ) : (
                        <Alert severity="info" sx={{ width: "85%" }}>
                            Głosowanie aktywne
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ width: "85%" }}>
                            {error}
                        </Alert>
                    )}
                </Stack>
            </CardActionArea>
            <CardActions>
                <Box display="flex" alignItems="center" p={2}>
                    <GameSessionActionButtons session={session} setError={setError}/>
                </Box>
            </CardActions>
        </Card>
    );
};
