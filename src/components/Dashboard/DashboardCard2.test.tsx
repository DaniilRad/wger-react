import { render, screen } from "@testing-library/react";
import { DashboardCard } from "./DashboardCard";
import React from "react";

describe("DashboardCard", () => {
    describe("Basic Rendering", () => {
        it("should render title correctly", () => {
            render(
                <DashboardCard title="Test Title">
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Test Title")).toBeInTheDocument();
        });

        it("should render subheader when provided", () => {
            render(
                <DashboardCard title="Test Title" subheader="Test Subheader">
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Test Subheader")).toBeInTheDocument();
        });

        it("should render children content", () => {
            render(
                <DashboardCard title="Test Title">
                    <div data-testid="test-content">Test Content</div>
                </DashboardCard>
            );

            expect(screen.getByTestId("test-content")).toBeInTheDocument();
            expect(screen.getByText("Test Content")).toBeInTheDocument();
        });

        it("should not render subheader when not provided", () => {
            const { container } = render(
                <DashboardCard title="Test Title">
                    <div>Content</div>
                </DashboardCard>
            );

            const subheader = container.querySelector(".MuiCardHeader-subheader");
            expect(subheader).not.toBeInTheDocument();
        });
    });

    describe("Actions", () => {
        it("should render actions when provided", () => {
            render(
                <DashboardCard title="Test Title" actions={<button>Test Action</button>}>
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Test Action")).toBeInTheDocument();
        });

        it("should not render CardActions when actions not provided", () => {
            const { container } = render(
                <DashboardCard title="Test Title">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardActions = container.querySelector(".MuiCardActions-root");
            expect(cardActions).not.toBeInTheDocument();
        });

        it("should render multiple actions", () => {
            render(
                <DashboardCard
                    title="Test Title"
                    actions={
                        <>
                            <button>Action 1</button>
                            <button>Action 2</button>
                        </>
                    }
                >
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Action 1")).toBeInTheDocument();
            expect(screen.getByText("Action 2")).toBeInTheDocument();
        });
    });

    describe("Header Action", () => {
        it("should render header action when provided", () => {
            render(
                <DashboardCard title="Test Title" headerAction={<button>Header Action</button>}>
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Header Action")).toBeInTheDocument();
        });
    });

    describe("Styling and Layout", () => {
        it("should apply default scrollable styling", () => {
            const { container } = render(
                <DashboardCard title="Test Title">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ overflow: "auto" });
        });

        it("should apply non-scrollable styling when scrollable is false", () => {
            const { container } = render(
                <DashboardCard title="Test Title" scrollable={false}>
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ overflow: "visible" });
        });

        it("should apply custom cardSx styles", () => {
            const { container } = render(
                <DashboardCard title="Test Title" cardSx={{ backgroundColor: "red" }}>
                    <div>Content</div>
                </DashboardCard>
            );

            const card = container.querySelector(".MuiCard-root");
            expect(card).toHaveStyle({ backgroundColor: "red" });
        });

        it("should apply custom contentSx styles", () => {
            const { container } = render(
                <DashboardCard title="Test Title" contentSx={{ padding: "0px" }}>
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ padding: "0px" });
        });

        it("should apply custom contentHeight", () => {
            const { container } = render(
                <DashboardCard title="Test Title" contentHeight="300px">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ height: "300px" });
        });

        it("should have flexbox layout on Card", () => {
            const { container } = render(
                <DashboardCard title="Test Title">
                    <div>Content</div>
                </DashboardCard>
            );

            const card = container.querySelector(".MuiCard-root");
            expect(card).toHaveStyle({
                height: "100%",
                display: "flex",
                flexDirection: "column",
            });
        });

        it("should have flexGrow on CardContent", () => {
            const { container } = render(
                <DashboardCard title="Test Title">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({
                flexGrow: 1,
                minHeight: 0,
            });
        });
    });

    describe("Integration Tests", () => {
        it("should render complete card with all props", () => {
            render(
                <DashboardCard
                    title="Complete Card"
                    subheader="With all features"
                    headerAction={<button>Header Button</button>}
                    actions={
                        <>
                            <button>Action 1</button>
                            <button>Action 2</button>
                        </>
                    }
                    scrollable={true}
                    contentHeight="400px"
                >
                    <div data-testid="complex-content">Complex Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Complete Card")).toBeInTheDocument();
            expect(screen.getByText("With all features")).toBeInTheDocument();
            expect(screen.getByText("Header Button")).toBeInTheDocument();
            expect(screen.getByText("Action 1")).toBeInTheDocument();
            expect(screen.getByText("Action 2")).toBeInTheDocument();
            expect(screen.getByTestId("complex-content")).toBeInTheDocument();
        });
    });
});
