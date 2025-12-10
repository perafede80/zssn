import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconRenderer from '../components/IconRenderer';
import type { Survivor } from '../models/survivor.model';

const SurvivorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const survivor = location.state?.survivor as Survivor | undefined;
  const { t } = useTranslation();

  if (!survivor) {
    return (
      <Typography variant="h6">
        {t('SURVIVOR_DETAILS_PAGE.ERROR_MESSAGE')}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 500,
          p: 3,
          borderRadius: 3,
          border: '1px solid #ddd',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Survivor Details */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ textAlign: 'center', mb: 2 }}
        >
          {survivor.name}
        </Typography>

        <Typography variant="subtitle1">
          {t('COMMON.AGE')} <strong>{survivor.age}</strong>
        </Typography>
        <Typography variant="subtitle1">
          {t('COMMON.GENDER')} <IconRenderer gender={survivor.gender} />
        </Typography>
        <Typography variant="subtitle1">
          {t('COMMON.LOCATION')} {survivor.latitude}, {survivor.longitude}
        </Typography>

        {/* Inventory Section */}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
          {t('COMMON.INVENTORY')}
        </Typography>
        {survivor.inventory && survivor.inventory.length > 0 ? (
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction={{ xs: 'column', sm: 'row' }}
            useFlexGap
            sx={{ flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}
          >
            {survivor.inventory.map((item, index) => (
              <Chip
                key={index.toString()}
                label={`${item.quantity}`}
                icon={<IconRenderer item={item.item} />}
                sx={{
                  fontWeight: 'bold',
                  bgcolor: '#f5f5f5',
                  px: 1.5,
                  maxWidth: '100%',
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography color="textSecondary">
            {t('COMMON.NO_INVENTORY')}
          </Typography>
        )}

        {/* Buttons */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() =>
              navigate(`/update-location/${id}`, { state: { survivor } })
            }
          >
            {t('SURVIVOR_DETAILS_PAGE.BUTTON.UPDATE_LOCATION')}
          </Button>

          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => navigate('/trade/select', { state: { survivor } })}
            disabled={!survivor.inventory || survivor.inventory.length === 0}
          >
            {t('SURVIVOR_DETAILS_PAGE.BUTTON.TRADE_ITEMS')}
          </Button>

          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() =>
              navigate('/report/select', { state: { reporter: survivor } })
            }
          >
            {t('SURVIVOR_DETAILS_PAGE.BUTTON.REPORT')}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate('/survivors')}
          >
            {t('SURVIVOR_DETAILS_PAGE.BUTTON.BACK')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SurvivorDetailsPage;
