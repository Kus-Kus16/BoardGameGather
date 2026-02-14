import { useEffect, useState } from "react";
import { Grid, Box, Typography, Divider, CircularProgress, Alert, Stack } from "@mui/material";
import BoardGamePreview from "../../components/BoardGamePreview.tsx";
import type { BoardGameTypeDetails } from "../../types/BoardGameType.ts";
import {useNavigate} from "react-router-dom";
import api from "../../api/axios"
import AddElementCard from "../../components/AddElementCard.tsx";
import Pagination, {type PaginationInfo} from "../../components/Pagination.tsx";

export default function BoardGameList() {
    const [boardGames, setBoardGames] = useState<BoardGameTypeDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>()

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoardGames = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get<{
                    content: BoardGameTypeDetails[];
                    first: boolean;
                    last: boolean;
                    number: number;
                    numberOfElements: number;
                    size: number;
                    totalElements: number;
                    totalPages: number;
                }>(`/boardgames?page=${page}&size=${size}`);

                setBoardGames(data.content);
                setPaginationInfo({
                    first: data.first,
                    last: data.last,
                    number: data.number,
                    numberOfElements: data.numberOfElements,
                    size: data.size,
                    totalElements: data.totalElements,
                    totalPages: data.totalPages
                });
            } catch {
                setError("Nie udało się pobrać listy gier.");
            } finally {
                setLoading(false);
            }
        };

        fetchBoardGames().then();
    }, [page, size]);
    
    return (
        <Box>
            <Box sx={{m: 3}}>
                <Typography variant="h4" gutterBottom>
                    Gry planszowe
                </Typography>
                <Divider />
            </Box>
            <Box sx={{ m: 3, mb: 0 }}>
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
                    <Stack spacing={3} direction={"column"}>
                        <Grid container spacing={3} columns={10}>
                            <Grid size={{ xs: 10, sm: 5, md: 2 }}>
                                <AddElementCard title={"Dodaj nową grę"}
                                                onClick={() => navigate("/boardgames/new")}
                                                minWidth={200} maxWidth={345}
                                />
                            </Grid>

                            {boardGames.map((game) => (
                                <Grid key={game.id} size={{ xs: 10, sm: 5, md: 2 }}>
                                    <BoardGamePreview boardGame={game} showActions={true} />
                                </Grid>
                            ))}
                        </Grid>

                        {paginationInfo && (
                            <Pagination setPage={setPage} setSize={setSize} info={paginationInfo}/>
                        )}
                    </Stack>
                )}
            </Box>
        </Box>
    );
}
