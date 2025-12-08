/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RoutineCard } from "./RoutineCard";
import { WeightCard } from "./WeightCard";
import { NutritionCard } from "./NutritionCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a mock query client for tests
const createMockQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
};

// Mock react-i18next
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "en" },
    }),
}));

// Mock utils
jest.mock("utils/url", () => ({
    makeLink: jest.fn((link: string, lang: string, params?: any) => `/mocked-link/${link}`),
    WgerLink: {
        ROUTINE_DETAIL: "routine-detail",
        ROUTINE_ADD: "routine-add",
        WEIGHT_OVERVIEW: "weight-overview",
        NUTRITION_DETAIL: "nutrition-detail",
    },
}));

jest.mock("utils/date", () => ({
    isSameDay: jest.fn(() => false),
    dateTimeToLocaleHHMM: jest.fn((date) => "12:00 PM"),
}));

jest.mock("utils/numbers", () => ({
    numberGramLocale: jest.fn((amount, lang) => `${amount}g`),
}));

describe("RoutineCard", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = createMockQueryClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Mock the query hook
    const mockUseActiveRoutineQuery = jest.fn();

    beforeEach(() => {
        jest.mock("components/WorkoutRoutines/queries", () => ({
            useActiveRoutineQuery: mockUseActiveRoutineQuery,
        }));
    });

    it("should show loading state", () => {
        mockUseActiveRoutineQuery.mockReturnValue({
            isLoading: true,
            data: null,
        });

        const { useActiveRoutineQuery } = require("components/WorkoutRoutines/queries");
        useActiveRoutineQuery.mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <RoutineCard />
            </QueryClientProvider>
        );

        // Loading placeholder should be shown
        expect(screen.queryByText("routines.routine")).not.toBeInTheDocument();
    });

    it("should show empty card when no routine data", () => {
        const { useActiveRoutineQuery } = require("components/WorkoutRoutines/queries");
        useActiveRoutineQuery.mockReturnValue({
            isLoading: false,
            data: null,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <RoutineCard />
            </QueryClientProvider>
        );

        expect(screen.getByText("routines.routine")).toBeInTheDocument();
    });

    it("should render routine data when available", () => {
        const mockRoutine = {
            id: 1,
            name: "Test Routine",
            dayDataCurrentIterationNoNulls: [
                {
                    date: new Date(),
                    day: {
                        id: 1,
                        description: "Test Day",
                        isRest: false,
                    },
                    slots: [],
                },
            ],
        };

        const { useActiveRoutineQuery } = require("components/WorkoutRoutines/queries");
        useActiveRoutineQuery.mockReturnValue({
            isLoading: false,
            data: mockRoutine,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <RoutineCard />
            </QueryClientProvider>
        );

        expect(screen.getByText("routines.routine")).toBeInTheDocument();
        expect(screen.getByText("seeDetails")).toBeInTheDocument();
    });
});

describe("WeightCard", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = createMockQueryClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should show loading state", () => {
        const { useBodyWeightQuery } = require("components/BodyWeight/queries");
        useBodyWeightQuery.mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <WeightCard />
            </QueryClientProvider>
        );

        // Loading state should be shown
        expect(screen.queryByText("weight")).not.toBeInTheDocument();
    });

    it("should show empty card when no weight data", () => {
        const { useBodyWeightQuery } = require("components/BodyWeight/queries");
        useBodyWeightQuery.mockReturnValue({
            isLoading: false,
            data: [],
        });

        render(
            <QueryClientProvider client={queryClient}>
                <WeightCard />
            </QueryClientProvider>
        );

        expect(screen.getByText("weight")).toBeInTheDocument();
    });

    it("should render weight data when available", () => {
        const mockWeightData = [
            { id: 1, weight: 70, date: new Date("2025-01-01") },
            { id: 2, weight: 69, date: new Date("2025-01-02") },
        ];

        const { useBodyWeightQuery } = require("components/BodyWeight/queries");
        useBodyWeightQuery.mockReturnValue({
            isLoading: false,
            data: mockWeightData,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <WeightCard />
            </QueryClientProvider>
        );

        expect(screen.getByText("weight")).toBeInTheDocument();
        expect(screen.getByText("seeDetails")).toBeInTheDocument();
    });

    it("should open modal when add button is clicked", () => {
        const mockWeightData = [{ id: 1, weight: 70, date: new Date() }];

        const { useBodyWeightQuery } = require("components/BodyWeight/queries");
        useBodyWeightQuery.mockReturnValue({
            isLoading: false,
            data: mockWeightData,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <WeightCard />
            </QueryClientProvider>
        );

        const addButton = screen.getByRole("button", { name: /addEntry/i });
        fireEvent.click(addButton);

        // Modal should open (check for modal title)
        expect(screen.getByText("add")).toBeInTheDocument();
    });
});

describe("NutritionCard", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = createMockQueryClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should show loading state", () => {
        const { useFetchLastNutritionalPlanQuery } = require("components/Nutrition/queries");
        useFetchLastNutritionalPlanQuery.mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <NutritionCard />
            </QueryClientProvider>
        );

        expect(screen.queryByText("nutritionalPlan")).not.toBeInTheDocument();
    });

    it("should show empty card when no nutrition plan", () => {
        const { useFetchLastNutritionalPlanQuery } = require("components/Nutrition/queries");
        useFetchLastNutritionalPlanQuery.mockReturnValue({
            isLoading: false,
            data: null,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <NutritionCard />
            </QueryClientProvider>
        );

        expect(screen.getByText("nutritionalPlan")).toBeInTheDocument();
    });

    it("should render nutrition plan when available", () => {
        const mockPlan = {
            id: 1,
            description: "Test Plan",
            meals: [
                {
                    id: 1,
                    name: "Breakfast",
                    time: new Date(),
                    items: [],
                },
            ],
            percentageValuesLoggedToday: 50,
            plannedNutritionalValues: { calories: 2000 },
            loggedNutritionalValuesToday: { calories: 1000 },
        };

        const { useFetchLastNutritionalPlanQuery } = require("components/Nutrition/queries");
        useFetchLastNutritionalPlanQuery.mockReturnValue({
            isLoading: false,
            data: mockPlan,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <NutritionCard />
            </QueryClientProvider>
        );

        expect(screen.getByText("nutritionalPlan")).toBeInTheDocument();
        expect(screen.getByText("Test Plan")).toBeInTheDocument();
    });

    it("should expand meal items when clicked", () => {
        const mockPlan = {
            id: 1,
            description: "Test Plan",
            meals: [
                {
                    id: 1,
                    name: "Breakfast",
                    time: new Date(),
                    items: [
                        {
                            id: 1,
                            ingredient: { name: "Oats", image: { url: "" } },
                            amount: 100,
                        },
                    ],
                },
            ],
            percentageValuesLoggedToday: 50,
            plannedNutritionalValues: { calories: 2000 },
            loggedNutritionalValuesToday: { calories: 1000 },
        };

        const { useFetchLastNutritionalPlanQuery } = require("components/Nutrition/queries");
        useFetchLastNutritionalPlanQuery.mockReturnValue({
            isLoading: false,
            data: mockPlan,
        });

        render(
            <QueryClientProvider client={queryClient}>
                <NutritionCard />
            </QueryClientProvider>
        );

        // Click to expand meal
        const mealButton = screen.getByRole("button", { name: /Breakfast/i });
        fireEvent.click(mealButton);

        // Meal items should be visible
        expect(screen.getByText("Oats")).toBeInTheDocument();
    });
});

describe("Widget Integration Tests", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = createMockQueryClient();
    });

    describe("DashboardCard Integration", () => {
        it("all widgets should use DashboardCard structure", () => {
            const mockRoutine = {
                id: 1,
                name: "Test Routine",
                dayDataCurrentIterationNoNulls: [],
            };

            const { useActiveRoutineQuery } = require("components/WorkoutRoutines/queries");
            useActiveRoutineQuery.mockReturnValue({
                isLoading: false,
                data: mockRoutine,
            });

            const { container } = render(
                <QueryClientProvider client={queryClient}>
                    <RoutineCard />
                </QueryClientProvider>
            );

            // Should have MUI Card structure
            expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
            expect(container.querySelector(".MuiCardHeader-root")).toBeInTheDocument();
            expect(container.querySelector(".MuiCardContent-root")).toBeInTheDocument();
            expect(container.querySelector(".MuiCardActions-root")).toBeInTheDocument();
        });

        it("all widgets should have proper responsive height", () => {
            const mockRoutine = {
                id: 1,
                name: "Test Routine",
                dayDataCurrentIterationNoNulls: [],
            };

            const { useActiveRoutineQuery } = require("components/WorkoutRoutines/queries");
            useActiveRoutineQuery.mockReturnValue({
                isLoading: false,
                data: mockRoutine,
            });

            const { container } = render(
                <QueryClientProvider client={queryClient}>
                    <RoutineCard />
                </QueryClientProvider>
            );

            const card = container.querySelector(".MuiCard-root");
            expect(card).toHaveStyle({ height: "100%" });
        });
    });
});
