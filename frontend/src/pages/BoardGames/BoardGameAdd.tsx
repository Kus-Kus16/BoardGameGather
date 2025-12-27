import api from "../../api/axios.tsx";
import {useNavigate} from "react-router-dom";
import BoardGameForm, {type BoardGameFormData} from "../../components/BoardGameForm.tsx";
import type {AlertColor} from "@mui/material";

export default function BoardGameAdd() {
    const navigate = useNavigate();

    const handleAdd = async (
        formData: BoardGameFormData,
        setError: (msg: string) => void,
        setErrorSeverity: (msg: AlertColor) => void,
    ) => {
        let id;
        try {
            const res = await api.post("/boardgames", {
                title: formData.title,
                description: formData.description,
                minPlayers: formData.minPlayers,
                maxPlayers: formData.maxPlayers,
                minutesPlaytime: formData.minutesPlaytime,
            });
            id = res.data.id
        } catch {
            setErrorSeverity("error");
            setError("Nie udało się dodać gry.")
            return;
        }

        try {
            if (formData.imageFile || formData.rulebookFile) {
                const filesForm = new FormData();
                if (formData.imageFile) {
                    filesForm.append("imageFile", formData.imageFile);
                }
                if (formData.rulebookFile) {
                    filesForm.append("rulebookFile", formData.rulebookFile);
                }

                await api.post(`/boardgames/${id}/files`, filesForm, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            navigate("/boardgames");
        } catch {
            navigate(`/boardgames/${id}/edit`, {
                state: { fileUploadError: true }
            });
        }
    }

    return <BoardGameForm onSubmit={handleAdd} formTitle={"Dodaj nową grę"} disableEdit={false}/>
}