import { SxProps } from '@mui/material/styles';

// Function to get Gender Icon
export const getGenderIconString = (gender: string): { icon: string | null, sx: SxProps | null } => {
    switch (gender) {
        case "M":
            return { icon: "MaleIcon", sx: { color: "#1976D2" } };
        case "F":
            return { icon: "FemaleIcon", sx: { color: "#E91E63" } };
        case "O":
            return { icon: "TransgenderIcon", sx: { color: "#9C27B0" } };
        default:
            return { icon: null, sx: null };
    }
};

// Function to get Inventory Icon
export const getInventoryIconString = (item: string): { icon: string | null, sx: SxProps | null } => {
    switch (item.toUpperCase()) {
        case "WATER":
            return { icon: "WaterDropIcon", sx: { color: "#03A9F4" } };
        case "FOOD":
            return { icon: "FastfoodIcon", sx: { color: "#FF9800" } };
        case "MEDICATION":
            return { icon: "LocalPharmacyIcon", sx: { color: "#4CAF50" } };
        case "AMMUNITION":
            return { icon: "SportsMmaIcon", sx: { color: "#795548" } };
        default:
            return { icon: null, sx: null };
    }
};