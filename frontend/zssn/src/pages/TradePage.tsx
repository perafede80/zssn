import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSurvivors } from '../api/survivorApi';
import type { Survivor } from '../models/survivor.model';

const TradePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const survivor = location.state?.survivor as Survivor | undefined;

  const [availableSurvivors, setAvailableSurvivors] = useState<Survivor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!survivor) {
      navigate('/survivors');
      return;
    }

    const loadSurvivors = async () => {
      try {
        const data: Survivor[] = await fetchSurvivors();
        const filteredSurvivors = data.filter(
          (fetchedSurivivor: Survivor) =>
            fetchedSurivivor.inventory &&
            fetchedSurivivor.inventory.length > 0 &&
            fetchedSurivivor.id !== survivor.id,
        );
        setAvailableSurvivors(filteredSurvivors);
      } catch (err) {
        setError('Failed to load survivors.');
      } finally {
        setLoading(false);
      }
    };

    loadSurvivors();
  }, [survivor, navigate]);

  if (loading)
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" textAlign="center">
        {t('TRADE_PAGE.TITLE')}
      </Typography>

      {availableSurvivors.length > 0 ? (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {availableSurvivors.map((tradingWith: Survivor) => (
            <Paper
              key={tradingWith.id}
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography>
                {tradingWith.name} -{' '}
                {tradingWith.inventory
                  ? tradingWith.inventory
                      .map((i) => `${i.quantity}x ${i.item}`)
                      .join(', ')
                  : 'No inventory'}
              </Typography>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/trade/${tradingWith.id}`, {
                    state: { survivor, tradingWith: tradingWith },
                  })
                }
              >
                {t('COMMON.BUTTON.TRADE')}
              </Button>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography textAlign="center" sx={{ mt: 3 }}>
          {t('TRADE_PAGE.NO_SURVIVORS')}
        </Typography>
      )}

      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 4 }}
        onClick={() =>
          survivor
            ? navigate(`/survivors/${survivor.id}`, { state: { survivor } })
            : navigate('/survivors')
        }
      >
        {t('TRADE_PAGE.BACK_BUTTON')}
      </Button>
    </Box>
  );
};

export default TradePage;
