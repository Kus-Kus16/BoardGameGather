import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import { Paper } from "@mui/material";

export default function MainLayout() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", m: "16px", mb: "32px"}}>
            <Navbar />

            <Paper sx={{ minHeight: "94vh", p: 3 }} elevation={2}>
                <Box sx={{ flex: 1, mt: "32px", overflowY: "auto", p: 3 }}>
                    <Outlet />
                </Box>
            </Paper>

        </Box>
    );
}
