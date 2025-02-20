import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import SurvivorMap from "../components/SurvivorMap";
import "leaflet/dist/leaflet.css";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
            {/* Title */}
            <Typography variant="h3" gutterBottom style={{ fontFamily: "Press Start 2P, cursive" }}>
                🧟‍♂️ Zombie Survival Network 🧟‍♀️
            </Typography>

            {/* Intro */}
            <Typography variant="h6" color="textSecondary">
                The world has fallen into chaos. Find survivors, trade items, and stay alive!
            </Typography>

            {/* Navigation Buttons */}
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/create-survivor")}
                    sx={{ fontFamily: "Press Start 2P, cursive" }}
                >
                    Create Survivor
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/survivors")}
                    sx={{ fontFamily: "Press Start 2P, cursive" }}
                >
                    View Survivors
                </Button>

            </Box>

            {/* Map Section */}
            {/* <Box mt={6} height={400}>
                <Typography variant="h5">🌍 Survivors Map</Typography>
                <SurvivorMap />
            </Box> */}
        </Container>
    );
};

export default LandingPage;
