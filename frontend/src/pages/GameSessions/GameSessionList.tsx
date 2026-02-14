import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Divider,
    CircularProgress,
    Alert,
    Stack,
} from "@mui/material";
import { useNavigate, } from "react-router-dom";
import api from "../../api/axios";
import type { GameSessionTypePreview } from "../../types/GameSessionType.ts";
import GameSessionPreview from "../../components/GameSessionPreview.tsx";
import AddElementCard from "../../components/AddElementCard.tsx";
import { RefreshContext } from "../../components/RefreshContext.tsx";
import Pagination, {type PaginationInfo} from "../../components/Pagination.tsx";
import GameSessionFilters, {type Filters} from "../../components/GameSessionFilters.tsx";

export default function GameSessionList() {
    const [sessions, setSessions] = useState<GameSessionTypePreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<Filters>({});

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>()

    const navigate = useNavigate();

    const fetchGameSessions = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await api.get<{
                content: GameSessionTypePreview[];
                first: boolean;
                last: boolean;
                number: number;
                numberOfElements: number;
                size: number;
                totalElements: number;
                totalPages: number;
            }>('/sessions/filter', {
                params: {
                    ...filters,
                    page,
                    size
                }
            });

            setSessions(data.content);
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
            setError("Nie udało się pobrać listy sesji.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGameSessions().then();
    }, [page, size, filters]);

    return (
        <RefreshContext.Provider value={{ refresh: fetchGameSessions }}>
            <Box sx={{ m: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Sesje gier
                </Typography>
                <Divider />
            </Box>

            <Box sx={{ m: 3 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error">{error}</Alert>
                )}

                {!loading && !error && (
                    <Stack spacing={3}>

                        <GameSessionFilters filters={filters} setFilters={setFilters} setPage={setPage}/>

                        <AddElementCard
                            title="Dodaj nową sesję"
                            onClick={() => navigate("/sessions/new")}
                        />

                        {sessions.map(session => (
                            <GameSessionPreview key={session.id} session={session} />
                        ))}

                        {paginationInfo && (
                            <Pagination setPage={setPage} setSize={setSize} info={paginationInfo}/>
                        )}
                    </Stack>
                )}
            </Box>
        </RefreshContext.Provider>
    );
}
