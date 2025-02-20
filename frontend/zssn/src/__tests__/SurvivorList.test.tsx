import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SurvivorList from "../components/SurvivorList";
import { fetchSurvivors } from "../api/survivorApi";

jest.mock("../api/survivorApi");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("SurvivorList Component", () => {
    it("displays loading indicator while fetching survivors", () => {
        (fetchSurvivors as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(
            <BrowserRouter>
                <SurvivorList />
            </BrowserRouter>
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("displays survivors when API call succeeds", async () => {
        (fetchSurvivors as jest.Mock).mockResolvedValue([
            { id: "1", name: "John Doe", age: 30, gender: "M", latitude: 45, longitude: 90, inventory: [] },
            { id: "2", name: "Jane Doe", age: 25, gender: "F", latitude: 50, longitude: 100, inventory: [] }
        ]);

        render(
            <BrowserRouter>
                <SurvivorList />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());
        expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });

    it("displays an error message when API call fails", async () => {
        (fetchSurvivors as jest.Mock).mockRejectedValue(new Error("API error"));

        render(
            <BrowserRouter>
                <SurvivorList />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByText(/API error/i)).toBeInTheDocument());
    });

    it("navigates to landing page when 'Back to Launch Page' is clicked", () => {
        render(
            <BrowserRouter>
                <SurvivorList />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/Back to Launch Page/i));
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
