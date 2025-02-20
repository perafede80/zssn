import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UpdateLocation from "../UpdateLocation";
import { updateSurvivorLocation, getSurvivor } from "../api/survivorApi";

jest.mock("../api/survivorApi");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
    useLocation: () => ({ state: { survivor: { id: "1", name: "John Doe", latitude: 10, longitude: 20 } } })
}));

describe("UpdateLocation Component", () => {
    it("renders survivor details correctly", () => {
        render(
            <BrowserRouter>
                <UpdateLocation />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/Survivor Name/i)).toHaveValue("John Doe");
        expect(screen.getByLabelText(/Latitude/i)).toHaveValue("10");
        expect(screen.getByLabelText(/Longitude/i)).toHaveValue("20");
    });

    it("updates location when form is submitted", async () => {
        (updateSurvivorLocation as jest.Mock).mockResolvedValue({});

        render(
            <BrowserRouter>
                <UpdateLocation />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: "15" } });
        fireEvent.change(screen.getByLabelText(/Longitude/i), { target: { value: "30" } });
        fireEvent.click(screen.getByText(/Update Location/i));

        await waitFor(() => expect(updateSurvivorLocation).toHaveBeenCalledWith("1", 15, 30));
        expect(mockNavigate).toHaveBeenCalledWith("/survivors/1", expect.anything());
    });
});
