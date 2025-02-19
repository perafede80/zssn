import { Gender } from "../enums/gender.enums";

export interface Survivor {
    id: number;
    name: string;
    age: number;
    gender: Gender;
    latitude: number;
    longitude: number;
    inventory?: { item: string; quantity: number }[]; // Optional inventory field
}
