import api from "../../api/axios.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import BoardGameForm, {type BoardGameFormData} from "../../components/BoardGameForm.tsx";
import {useEffect, useState} from "react";
import {Alert, type AlertColor, Box, CircularProgress} from "@mui/material";
import type {BoardGameTypeFull} from "../../types/BoardGameType.ts";

export default function BoardGameEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<BoardGameTypeFull | undefined>(undefined);
    const [initialWarning, setInitialWarning] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/boardgames/${id}`);
                setInitialData(response.data);
            } catch {
                setError("Nie udało się pobrać danych gry.");
            } finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, [id]);

    useEffect(() => {
        if (location.state?.fileUploadError) {
            setInitialWarning("Nie udało się dodać plików gry");
        }
    }, [location.state]);

    const handleEdit = async (
        formData: BoardGameFormData,
        setError: (msg: string) => void,
        setErrorSeverity: (msg: AlertColor) => void,
    ) => {
        try {
            await api.patch(`/boardgames/${id}`, {
                title: formData.title,
                description: formData.description,
                minPlayers: formData.minPlayers,
                maxPlayers: formData.maxPlayers,
                minutesPlaytime: formData.minutesPlaytime,
            });
        } catch {
            setErrorSeverity("error");
            setError("Nie udało się zaktualizować danych gry.")
            return;
        }

        try {
            const filesForm = new FormData();
            if (formData.imageFile) {
                filesForm.append("imageFile", formData.imageFile);
            }
            if (formData.rulebookFile) {
                filesForm.append("rulebookFile", formData.rulebookFile);
            }

            if (!formData.existingImageUrl) {
                filesForm.append("existingImageUrl", "");
            }
            if (!formData.existingRulebookUrl) {
                filesForm.append("existingRulebookUrl", "");
            }

            if ([...filesForm.keys()].length > 0) {
                await api.patch(`/boardgames/${id}/files`, filesForm, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            navigate("/boardgames");
        } catch {
            setErrorSeverity("warning");
            setError("Nie udało się zaktualizować plików gry.")
        }
    }

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

    if (!initialData) {
        setError("Nie znaleziono gry o podanym ID");
        return null
    }

    return <BoardGameForm initialData={initialData} initialWarning={initialWarning}
                          onSubmit={handleEdit} formTitle={"Edytuj grę"} disableEdit={true}/>
}