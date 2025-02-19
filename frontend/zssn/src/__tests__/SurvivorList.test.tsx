import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import SurvivorList from "../components/SurvivorList";
import { fetchSurvivors } from "../api/survivorApi";
import { Survivor } from "../models/survivor.model";
import { Gender } from "../enums/gender.enums";

// Mock the API call
jest.mock("../api/survivorApi", () => ({
    fetchSurvivors: jest.fn(),
}));

describe("SurvivorList Component", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("shows loading indicator while fetching survivors", () => {
        act(() => {
            render(<SurvivorList />);
        });

        expect(screen.getByRole("progressbar")).toBeInTheDocument(); // Checks if CircularProgress is visible
    });

    test("displays survivors when API call is successful", async () => {
        const mockSurvivors: Survivor[] = [
            { "id": 1, "name": "John Doe", "age": 30, "gender": Gender.Male, "latitude": 88.0, "longitude": 50.0, "is_infected": false, "reports_count": 0, "inventory": [] },
            { "id": 2, "name": "Jane Doe", "age": 25, "gender": Gender.Female, "latitude": 88.0, "longitude": 50.0, "is_infected": false, "reports_count": 0, "inventory": [] }
        ];

        (fetchSurvivors as jest.Mock).mockResolvedValueOnce(mockSurvivors);


        await act(async () => {
            render(<SurvivorList />);
        });

        await waitFor(() => expect(screen.getByText("John Doe")).toBeInTheDocument());
        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    test("displays an error message when API call fails", async () => {
        (fetchSurvivors as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));


        await act(async () => {
            render(<SurvivorList />);
        });

        await waitFor(() => expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument());
    });
});
