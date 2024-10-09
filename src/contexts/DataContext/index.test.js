import { render, screen, waitFor } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

describe("When a data context is created", () => {
    it("a call is executed on the events.json file", async () => {
        // Mock the API call
        api.loadData = jest
            .fn()
            .mockResolvedValue({ events: [{ result: "ok" }] });

        const Component = () => {
            const { data } = useData();
            return <div>{data?.events[0]?.result}</div>;
        };

        // Render the component
        render(
            <DataProvider>
                <Component />
            </DataProvider>
        );

        // Wait for the asynchronous state updates and ensure the result is displayed
        await waitFor(() => expect(screen.getByText("ok")).toBeInTheDocument());
    });

    describe("and the events call failed", () => {
        it("the error is dispatched", async () => {
            // Mock console.error to prevent noisy logs in the test output
            window.console.error = jest.fn();

            // Mock API rejection
            api.loadData = jest
                .fn()
                .mockRejectedValue("error on calling events");

            const Component = () => {
                const { error } = useData();
                return <div>{error}</div>;
            };

            // Render the component
            render(
                <DataProvider>
                    <Component />
                </DataProvider>
            );

            // Wait for the error message to be displayed
            await waitFor(() =>
                expect(
                    screen.getByText("error on calling events")
                ).toBeInTheDocument()
            );
        });
    });

    it("api.loadData test", async () => {
        // Mock console.error to prevent noisy logs in the test output
        window.console.error = jest.fn();

        // Mock global fetch
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
        });

        const Component = () => {
            const { error } = useData();
            return <div>{error}</div>;
        };

        // Render the component
        render(
            <DataProvider>
                <Component />
            </DataProvider>
        );

        // No specific assertion in this test, it just mocks and renders
    });
});
