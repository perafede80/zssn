import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SurvivorCard from "../SurvivorCard";
import { Survivor } from "../models/survivor.model";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const mockSurvivor: Survivor = {
    id: "1",
    name: "John Doe",
    age: 25,
    gender: "M",
    latitude: 45,
    longitude: 90,
    inventory: [{ item: "Food", quantity: 2 }]
};

describe("SurvivorCard Component", () => {
    it("renders survivor details correctly", () => {
        render(
            <BrowserRouter>
                <SurvivorCard survivor={mockSurvivor} />
            </BrowserRouter>
        );

        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/Age: 25/i)).toBeInTheDocument();
        expect(screen.getByText(/Food/i)).toBeInTheDocument();
    });

    it("navigates to survivor details when button is clicked", () => {
        render(
            <BrowserRouter>
                <SurvivorCard survivor={mockSurvivor} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/View Details/i));
        expect(mockNavigate).toHaveBeenCalledWith("/survivors/1", expect.anything());
    });
});
