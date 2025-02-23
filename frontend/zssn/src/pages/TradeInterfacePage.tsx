import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Survivor, InventoryItem } from "../models/survivor.model";
import { Box, Typography, Button, Stack, Paper, IconButton, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import itemPoints from "../constants/itemPoints";
import { survivorTradeItems } from "../api/survivorApi";
import Grid from '@mui/material/Grid2';
import IconRenderer from "../components/IconRenderer";

const TradeInterfacePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const survivor = location.state?.survivor as Survivor | undefined;
    const tradingWith = location.state?.tradingWith as Survivor | undefined;

    const [selectedItemsA, setSelectedItemsA] = useState<Record<string, number>>({});
    const [selectedItemsB, setSelectedItemsB] = useState<Record<string, number>>({});

    if (!survivor || !tradingWith) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6">Invalid trade session.</Typography>
                <Button variant="contained" onClick={() => navigate("/trade")}>
                    Go Back to Trade Selection
                </Button>
            </Box>
        );
    }

    const modifySelection = (owner: "A" | "B", itemName: string, change: number, maxQuantity: number) => {
        console.log("owner", owner);
        console.log("itemName", itemName);
        const normalizedItem = itemName.toUpperCase();
        const setSelectedItems = owner === "A" ? setSelectedItemsA : setSelectedItemsB;

        setSelectedItems(prev => {
            const newItems = { ...prev };
            const newQuantity = (newItems[normalizedItem] || 0) + change;

            if (newQuantity <= 0) {
                delete newItems[normalizedItem];
            } else if (newQuantity <= maxQuantity) {
                newItems[normalizedItem] = newQuantity;
            }

            return newItems;
        });
    };

    const calculateTotalPoints = (items: Record<string, number>) => {
        return Object.entries(items).reduce((total, [item, qty]) => {
            const normalizedItem = item.toUpperCase(); // Ensure case consistency
            return total + (itemPoints[normalizedItem] || 0) * qty;
        }, 0);
    };

    const handleConfirmTrade = async () => {
        if (!survivor?.id || !tradingWith?.id) {
            alert("Invalid survivor IDs for trading.");
            return;
        }

        try {
            await survivorTradeItems(survivor.id.toString(), tradingWith.id.toString(), selectedItemsA, selectedItemsB);
            alert("Trade successful!");
            navigate("/survivors/");
        } catch (error: any) {
            console.error("Trade request failed:", error);
            alert(`Failed to process trade: ${error.response?.data?.message || error.message}`);
        }
    };

    const totalPointsA = calculateTotalPoints(selectedItemsA);
    const totalPointsB = calculateTotalPoints(selectedItemsB);
    const isTradeValid = totalPointsA > 0 && totalPointsA === totalPointsB;

    return (
        <Container data-testid="trade-selection-page" maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" textAlign="center">Trade Between {survivor.name} and {tradingWith.name}</Typography>

            <Grid container spacing={3} justifyContent="center" alignItems="flex-start" sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, sm: 6}}>
                    
                    <Paper sx={{ p: 3, width: 325, height: 250 }}>
                        <Typography variant="h6">{survivor.name}'s Inventory</Typography>
                        {survivor.inventory?.length ? (
                            survivor.inventory.map((item: InventoryItem, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography>
                                        {item.quantity - (selectedItemsA[item.item] || 0)}x {item.item}
                                        {<IconRenderer item={item.item} sx={{ ml: 0.5, fontSize: 16 }} />}    
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <IconButton disabled={(selectedItemsA[item.item] || 0) >= item.quantity}
                                            onClick={() => modifySelection("A", item.item, 1, item.quantity)}>
                                            <AddIcon />
                                        </IconButton>
                                        <Typography>{selectedItemsA[item.item] || 0}</Typography>
                                        <IconButton disabled={!selectedItemsA[item.item]}
                                            onClick={() => modifySelection("A", item.item, -1, item.quantity)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Typography color="textSecondary">No inventory available.</Typography>
                        )}

                        {Object.keys(selectedItemsA).length > 0 && (
                            <Typography variant="h6">Total Points: {totalPointsA}</Typography>
                        )}
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper sx={{ p: 3, width: 325, height: 250 }}>
                        <Typography variant="h6">{tradingWith.name}'s Inventory</Typography>
                        {tradingWith.inventory?.length ? (
                            tradingWith.inventory.map((item: InventoryItem, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography>
                                        {item.quantity - (selectedItemsB[item.item] || 0)}x {item.item} 
                                        {<IconRenderer item={item.item} sx={{ ml: 0.5, fontSize: 16 }} />}    
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <IconButton disabled={(selectedItemsB[item.item] || 0) >= item.quantity}
                                            onClick={() => modifySelection("B", item.item, 1, item.quantity)}>
                                            <AddIcon />
                                        </IconButton>
                                        <Typography>{selectedItemsB[item.item] || 0}</Typography>
                                        <IconButton disabled={!selectedItemsB[item.item]}
                                            onClick={() => modifySelection("B", item.item, -1, item.quantity)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                    

                                        

                            
                            ))
                        ) : (
                            <Typography color="textSecondary">No inventory available.</Typography>
                        )}
                        {Object.keys(selectedItemsB).length > 0 && (
                            <Typography variant="h6">Total Points: {totalPointsB}</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>


            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmTrade} disabled={!isTradeValid}
                >
                    Confirm Trade
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/trade/select", { state: { survivor } })}
                >
                    Cancel
                </Button>
            </Stack>
        </Container>
    );
};

export default TradeInterfacePage;
