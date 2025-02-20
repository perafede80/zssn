import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SurvivorForm from "../SurvivorForm";
import { createSurvivor } from "../api/survivorApi";

jest.mock("../api/survivorApi");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("SurvivorForm Component", () => {
    it("prevents submission without inventory", () => {
        render(
            <BrowserRouter>
                <SurvivorForm />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Alice" } });
        fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: "30" } });
        fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: "50" } });
        fireEvent.change(screen.getByLabelText(/Longitude/i), { target: { value: "60" } });
        fireEvent.click(screen.getByText(/Create Survivor/i));

        expect(screen.getByText(/Please select at least one inventory item/i)).toBeInTheDocument();
    });

    it("creates a survivor when valid data is provided", async () => {
        (createSurvivor as jest.Mock).mockResolvedValue({});
        render(
            <BrowserRouter>
                <SurvivorForm />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Alice" } });
        fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: "30" } });
        fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: "50" } });
        fireEvent.change(screen.getByLabelText(/Longitude/i), { target: { value: "60" } });

        // Add inventory item
        fireEvent.click(screen.getByText(/Select Inventory/i));
        fireEvent.click(screen.getByText(/Water/i));
        fireEvent.click(screen.getByText(/Done/i));

        fireEvent.click(screen.getByText(/Create Survivor/i));

        await waitFor(() =>
            expect(createSurvivor).toHaveBeenCalledWith(expect.objectContaining({ name: "Alice" }))
        );
        expect(mockNavigate).toHaveBeenCalledWith("/survivors");
    });
});
