import React, { useState } from "react";
import { createSurvivor } from "../api/survivorApi";
import {
    TextField,
    Button,
    MenuItem,
    Box,
    Typography,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WaterDropIcon from "@mui/icons-material/Opacity";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

// Define inventory items with Material UI icons
const inventoryItems = [
    { name: "Water", icon: <WaterDropIcon /> },
    { name: "Food", icon: <FastfoodIcon /> },
    { name: "Medication", icon: <LocalPharmacyIcon /> },
    { name: "Ammunition", icon: <SportsMmaIcon /> },
];

const SurvivorForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        latitude: "",
        longitude: "",
        inventory: {} as Record<string, number>,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inventoryError, setInventoryError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        let numericValue = Number(value);

        // Apply validation rules
        if (name === "latitude" && (numericValue < -90 || numericValue > 90)) return;
        if (name === "longitude" && (numericValue < -180 || numericValue > 180)) return;

        setFormData({ ...formData, [name]: value });
    };

    const handleInventoryChange = (item: string, change: number) => {
        setFormData((prevData) => {
            const newInventory = { ...prevData.inventory };
            newInventory[item] = (newInventory[item] || 0) + change;
            if (newInventory[item] <= 0) {
                delete newInventory[item]; // Remove item if zero
            }
            return { ...prevData, inventory: newInventory };
        });

        setInventoryError(false); // ✅ Reset error when inventory is updated
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🚨 **Prevent submission if inventory is empty**
        if (Object.keys(formData.inventory).length === 0) {
            setInventoryError(true);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        const genderMap: Record<string, string> = { Male: "M", Female: "F", Other: "O" };

        try {
            await createSurvivor({
                name: formData.name,
                age: Number(formData.age),
                gender: genderMap[formData.gender] || formData.gender,
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
                inventory: Object.entries(formData.inventory).map(([item, quantity]) => ({
                    item: item.toUpperCase(),
                    quantity,
                })),
            });

            setSuccess(true);
            setFormData({ name: "", age: "", gender: "", latitude: "", longitude: "", inventory: {} });
            navigate("/survivors"); // ✅ Redirect after successful creation
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>Create a Survivor</Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Survivor successfully created!</Alert>}
            {inventoryError && <Alert severity="warning">Please select at least one inventory item.</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                <TextField fullWidth margin="normal" select label="Gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Latitude"
                    name="latitude"
                    type="number"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Longitude"
                    name="longitude"
                    type="number"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                />

                {/* Inventory Selection Button */}
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<InventoryIcon />}
                    onClick={() => setInventoryModalOpen(true)}
                    sx={{ mt: 2 }}
                >
                    Select Inventory
                </Button>

                {/* Inventory Display */}
                {Object.keys(formData.inventory).length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Selected Inventory:</Typography>
                        {Object.entries(formData.inventory).map(([item, quantity]) => (
                            <Typography key={item}>
                                {inventoryItems.find((inv) => inv.name === item)?.icon} {item}: {quantity}
                            </Typography>
                        ))}
                    </Box>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading || Object.keys(formData.inventory).length === 0}
                >
                    {loading ? "Submitting..." : "Create Survivor"}
                </Button>
            </form>

            {/* Inventory Modal */}
            <Dialog open={inventoryModalOpen} onClose={() => setInventoryModalOpen(false)}>
                <DialogTitle>Select Inventory Items</DialogTitle>
                <DialogContent>
                    {inventoryItems.map(({ name, icon }) => (
                        <Box key={name} display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                                {icon} <Typography>{name}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <IconButton onClick={() => handleInventoryChange(name, -1)} disabled={!formData.inventory[name]}>
                                    <RemoveIcon />
                                </IconButton>
                                <TextField type="number" value={formData.inventory[name] || 0} />
                                <IconButton onClick={() => handleInventoryChange(name, 1)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInventoryModalOpen(false)}>Done</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SurvivorForm;
