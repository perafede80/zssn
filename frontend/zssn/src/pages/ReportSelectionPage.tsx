import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSurvivors } from "../api/survivorApi";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Survivor } from "../models/survivor.model";

const ReportSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const reporter = location.state?.reporter;
    const [availableSurvivors, setAvailableSurvivors] = useState<Survivor[]>([]);

    useEffect(() => {
        const loadSurvivors = async () => {
            const data: Survivor[] = await fetchSurvivors();
            const filteredSurvivors = data.filter((survivor: Survivor) => survivor.id !== reporter.id);
            setAvailableSurvivors(filteredSurvivors);
        };
        loadSurvivors();
    }, [reporter]);

    return (
        <Box>
            <Typography variant="h4">Select a Survivor to Report</Typography>
            {availableSurvivors.map((reported: Survivor) => (
                <Paper key={reported.id} sx={{ p: 2, mb: 2 }}>
                    <Typography>{reported.name}</Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => navigate(`/report/${reported.id}`, { state: { reporter: reporter, reported: reported } })}
                    >
                        Report
                    </Button>
                </Paper>
            ))}
        </Box>
    );
};

export default ReportSelectionPage;
