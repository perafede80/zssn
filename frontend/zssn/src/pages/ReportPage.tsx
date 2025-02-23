import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { reportSurvivor } from "../api/survivorApi";

const ReportPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const reporter = location.state?.reporter;
    const reported = location.state?.reported;
    const [comments, setComments] = useState("");
    const [error, setError] = useState("");

    if (!reporter || !reported) {
        return <Typography color="error">Invalid report session.</Typography>;
    }

    const handleSubmit = async () => {
        try {
            await reportSurvivor(reported.id, reporter.id, comments);
            alert("Report submitted successfully!");
            navigate("/survivors/");
        } catch (error) {
            console.error("Error submitting report:", error);
            setError("Failed to submit the report. Please try again.");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h4" textAlign="center" mb={3}>Report {reported.name}</Typography>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <TextField
                label="Additional Comments"
                multiline
                fullWidth
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleSubmit}
            >
            Submit Report
            </Button>
        </Box>
    );
};

export default ReportPage;
