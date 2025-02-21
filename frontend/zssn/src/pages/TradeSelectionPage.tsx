import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSurvivors } from "../api/survivorApi";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Survivor } from "../models/survivor.model";

const TradeSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const survivor = location.state?.survivor;
    const [availableSurvivors, setAvailableSurvivors] = useState<Survivor[]>([]);

    useEffect(() => {
        const loadSurvivors = async () => {
            const data: Survivor[] = await fetchSurvivors();
            const filteredSurvivors = data.filter(
                (s: Survivor) => s.id !== survivor.id && s.inventory && s.inventory.length > 0
            );
            setAvailableSurvivors(filteredSurvivors);
        };
        loadSurvivors();
    }, [survivor]);

    return (
        <Box>
            <Typography variant="h4">Select a Survivor to Trade</Typography>
            {availableSurvivors.map((s) => (
                <Paper key={s.id} sx={{ p: 2, mb: 2 }}>
                    <Typography>{s.name}</Typography>
                    <Button variant="contained" onClick={() => navigate(`/trade/${s.id}`, { state: { survivor, tradingWith: s } })}>
                        Trade
                    </Button>
                </Paper>
            ))}
        </Box>
    );
};

export default TradeSelectionPage;
