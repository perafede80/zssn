import React, { useEffect, useState } from 'react';
import { Survivor } from '../models/survivor.model';
import { fetchSurvivors } from '../api/survivorApi';
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import SurvivorCard from './SurvivorCard';

const SurvivorList: React.FC = () => {
    const [survivors, setSurvivors] = useState<Survivor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Survivors
            </Typography>
            <Grid container spacing={2}>
                {survivors.map((survivor) => (
                    <Grid item xs={12} sm={6} md={4} key={survivor.id}>
                        <SurvivorCard survivor={survivor} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SurvivorList;
