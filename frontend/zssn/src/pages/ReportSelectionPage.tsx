import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSurvivors } from "../api/survivorApi";
import { Card, CardContent, Container, Typography, Button, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Survivor } from "../models/survivor.model";
import IconRenderer from "../components/IconRenderer";
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import PlaceIcon from '@mui/icons-material/Place';

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
        <Container data-testid="report-selection-page" maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>Select a Survivor to Report</Typography>
            <Grid container spacing={2} alignItems="center">
                {availableSurvivors.map((reported: Survivor) => (
                    <Grid key={reported.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, mb: 2, height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {reported.name}
                                </Typography>
                                
                                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                    <IconRenderer gender={reported.gender} /> Age: {reported.age}
                                </Typography>

                                {/* Location */}
                                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                                    <PlaceIcon sx={{ color: "#D32F2F", mr: 0.5 }} />
                                    <Typography variant="body2">{reported.latitude}, {reported.longitude}</Typography>
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => navigate(`/report/${reported.id}`, { state: { reporter, reported } })}
                                sx={{ borderRadius: 2 }}
                            >
                                Report
                            </Button>
                        </Card>
                    </Grid>
                ))}

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, borderRadius: 2 }}
                    onClick={() => navigate(`/survivors/${reporter.id}`, { state: { survivor:reporter } })}
                    startIcon={<SwitchAccountIcon />}
                >
                    Cancel
                </Button>
            </Grid>
        </Container>
    );
};

export default ReportSelectionPage;
