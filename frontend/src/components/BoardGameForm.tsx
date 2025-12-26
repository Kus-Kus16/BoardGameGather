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
    Chip, type AlertColor
} from "@mui/material";
import React, {useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { ImageNotSupported, PictureAsPdf, Photo } from '@mui/icons-material';
import type {BoardGameTypeFull} from "../types/BoardGameType.ts";

export interface BoardGameFormData {
    title: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    minutesPlaytime: number;

    imageFile: File | null;
    rulebookFile: File | null;

    existingImageUrl?: string;
    existingRulebookUrl?: string;
}

export interface BoardGameFormProps {
    initialData?: BoardGameTypeFull;
    onSubmit: (formData: BoardGameFormData,
               setError: (msg: string) => void,
               setSeverity: (msg: AlertColor) => void)
        => void;
    formTitle: string;
    disableEdit: boolean;
}

const MAX_PDF_SIZE_MB = 10;
const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Todo General check after api added
export default function BoardGameForm(props: BoardGameFormProps) {
    const navigate = useNavigate();
    const imgInputRef = useRef<HTMLInputElement | null>(null);
    const pdfInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState<BoardGameFormData>({
        title: props.initialData?.title || "",
        description: props.initialData?.description || "",
        minPlayers: props.initialData?.minPlayers || 1,
        maxPlayers: props.initialData?.maxPlayers || 1,
        minutesPlaytime: props.initialData?.minutesPlaytime || 30,
        imageFile: null,
        rulebookFile: null,
        existingImageUrl: props.initialData?.imageUrl,
        existingRulebookUrl: props.initialData?.rulebookUrl
    });

    const [error, setError] = useState("");
    const [errorSeverity, setErrorSeverity] = useState<AlertColor>("error");
    const [imagePreview, setImagePreview] = useState<string>(props.initialData?.imageUrl || "");

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setErrorSeverity("error");
            setError("Niedozwolone rozszerzenie pliku: " + file.type);
            e.target.value = '';
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            setErrorSeverity("error");
            setError(`Plik nie może być większy niż ${MAX_IMAGE_SIZE_MB} MB`)
            e.target.value = '';
            return;
        }

        setForm(prev => ({ ...prev, imageFile: file, existingImageUrl: undefined }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRulebookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (file.type !== 'application/pdf') {
            setErrorSeverity("error");
            setError("Niedozwolone rozszerzenie pliku: " + file.type);
            e.target.value = '';
            return;
        }

        if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
            setErrorSeverity("error");
            setError(`Plik nie może być większy niż ${MAX_PDF_SIZE_MB} MB`)
            e.target.value = '';
            return;
        }

        setForm(prev => ({ ...prev, rulebookFile: file, existingRulebookUrl: undefined }));
    };

    const removeExistingImage = () => {
        setForm(prev => ({ ...prev, existingImageUrl: undefined, imageFile: null }));
        setImagePreview("");
        if (imgInputRef.current) imgInputRef.current.value = "";
    }

    const removeExistingRulebook = () => {
        setForm(prev => ({ ...prev, existingRulebookUrl: undefined, rulebookFile: null }));
        if (pdfInputRef.current) pdfInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        props.onSubmit(form, setError, setErrorSeverity);
    };

    if (props.initialData?.discontinued) {
        return <Alert severity={"error"}>Gra nie jest już dostępna</Alert>
    }

    return (
        <Box sx={{ maxWidth: 700, margin: "auto" }}>
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
                            {props.formTitle}
                        </Typography>

                        {error && <Alert severity={errorSeverity}>{error}</Alert>}

                        <TextField
                            label="Tytuł"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            fullWidth
                            disabled={props.disableEdit}
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
                                disabled={props.disableEdit}
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
                                disabled={props.disableEdit}
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
                            disabled={props.disableEdit}
                        />

                        <Button variant="outlined" component="label">
                            {imagePreview ? "Zmień obrazek" : "Dodaj obrazek"}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                ref={imgInputRef}
                                onChange={handleImageChange}
                            />
                        </Button>

                        {imagePreview && (
                            <Chip
                                icon={<Photo />}
                                label={form.imageFile?.name || "Aktualny obrazek"}
                                onDelete={removeExistingImage}
                                color="secondary"
                                variant="outlined"
                            />
                        )}

                        <Button variant="outlined" component="label">
                            {form.rulebookFile || form.existingRulebookUrl
                                ? "Zmień instrukcję"
                                : "Dodaj instrukcję (PDF)"}
                            <input
                                type="file"
                                hidden
                                accept="application/pdf"
                                ref={pdfInputRef}
                                onChange={handleRulebookChange}
                            />
                        </Button>

                        {(form.rulebookFile || form.existingRulebookUrl) && (
                            <Chip
                                icon={<PictureAsPdf />}
                                label={form.rulebookFile?.name || "Aktualna instrukcja"}
                                component={"a"}
                                href={form.existingRulebookUrl}
                                onDelete={removeExistingRulebook}
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
