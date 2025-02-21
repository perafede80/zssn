import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Survivor } from "../models/survivor.model";
import { Box, Typography, Button, Chip, Paper, Stack } from "@mui/material";
import IconRenderer from "../components/IconRenderer";

const SurvivorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const survivor = location.state?.survivor as Survivor | undefined;

    if (!survivor) {
        return <Typography variant="h6">Survivor not found. Please go back to the list.</Typography>;
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, px: 2 }}> 
            <Paper
                elevation={4}
                sx={{
                    width: "100%",  
                    maxWidth: 500,
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #ddd",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Survivor Details */}
                <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", mb: 2 }}>
                    {survivor.name}
                </Typography>

                <Typography variant="subtitle1">Age: <strong>{survivor.age}</strong></Typography>
                <Typography variant="subtitle1">Gender: <IconRenderer gender={survivor.gender} /></Typography>
                <Typography variant="subtitle1">Location: {survivor.latitude}, {survivor.longitude}</Typography>

                {/* Inventory Section */}
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                    Inventory:
                </Typography>
                {survivor.inventory && survivor.inventory.length > 0 ? (
                    <Stack
                        spacing={{ xs: 1, sm: 2 }}
                        direction={{xs:"column", sm:"row"}}
                        useFlexGap
                        sx={{ flexWrap: "wrap", justifyContent: "center", mt: 1 }}
                    >
                        {survivor.inventory.map((item, index) => (
                            <Chip
                                key={index}
                                label={`${item.quantity}`}
                                icon={<IconRenderer item={item.item} />}
                                sx={{
                                    fontWeight: "bold",
                                    bgcolor: "#f5f5f5",
                                    px: 1.5,
                                    maxWidth: "100%",
                                }}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Typography color="textSecondary">No inventory available.</Typography>
                )}

                {/* Buttons */}
                <Box sx={{ mt: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth  
                        onClick={() => navigate(`/update-location/${id}`, { state: { survivor } })}
                    >
                        Update Location
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => navigate("/trade", { state: { survivor } })}
                        disabled={!survivor.inventory || survivor.inventory.length === 0}
                    >
                        Trade Items
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth  
                        onClick={() => navigate("/survivors")}
                    >
                        Back to Survivors
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default SurvivorDetail;
