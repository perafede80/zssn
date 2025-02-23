import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box className="landing-page">
            <Container maxWidth="md" className="landing-page-container">
                {/* Title */}
                <Typography variant="h3" gutterBottom className="landing-page-title">
                    🧟‍♂️ Zombie Survival Network 🧟‍♀️
                </Typography>

                {/* Intro */}
                <Typography variant="h6" className="landing-page-intro">
                    The world has fallen into chaos. Find survivors, trade items, and stay alive!
                </Typography>

                {/* Navigation Buttons */}
                <Box className="landing-page-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/create-survivor")}
                        className="landing-page-button"
                    >
                        Create Survivor
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate("/survivors")}
                        className="landing-page-button"
                    >
                        View Survivors
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default LandingPage;