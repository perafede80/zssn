import React from "react";
import { Survivor } from "../models/survivor.model";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    Stack,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import PlaceIcon from '@mui/icons-material/Place';
import { useNavigate } from "react-router-dom";
import IconRenderer from "./IconRenderer";

interface SurvivorCardProps {
    survivor: Survivor;
}

const SurvivorCard: React.FC<SurvivorCardProps> = ({ survivor }) => {
    const navigate = useNavigate();

    return (
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, mb: 2 }}>
            <CardContent>
                {/* Name */}
                <Typography variant="h5" fontWeight="bold">
                    {survivor.name}
                </Typography>

                {/* Gender + Age */}
                <Typography variant="subtitle1">
                    <IconRenderer gender={survivor.gender} /> Age: {survivor.age}
                </Typography>

                {/* Location */}
                <Box display="flex" alignItems="center">
                    <PlaceIcon sx={{ color: "#D32F2F", mr: 1 }} />
                    <Typography variant="subtitle1">
                        {survivor.latitude}, {survivor.longitude}
                    </Typography>
                </Box>

                {/* Inventory Section */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                    Inventory:
                </Typography>
                {survivor.inventory && survivor.inventory.length > 0 ? (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {survivor.inventory.map((item, index) => (
                            <Chip
                                key={index}
                                label={`${item.quantity}`}
                                icon={<IconRenderer item={item.item} />}
                                sx={{ fontWeight: "bold" }}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Typography color="textSecondary">No inventory available.</Typography>
                )}

                {/* View Details Button */}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
                    onClick={() => navigate(`/survivors/${survivor.id}`, { state: { survivor } })}
                >
                    🔍 View Details
                </Button>
            </CardContent>
        </Card>
    );
};

export default SurvivorCard;
