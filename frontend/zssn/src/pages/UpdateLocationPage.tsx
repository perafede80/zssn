import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { updateSurvivorLocation, getSurvivor } from "../api/survivorApi"; // Import API calls
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Survivor } from "../models/survivor.model";

const UpdateLocationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the survivor ID from the URL
    const location = useLocation();
    const navigate = useNavigate();

    // Use survivor data from navigation state if available
    const [survivor, setSurvivor] = useState<Survivor | null>(location.state?.survivor || null);
    const [latitude, setLatitude] = useState(survivor?.latitude?.toString() || "");
    const [longitude, setLongitude] = useState(survivor?.longitude?.toString() || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Fetch survivor if data is not passed via navigation
    useEffect(() => {
        if (!survivor && id) {
            const fetchSurvivor = async () => {
                try {
                    const data = await getSurvivor(id);
                    setSurvivor(data);
                    setLatitude(data.latitude?.toString());
                    setLongitude(data.longitude?.toString());
                } catch (err) {
                    setError("Failed to load survivor details.");
                }
            };
            fetchSurvivor();
        }
    }, [id, survivor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await updateSurvivorLocation(String(id), Number(latitude), Number(longitude));

            // Redirect to the Survivor Detail page after successful update
            navigate(`/survivors/${id}`, {
                state: {
                    survivor: {
                        ...survivor,
                        latitude: Number(latitude),
                        longitude: Number(longitude)
                    }
                },
                replace: true // Prevents the user from going back to the update page with browser back button
            });

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };


    if (error) {
        return (
            <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button onClick={() => navigate("/survivors")} variant="contained" sx={{ mt: 2 }}>
                    Back to Survivor List
                </Button>
            </Box>
        );
    }

    const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= -90 && value <= 90) {
            setLatitude(e.target.value);
        }
    };

    const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= -180 && value <= 180) {
            setLongitude(e.target.value);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Update Survivor Location
            </Typography>

            {success && <Alert severity="success">Location updated successfully!</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Survivor Name"
                    name="survivorName"
                    value={survivor?.name || ""}
                    disabled
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Latitude"
                    name="latitude"
                    type="number"
                    value={latitude}
                    onChange={handleLatitudeChange}
                    error={latitude !== "" && (Number(latitude) < -90 || Number(latitude) > 90)}
                    helperText={latitude !== "" && (Number(latitude) < -90 || Number(latitude) > 90) ? "Latitude must be between -90 and 90" : ""}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Longitude"
                    name="longitude"
                    type="number"
                    value={longitude}
                    onChange={handleLongitudeChange}
                    error={longitude !== "" && (Number(longitude) < -180 || Number(longitude) > 180)}
                    helperText={latitude !== "" && (Number(longitude) < -180 || Number(longitude) > 180) ? "Longitude must be between -180 and 180" : ""}
                    required
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Location"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/survivors/${id}`, { state: { survivor } })}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default UpdateLocationPage;
