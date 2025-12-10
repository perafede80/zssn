import { Box, Button, Container, Typography } from '@mui/material';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { useTranslation } from 'react-i18next';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box className="landing-page">
      <Container maxWidth="md" className="landing-page-container">
        {/* Title */}
        <Typography variant="h3" gutterBottom className="landing-page-title">
          {t('LANDING_PAGE.TITLE')}
        </Typography>

        {/* Intro */}
        <Typography variant="h6" className="landing-page-intro">
          {t('LANDING_PAGE.DESCRIPTION')}
        </Typography>

        {/* Navigation Buttons */}
        <Box className="landing-page-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/create-survivor')}
            className="landing-page-button"
          >
            {t('LANDING_PAGE.CREATE_SURVIVOR')}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/survivors')}
            className="landing-page-button"
          >
            {t('LANDING_PAGE.VIEW_SURVIVORS')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
