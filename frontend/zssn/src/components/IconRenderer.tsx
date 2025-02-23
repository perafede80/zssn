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
    sx?: SxProps;  // Allow passing custom styles
}

const IconRenderer: React.FC<IconRendererProps> = ({ gender, item, sx }) => {
    let IconComponent: React.ElementType | null = null;
    let defaultSx: SxProps = {};

    if (gender) {
        switch (gender) {
            case 'M':
                IconComponent = MaleIcon;
                defaultSx = { color: '#1976D2' };
                break;
            case 'F':
                IconComponent = FemaleIcon;
                defaultSx = { color: '#E91E63' };
                break;
            case 'O':
                IconComponent = TransgenderIcon;
                defaultSx = { color: '#9C27B0' };
                break;
        }
    } else if (item) {
        switch (item.toUpperCase()) {
            case 'WATER':
                IconComponent = WaterDropIcon;
                defaultSx = { color: '#03A9F4' };
                break;
            case 'FOOD':
                IconComponent = FastfoodIcon;
                defaultSx = { color: '#FF9800' };
                break;
            case 'MEDICATION':
                IconComponent = LocalPharmacyIcon;
                defaultSx = { color: '#4CAF50' };
                break;
            case 'AMMUNITION':
                IconComponent = SportsMmaIcon;
                defaultSx = { color: '#795548' };
                break;
        }
    }

    if (!IconComponent) {
        return null; // Or a default icon
    }

    // Merge default and custom styles
    const mergedSx = { ...defaultSx, ...sx };

    return <IconComponent sx={mergedSx} />;
};

export default IconRenderer;
