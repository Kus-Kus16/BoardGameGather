import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    Button,
    Tooltip,
    Stack,
    Alert
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type {GameSessionType} from "../types/GameSessionType.ts";
import {useContext} from "react";
import {AuthContext} from "../auth/AuthContext.tsx";

export default function GameSessionPreview({ session }: { session: GameSessionType }) {
    const auth = useContext(AuthContext);

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
            return "Musisz być zalogowany, aby dołączyć";
        }
        if (isPastSession) {
            return "Ta sesja już się odbyła";
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
                        m: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {isPastSession && (
                        <Alert severity="warning" sx={{ width: "100%" }}>
                            Sesja już się odbyła
                        </Alert>
                    )}

                    {selectedBoardGame ? (
                        <Alert severity="success" sx={{ width: "100%" }} >
                            Gra wybrana
                        </Alert>
                    ) : (
                        <Alert severity="info" sx={{ width: "100%" }}>
                            Głosowanie aktywne
                        </Alert>
                    )}
                </Stack>

                <Box display="flex" alignItems="center" p={2}>
                    <Tooltip
                        title={getJoinTooltip()}
                    >
                        <span>
                            <Button
                              size="large"
                              variant={isDisabled ? "outlined" : "contained"}
                              color="primary"
                              component={RouterLink}
                              to={`/sessions/join/${session.id}`}
                              disabled={isDisabled}
                            >
                            Dołącz
                            </Button>
                        </span>
                    </Tooltip>
                </Box>

            </CardActionArea>

        </Card>
    );
};
