import {
    Box,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    TextField,
    Typography,
    Button,
    Stack,
    Alert,
    Chip
} from "@mui/material";
import React, {useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { ImageNotSupported, PictureAsPdf, Photo } from '@mui/icons-material';
import api from "../../api/axios.tsx";
import axios from "axios";

interface BoardGameForm {
    title: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    minutesPlaytime: number;
    imageFile: File | null;
    rulebookFile: File | null;
}

export default function BoardGameAdd() {
    const navigate = useNavigate();
    const imgInputRef = useRef<HTMLInputElement | null>(null);
    const pdfInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState<BoardGameForm>({
        title: "",
        description: "",
        minPlayers: 1,
        maxPlayers: 1,
        minutesPlaytime: 30,
        imageFile: null,
        rulebookFile: null
    });

    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: name.includes("Players") || name === "minutesPlaytime"
                ? Number(value)
                : value
        }));
    };

    const MAX_IMAGE_SIZE_MB = 5;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setError("Niedozwolone rozszerzenie pliku: " + file.type);
            e.target.value = '';
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            setError(`Plik nie może być większy niż ${MAX_IMAGE_SIZE_MB} MB`)
            e.target.value = '';
            return;
        }

        setForm(prev => ({ ...prev, imageFile: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const MAX_PDF_SIZE_MB = 10;
    const handleRulebookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (file.type !== 'application/pdf') {
            setError("Niedozwolone rozszerzenie pliku: " + file.type);
            e.target.value = '';
            return;
        }

        if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
            setError(`Plik nie może być większy niż ${MAX_PDF_SIZE_MB} MB`)
            e.target.value = '';
            return;
        }

        setForm(prev => ({ ...prev, rulebookFile: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("minPlayers", String(form.minPlayers));
        formData.append("maxPlayers", String(form.maxPlayers));
        formData.append("minutesPlaytime", String(form.minutesPlaytime));

        // TODO on Api Change
        // if (form.imageFile) {
        //     formData.append("image", form.imageFile);
        // }
        //
        // if (form.rulebookFile) {
        //     formData.append("rulebook", form.rulebookFile);
        // }


        try {
            await api.post("/boardgames", formData);
            navigate("/boardgames");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Wystąpił błąd");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Wystąpił nieznany błąd");
            }
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 700, margin: "auto" }}>
            <Card>
                {imagePreview ? (
                    <CardMedia
                        component="img"
                        height="300"
                        image={imagePreview}
                        alt="Podgląd obrazka"
                    />
                ) : (
                    <Box
                        sx={{
                            height: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100"
                        }}
                    >
                        <ImageNotSupported sx={{ fontSize: 80, color: "grey.400" }} />
                    </Box>
                )}

                <CardContent component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <Typography variant="h4" gutterBottom>
                            Dodaj nową grę
                        </Typography>

                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            label="Tytuł"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Opis"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                        />

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Min. graczy"
                                name="minPlayers"
                                type="number"
                                value={form.minPlayers}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            min: 1,
                                            max: form.maxPlayers
                                        }
                                    }
                                }}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Max. graczy"
                                name="maxPlayers"
                                type="number"
                                value={form.maxPlayers}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            min: form.minPlayers,
                                            max: 20
                                        }
                                    }
                                }}
                                required
                                fullWidth
                            />
                        </Stack>

                        <TextField
                            label="Czas gry (minuty)"
                            name="minutesPlaytime"
                            type="number"
                            value={form.minutesPlaytime}
                            onChange={handleChange}
                            slotProps={{
                                input: {
                                    inputProps: {
                                        min: 1,
                                        max: 600
                                    }
                                }
                            }}
                            required
                            fullWidth
                        />

                        <Button variant="outlined" component="label">
                            Dodaj obrazek
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                ref={imgInputRef}
                                onChange={handleImageChange}
                            />
                        </Button>

                        {form.imageFile && (
                            <Chip
                                icon={<Photo />}
                                label={form.imageFile.name}
                                onDelete={() => {
                                    setForm(prev => ({...prev, imageFile: null}))
                                    if (imgInputRef.current) {
                                        imgInputRef.current.value = "";
                                    }
                                }}
                                color="secondary"
                                variant="outlined"
                            />
                        )}

                        <Button variant="outlined" component="label">
                            Dodaj instrukcję (PDF)
                            <input
                                type="file"
                                hidden
                                accept="application/pdf"
                                ref={pdfInputRef}
                                onChange={handleRulebookChange}
                            />
                        </Button>

                        {form.rulebookFile && (
                            <Chip
                                icon={<PictureAsPdf />}
                                label={form.rulebookFile.name}
                                onDelete={() => {
                                    setForm(prev => ({...prev, rulebookFile: null}))
                                    if (pdfInputRef.current) {
                                        pdfInputRef.current.value = "";
                                    }
                                }}
                                color="secondary"
                                variant="outlined"
                            />
                        )}
                    </Stack>

                    <CardActions sx={{ mt: 2, px: 0 }}>
                        <Stack direction="row" spacing={2}>
                            <Button type="submit" variant="contained">
                                Zapisz
                            </Button>
                            <Button color="error" variant="outlined" onClick={() => navigate(-1)}>
                                Anuluj
                            </Button>
                        </Stack>
                    </CardActions>
                </CardContent>
            </Card>
        </Box>
    );
};
