import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Survivor } from "../models/survivor.model";
import { fetchSurvivors } from "../api/survivorApi";
import { Box, Typography, Button, Paper, Stack, CircularProgress, Alert } from "@mui/material";

const TradePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const survivor = location.state?.survivor as Survivor | undefined;

    const [availableSurvivors, setAvailableSurvivors] = useState<Survivor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!survivor) {
            navigate("/survivors");
            return;
        }

        const loadSurvivors = async () => {
            try {
                const data: Survivor[] = await fetchSurvivors();
                const filteredSurvivors = data.filter((s: Survivor) => s.inventory && s.inventory.length > 0 && s.id !== survivor.id);
                setAvailableSurvivors(filteredSurvivors);
            } catch (err) {
                setError("Failed to load survivors.");
            } finally {
                setLoading(false);
            }
        };

        loadSurvivors();
    }, [survivor, navigate]);

    if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Typography variant="h4" textAlign="center">Select a Survivor to Trade With</Typography>

            {availableSurvivors.length > 0 ? (
                <Stack spacing={2} sx={{ mt: 3 }}>
                    {availableSurvivors.map((s: Survivor) => (
                        <Paper key={s.id} sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography>{s.name} - {s.inventory ? s.inventory.map(i => `${i.quantity}x ${i.item}`).join(", ") : "No inventory"}</Typography>
                            <Button variant="contained" onClick={() => navigate(`/trade/${s.id}`, { state: { survivor, tradingWith: s } })}>Trade</Button>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <Typography textAlign="center" sx={{ mt: 3 }}>No available survivors with inventory.</Typography>
            )}

            <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 4 }}
                onClick={() => survivor ? navigate(`/survivors/${survivor.id}`, { state: { survivor } }) : navigate("/survivors")}
            >
                Back to Survivor Details
            </Button>
        </Box>
    );
};

export default TradePage;
