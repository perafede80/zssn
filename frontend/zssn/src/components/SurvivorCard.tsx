import PlaceIcon from '@mui/icons-material/Place';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Survivor } from '../models/survivor.model';
import IconRenderer from './IconRenderer';

interface SurvivorCardProps {
  survivor: Survivor;
}

const SurvivorCard: React.FC<SurvivorCardProps> = ({ survivor }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        mb: 2,
        height: 350,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        {/* Name */}
        <Typography variant="h5" fontWeight="bold" align="center">
          {survivor.name}
        </Typography>

        {/* Gender + Age */}
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          <IconRenderer gender={survivor.gender} /> Age: {survivor.age}
        </Typography>

        {/* Location */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <PlaceIcon sx={{ color: '#D32F2F', mr: 0.5 }} />
          <Typography variant="body2">
            {survivor.latitude}, {survivor.longitude}
          </Typography>
        </Box>

        {/* Inventory Section */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Inventory:
        </Typography>
        {survivor.inventory && survivor.inventory.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              mt: 1,
            }}
          >
            {survivor.inventory.map((item, index) => (
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
          <Typography color="textSecondary">No inventory available.</Typography>
        )}
      </CardContent>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, borderRadius: 2 }}
        onClick={() =>
          navigate(`/survivors/${survivor.id}`, { state: { survivor } })
        }
        startIcon={<SwitchAccountIcon />}
      >
        Play as Survivor
      </Button>
    </Card>
  );
};

export default SurvivorCard;
