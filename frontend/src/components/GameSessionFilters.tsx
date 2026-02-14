import {Button, Grid, Stack, TextField} from "@mui/material";
import React, {useState} from "react";

export interface Filters {
    username?: string;
    boardGameName?: string;
    maxMinutesPlaytime?: string;
    minNumberOfPlayers?: string;
    maxNumberOfPlayers?: string;
}

interface GameSessionFiltersProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
    setPage: (page: number) => void;
}

export default function GameSessionFilters({ filters, setFilters, setPage }: GameSessionFiltersProps) {
    const [inputFilters, setInputFilters] = useState<Filters>(filters);

    const handleChange = (field: keyof Filters, value: string) => {
        setInputFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(inputFilters);
        setPage(0);
    };

    const handleReset = () => {
        setInputFilters({});
        setFilters({});
        setPage(0);
    };

    return (
        <form onSubmit={handleSubmit} onReset={handleReset}>
            <Grid container spacing={2} columns={28} alignItems="center" >
                <Grid size={{ xs: 14, sm: 7, md: 4}}>
                    <TextField
                        label="Użytkownik"
                        value={inputFilters.username ?? ''}
                        onChange={e => handleChange("username", e.target.value)}
                    />
                </Grid>

                <Grid size={{ xs: 14, sm: 7, md: 4}}>
                    <TextField
                        label="Nazwa gry"
                        value={inputFilters.boardGameName ?? ''}
                        onChange={e => handleChange("boardGameName", e.target.value)}
                    />
                </Grid>

                <Grid size={{ xs: 14, sm: 7, md: 4}}>
                    <TextField
                        type="number"
                        label="Max. czas gry"
                        value={inputFilters.maxMinutesPlaytime ?? ''}
                        onChange={e => handleChange("maxMinutesPlaytime", e.target.value)}
                    />
                </Grid>

                <Grid size={{ xs: 14, sm: 7, md: 4}}>
                    <TextField
                        type="number"
                        label="Min. liczba graczy"
                        value={inputFilters.minNumberOfPlayers ?? ''}
                        onChange={e => handleChange("minNumberOfPlayers", e.target.value)}
                    />
                </Grid>

                <Grid size={{ xs: 14, sm: 7, md: 4}}>
                    <TextField
                        type="number"
                        label="Max. liczba graczy"
                        value={inputFilters.maxNumberOfPlayers ?? ''}
                        onChange={e => handleChange("maxNumberOfPlayers", e.target.value)}
                    />
                </Grid>

                <Grid size={{ xs: 28, sm: 14, md: 8}} justifyItems={"end"}>
                    <Stack direction={"row"} spacing={3}>
                        <Button variant="contained" type={"submit"} size={"large"}>
                            Filtruj
                        </Button>
                        <Button variant="outlined" type={"reset"} size={"large"}>
                            Wyczyść
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    )
}