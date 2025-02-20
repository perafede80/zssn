import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SurvivorDetail from "../SurvivorDetails";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
    useLocation: () => ({
        state: {
            survivor: {
                id: "1",
                name: "Jane Doe",
                age: 30,
                gender: "F",
                latitude: 40,
                longitude: 70,
                inventory: [{ item: "Water", quantity: 3 }]
            }
        }
    })
}));

describe("SurvivorDetail Component", () => {
    it("displays survivor details correctly", () => {
        render(
            <BrowserRouter>
                <SurvivorDetail />
            </BrowserRouter>
        );

        expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/Age: 30/i)).toBeInTheDocument();
        expect(screen.getByText(/40, 70/i)).toBeInTheDocument();
        expect(screen.getByText(/Water/i)).toBeInTheDocument();
    });

    it("navigates to update location when button is clicked", () => {
        render(
            <BrowserRouter>
                <SurvivorDetail />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/Update Location/i));
        expect(mockNavigate).toHaveBeenCalledWith("/update-location/1", expect.anything());
    });
});
