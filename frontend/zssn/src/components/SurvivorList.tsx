import React, { useEffect, useState } from 'react';
import { Survivor } from '../models/survivor.model';
import { fetchSurvivors } from '../api/survivorApi';
import Grid from '@mui/material/Grid2';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import SurvivorCard from './SurvivorCard';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


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
        <Container data-testid="survivors-list" maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Survivors
            </Typography>
            <Grid container spacing={2}>
                {survivors.map((survivor) => (
                    <Grid key={survivor.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <SurvivorCard survivor={survivor} />
                    </Grid>
                ))}
            </Grid>

            <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 1 }}
                onClick={() => navigate("/")}
                startIcon={<ArrowBackIcon />}
            >
                Back to Launch Page
            </Button>
        </Container>

    );
};

export default SurvivorList;
