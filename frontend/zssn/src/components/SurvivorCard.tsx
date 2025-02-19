import React from 'react';
import { Survivor } from '../models/survivor.model';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';

interface SurvivorCardProps {
    survivor: Survivor;
}

const SurvivorCard: React.FC<SurvivorCardProps> = ({ survivor }) => {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {survivor.name}
                </Typography>
                <Typography color="textSecondary">
                    Age: {survivor.age}, Gender: {survivor.gender}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Location: ({survivor.latitude}, {survivor.longitude})
                </Typography>
                {survivor.inventory && survivor.inventory.length > 0 && (
                    <>
                        <Typography variant="subtitle1" gutterBottom>
                            Inventory:
                        </Typography>
                        <List>
                            {survivor.inventory.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`${item.item}: ${item.quantity}`} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default SurvivorCard;