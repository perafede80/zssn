import React, { useEffect, useState } from 'react';
import { Survivor } from '../models/survivor.model';
import { fetchSurvivors } from '../api/survivorApi';
import Grid from '@mui/material/Grid2';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import SurvivorCard from './SurvivorCard';
import { useNavigate } from 'react-router-dom';

const SurvivorList: React.FC = () => {
    const [survivors, setSurvivors] = useState<Survivor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSurvivors = async () => {
            try {
                const data = await fetchSurvivors();
                setSurvivors(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        loadSurvivors();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box p={4} data-testid="survivors-list">
            <Typography variant="h4" gutterBottom>
                Survivors
            </Typography>
            <Grid columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
                {survivors.map((survivor) => (
                    <SurvivorCard key={survivor.id} survivor={survivor} />
                ))}
            </Grid>

            <Button
                variant="contained"
                color="secondary"
                sx={{ mb: 2 }}
                onClick={() => navigate("/")} // Adjust the path based on your routes
            >
                🔙 Back to Launch Page
            </Button>
        </Box>
    );
};

export default SurvivorList;
