/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConfigurableDashboard, AVAILABLE_WIDGETS } from "./ConfigurableDashboard";
import React from "react";

// Mock react-grid-layout
jest.mock("react-grid-layout", () => {
    const React = require("react");
    return {
        Responsive: ({ children, ...props }: any) => (
            <div data-testid="grid-layout" {...props}>
                {children}
            </div>
        ),
        WidthProvider: (Component: any) => Component,
    };
});

// Mock widget components
jest.mock("components/Dashboard/RoutineCard", () => ({
    RoutineCard: () => <div data-testid="routine-card">Routine Card</div>,
}));

jest.mock("components/Dashboard/NutritionCard", () => ({
    NutritionCard: () => <div data-testid="nutrition-card">Nutrition Card</div>,
}));

jest.mock("components/Dashboard/WeightCard", () => ({
    WeightCard: () => <div data-testid="weight-card">Weight Card</div>,
}));

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

describe("ConfigurableDashboard", () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    describe("Initial Rendering", () => {
        it("should render all widget components", () => {
            render(<ConfigurableDashboard />);

            expect(screen.getByTestId("routine-card")).toBeInTheDocument();
            expect(screen.getByTestId("nutrition-card")).toBeInTheDocument();
            expect(screen.getByTestId("weight-card")).toBeInTheDocument();
        });

        it("should render customize button", () => {
            render(<ConfigurableDashboard />);

            expect(screen.getByText("Customize")).toBeInTheDocument();
        });
    });

    describe("Edit Mode", () => {
        it("should enter edit mode when customize clicked", () => {
            render(<ConfigurableDashboard />);

            fireEvent.click(screen.getByText("Customize"));

            expect(screen.getByText("Done")).toBeInTheDocument();
            expect(screen.getByText(/Drag widgets to reposition/i)).toBeInTheDocument();
        });

        it("should show reset button in edit mode", () => {
            render(<ConfigurableDashboard />);

            fireEvent.click(screen.getByText("Customize"));

            expect(screen.getByTitle("Reset to Default Layout")).toBeInTheDocument();
        });
    });

    describe("LocalStorage Integration (Mocks)", () => {
        it("should load from localStorage on mount", () => {
            localStorageMock.getItem.mockReturnValue(null);

            render(<ConfigurableDashboard />);

            expect(localStorageMock.getItem).toHaveBeenCalledWith("dashboard-layout");
        });

        it("should handle corrupted data gracefully", () => {
            localStorageMock.getItem.mockReturnValue("invalid json");

            expect(() => render(<ConfigurableDashboard />)).not.toThrow();
        });
    });

    describe("Widget Configuration", () => {
        it("should have 3 widgets", () => {
            expect(AVAILABLE_WIDGETS).toHaveLength(3);
        });

        it("should have correct widget IDs", () => {
            const ids = AVAILABLE_WIDGETS.map((w) => w.id);
            expect(ids).toContain("routine");
            expect(ids).toContain("nutrition");
            expect(ids).toContain("weight");
        });
    });
});
