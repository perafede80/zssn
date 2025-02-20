import React from 'react';
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import WaterDropIcon from "@mui/icons-material/Opacity";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import { SxProps } from '@mui/material/styles';

interface IconRendererProps {
    gender?: string;
    item?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ gender, item }) => {
    let IconComponent: React.ElementType | null = null;
    let sx: SxProps | null = null;

    if (gender) {
        switch (gender) {
            case 'M':
                IconComponent = MaleIcon;
                sx = { color: '#1976D2' };
                break;
            case 'F':
                IconComponent = FemaleIcon;
                sx = { color: '#E91E63' };
                break;
            case 'O':
                IconComponent = TransgenderIcon;
                sx = { color: '#9C27B0' };
                break;
        }
    } else if (item) {
        switch (item.toUpperCase()) {
            case 'WATER':
                IconComponent = WaterDropIcon;
                sx = { color: '#03A9F4' };
                break;
            case 'FOOD':
                IconComponent = FastfoodIcon;
                sx = { color: '#FF9800' };
                break;
            case 'MEDICATION':
                IconComponent = LocalPharmacyIcon;
                sx = { color: '#4CAF50' };
                break;
            case 'AMMUNITION':
                IconComponent = SportsMmaIcon;
                sx = { color: '#795548' };
                break;
        }
    }

    if (!IconComponent) {
        return null; // Or a default icon
    }

    return <IconComponent sx={sx} />;
};

export default IconRenderer;