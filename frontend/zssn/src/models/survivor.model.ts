import { Gender } from "../enums/gender.enums";

export interface Survivor {
    id: number;
    name: string;
    age: number;
    gender: Gender;
    latitude: number;
    longitude: number;
    is_infected: boolean;
    reports_count: number;
    inventory?: InventoryItem[]; 
}

export interface InventoryItem {
    item: string; 
    quantity: number;
}