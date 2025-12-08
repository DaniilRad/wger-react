import { render, screen } from "@testing-library/react";
import { DashboardCard } from "./DashboardCard";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

describe("DashboardCard", () => {
    describe("Basic Rendering", () => {
        it("should render with title", () => {
            render(
                <DashboardCard title="Test Widget">
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Test Widget")).toBeInTheDocument();
        });

        it("should render with title and subheader", () => {
            render(
                <DashboardCard title="Test Widget" subheader="Test Description">
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Test Widget")).toBeInTheDocument();
            expect(screen.getByText("Test Description")).toBeInTheDocument();
        });

        it("should render children content", () => {
            render(
                <DashboardCard title="Test Widget">
                    <div data-testid="test-content">Test Content</div>
                </DashboardCard>
            );

            expect(screen.getByTestId("test-content")).toBeInTheDocument();
            expect(screen.getByText("Test Content")).toBeInTheDocument();
        });

        it("should render without subheader when not provided", () => {
            const { container } = render(
                <DashboardCard title="Test Widget">
                    <div>Content</div>
                </DashboardCard>
            );

            // Subheader should not be present
            const cardHeader = container.querySelector(".MuiCardHeader-root");
            expect(cardHeader).toBeInTheDocument();
            expect(cardHeader?.querySelector(".MuiCardHeader-subheader")).toBeNull();
        });
    });

    describe("Actions Rendering", () => {
        it("should render actions when provided", () => {
            render(
                <DashboardCard title="Test Widget" actions={<Button data-testid="action-button">Action</Button>}>
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByTestId("action-button")).toBeInTheDocument();
        });

        it("should not render CardActions when actions prop is not provided", () => {
            const { container } = render(
                <DashboardCard title="Test Widget">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardActions = container.querySelector(".MuiCardActions-root");
            expect(cardActions).toBeNull();
        });

        it("should render multiple actions", () => {
            render(
                <DashboardCard
                    title="Test Widget"
                    actions={
                        <>
                            <Button data-testid="action-1">Action 1</Button>
                            <Button data-testid="action-2">Action 2</Button>
                        </>
                    }
                >
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByTestId("action-1")).toBeInTheDocument();
            expect(screen.getByTestId("action-2")).toBeInTheDocument();
        });
    });

    describe("Header Action Rendering", () => {
        it("should render header action when provided", () => {
            render(
                <DashboardCard
                    title="Test Widget"
                    headerAction={
                        <IconButton data-testid="header-action">
                            <AddIcon />
                        </IconButton>
                    }
                >
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByTestId("header-action")).toBeInTheDocument();
        });

        it("should not render header action when not provided", () => {
            const { container } = render(
                <DashboardCard title="Test Widget">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardHeader = container.querySelector(".MuiCardHeader-root");
            expect(cardHeader?.querySelector(".MuiCardHeader-action")).toBeNull();
        });
    });

    describe("Styling and Layout", () => {
        it("should apply default flexbox styles to Card", () => {
            const { container } = render(
                <DashboardCard title="Test Widget">
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

        it("should apply default styles to CardContent", () => {
            const { container } = render(
                <DashboardCard title="Test Widget">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({
                flexGrow: "1",
                overflow: "auto",
                minHeight: "0",
            });
        });

        it("should apply custom cardSx prop", () => {
            const { container } = render(
                <DashboardCard title="Test Widget" cardSx={{ backgroundColor: "red" }}>
                    <div>Content</div>
                </DashboardCard>
            );

            const card = container.querySelector(".MuiCard-root");
            expect(card).toHaveStyle({ backgroundColor: "red" });
        });

        it("should apply custom contentSx prop", () => {
            const { container } = render(
                <DashboardCard title="Test Widget" contentSx={{ padding: "0px" }}>
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ padding: "0px" });
        });

        it("should apply custom contentHeight prop", () => {
            const { container } = render(
                <DashboardCard title="Test Widget" contentHeight="300px">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ height: "300px" });
        });
    });

    describe("Scrollable Behavior", () => {
        it("should be scrollable by default", () => {
            const { container } = render(
                <DashboardCard title="Test Widget">
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ overflow: "auto" });
        });

        it("should not be scrollable when scrollable is false", () => {
            const { container } = render(
                <DashboardCard title="Test Widget" scrollable={false}>
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ overflow: "visible" });
        });

        it("should be scrollable when explicitly set to true", () => {
            const { container } = render(
                <DashboardCard title="Test Widget" scrollable={true}>
                    <div>Content</div>
                </DashboardCard>
            );

            const cardContent = container.querySelector(".MuiCardContent-root");
            expect(cardContent).toHaveStyle({ overflow: "auto" });
        });
    });

    describe("Complex Scenarios", () => {
        it("should render with all props provided", () => {
            render(
                <DashboardCard
                    title="Complex Widget"
                    subheader="With all features"
                    headerAction={
                        <IconButton data-testid="header-btn">
                            <AddIcon />
                        </IconButton>
                    }
                    actions={
                        <>
                            <Button data-testid="action-btn-1">Action 1</Button>
                            <Button data-testid="action-btn-2">Action 2</Button>
                        </>
                    }
                    scrollable={false}
                    contentHeight="400px"
                    cardSx={{ border: "1px solid red" }}
                    contentSx={{ padding: "16px" }}
                >
                    <div data-testid="complex-content">Complex Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Complex Widget")).toBeInTheDocument();
            expect(screen.getByText("With all features")).toBeInTheDocument();
            expect(screen.getByTestId("header-btn")).toBeInTheDocument();
            expect(screen.getByTestId("action-btn-1")).toBeInTheDocument();
            expect(screen.getByTestId("action-btn-2")).toBeInTheDocument();
            expect(screen.getByTestId("complex-content")).toBeInTheDocument();
        });

        it("should handle empty string as subheader", () => {
            render(
                <DashboardCard title="Test Widget" subheader="">
                    <div>Content</div>
                </DashboardCard>
            );

            expect(screen.getByText("Test Widget")).toBeInTheDocument();
        });

        it("should render nested complex children", () => {
            render(
                <DashboardCard title="Test Widget">
                    <div>
                        <ul data-testid="nested-list">
                            <li>Item 1</li>
                            <li>Item 2</li>
                            <li>Item 3</li>
                        </ul>
                    </div>
                </DashboardCard>
            );

            const list = screen.getByTestId("nested-list");
            expect(list).toBeInTheDocument();
            expect(list.querySelectorAll("li")).toHaveLength(3);
        });
    });

    describe("CardActions Layout", () => {
        it("should apply correct flex styles to CardActions", () => {
            const { container } = render(
                <DashboardCard title="Test Widget" actions={<Button>Action</Button>}>
                    <div>Content</div>
                </DashboardCard>
            );

            const cardActions = container.querySelector(".MuiCardActions-root");
            expect(cardActions).toHaveStyle({
                justifyContent: "space-between",
                alignItems: "flex-start",
            });
        });
    });
});
