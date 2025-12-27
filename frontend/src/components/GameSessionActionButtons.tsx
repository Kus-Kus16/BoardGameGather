import type { GameSessionTypeFull } from "../types/GameSessionType"
import { useContext, useState } from "react"
import { AuthContext } from "../auth/AuthContext"
import {
    Button,
    Stack,
    Tooltip,
} from "@mui/material"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import ConfirmDialog from "./ConfirmDialog.tsx";

interface Props {
    session: GameSessionTypeFull
    setError: (msg: string) => void
}

export default function GameSessionActionButtons({ session, setError }: Props) {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    const isPastSession = new Date(session.date) < new Date()
    const isParticipant = session.participants.some(
        (u) => u.username === auth.username
    )
    const isFull = session.participants.length >= session.numberOfPlayers
    const isOwner = session.participants.some(
        (u) => u.username === auth.username
    )

    const isJoinDisabled =
        !auth.isAuthenticated || isPastSession || isParticipant || isFull

    const isLeaveDisabled =
        !auth.isAuthenticated || isPastSession || !isParticipant || isOwner

    const getTooltip = () => {
        if (!auth.isAuthenticated) return "Musisz być zalogowany"
        if (isPastSession) return "Sesja już się odbyła"
        if (!isParticipant && isFull) return "Sesja jest pełna"
        return ""
    }

    const handleJoinLeave = async () => {
        try {
            if (isParticipant) {
                await api.delete(`/sessions/${session.id}/participants`)
            } else {
                await api.post(`/sessions/${session.id}/participants`)
            }
            navigate(`/sessions/${session.id}`)
        } catch {
            setError(
                isParticipant
                    ? "Nie udało się opuścić sesji."
                    : "Nie udało się dołączyć do sesji."
            )
        }
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/sessions/${session.id}`)
            navigate("/sessions")
        } catch {
            setError("Nie udało się usunąć sesji.")
        }
    }

    return (
        <>
            <Stack direction="row" spacing={2}>
                {isOwner ? (
                    <Button
                        size="large"
                        variant="contained"
                        color="warning"
                        onClick={() => setOpenDeleteDialog(true)}
                        sx={{ width: "105px" }}
                    >
                        Usuń
                    </Button>
                ) : (
                    <Tooltip title={getTooltip()}>
                        <span>
                            <Button
                                size="large"
                                variant={isParticipant ? "outlined" : "contained"}
                                color={isParticipant ? "error" : "primary"}
                                onClick={handleJoinLeave}
                                disabled={isParticipant ? isLeaveDisabled : isJoinDisabled}
                                sx={{ width: "105px" }}
                            >
                                {isParticipant ? "Opuść" : "Dołącz"}
                            </Button>
                        </span>
                    </Tooltip>
                )}
            </Stack>

            <ConfirmDialog
                open={openDeleteDialog}
                title="Usuń sesję"
                description="Czy na pewno chcesz usunąć tę sesję? Tej operacji nie można cofnąć."
                confirmText={"Usuń"}
                onCancel={() => setOpenDeleteDialog(false)}
                onConfirm={() => {
                    setOpenDeleteDialog(false)
                    handleDelete().then()
                }}
            />
        </>
    )
}
