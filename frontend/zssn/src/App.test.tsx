import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

describe("App Routing", () => {
    it("renders Landing Page on default route `/`", () => {
        window.history.pushState({}, "Landing Page", "/");
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText(/Welcome/i)).toBeInTheDocument(); // Adjust based on Landing Page text
    });

    it("renders Survivor Form on `/create-survivor` route", () => {
        window.history.pushState({}, "Create Survivor", "/create-survivor");
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText(/Create a Survivor/i)).toBeInTheDocument();
    });

    it("renders Survivor List on `/survivors` route", () => {
        window.history.pushState({}, "Survivors List", "/survivors");
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText(/Survivors/i)).toBeInTheDocument();
    });

    it("renders Survivor Details on `/survivors/:id` route", () => {
        window.history.pushState({}, "Survivor Details", "/survivors/1");
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText(/Survivor not found/i)).toBeInTheDocument(); // This is a fallback check
    });

    it("renders Update Location on `/update-location/:id` route", () => {
        window.history.pushState({}, "Update Location", "/update-location/1");
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText(/Update Survivor Location/i)).toBeInTheDocument();
    });
});
