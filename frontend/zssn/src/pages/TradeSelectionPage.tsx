import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSurvivors } from '../api/survivorApi';
import IconRenderer from '../components/IconRenderer';
import type { Survivor } from '../models/survivor.model';

const TradeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const survivor = location.state?.survivor;
  const [availableSurvivors, setAvailableSurvivors] = useState<Survivor[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const loadSurvivors = async () => {
      const data: Survivor[] = await fetchSurvivors();
      const filteredSurvivors = data.filter(
        (s: Survivor) =>
          s.id !== survivor.id && s.inventory && s.inventory.length > 0,
      );
      setAvailableSurvivors(filteredSurvivors);
    };
    loadSurvivors();
  }, [survivor]);

  return (
    <Container
      data-testid="trade-selection-page"
      maxWidth="md"
      sx={{ textAlign: 'center', py: 4 }}
    >
      <Typography variant="h4" gutterBottom>
        {t('TRADE_SELECTION_PAGE.TITLE')}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {availableSurvivors.map((tradeWithSurvivor: Survivor) => (
          <Grid key={tradeWithSurvivor.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                p: 2,
                mb: 2,
                height: 250,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {tradeWithSurvivor.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                >
                  {t('COMMON.INVENTORY')}
                </Typography>
                {tradeWithSurvivor.inventory &&
                tradeWithSurvivor.inventory.length > 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexWrap: 'wrap',
                      mt: 1,
                    }}
                  >
                    {tradeWithSurvivor.inventory.map((item, index) => (
                      <Chip
                        key={index.toString()}
                        label={item.quantity}
                        icon={<IconRenderer item={item.item} />}
                        sx={{
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="textSecondary">
                    {t('COMMON.NO_INVENTORY')}
                  </Typography>
                )}
              </CardContent>
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  navigate(`/trade/${survivor.id}`, {
                    state: { survivor, tradingWith: tradeWithSurvivor },
                  })
                }
                sx={{ borderRadius: 2 }}
              >
                {t('COMMON.BUTTON.TRADE')}
              </Button>
            </Card>
          </Grid>
        ))}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, borderRadius: 2 }}
          onClick={() =>
            navigate(`/survivors/${survivor.id}`, { state: { survivor } })
          }
          startIcon={<SwitchAccountIcon />}
        >
          {t('COMMON.BUTTON.CANCEL')}
        </Button>
      </Grid>
    </Container>
  );
};

export default TradeSelectionPage;
