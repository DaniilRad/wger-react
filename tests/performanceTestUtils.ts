/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, waitFor } from "@testing-library/react";
import { performance } from "perf_hooks";

/**
 * Performance testing utilities for measuring component performance
 */

export interface PerformanceMetrics {
    renderTime: number;
    rerenderTime: number;
    memoryUsage: number;
    renderCount: number;
}

/**
 * Measure component render time
 */
export const measureRenderTime = async (component: React.ReactElement): Promise<number> => {
    const startTime = performance.now();
    render(component);
    await waitFor(() => {}, { timeout: 100 });
    const endTime = performance.now();

    return endTime - startTime;
};

/**
 * Measure component re-render time
 */
export const measureRerenderTime = async (
    component: React.ReactElement,
    triggerRerender: () => void
): Promise<number> => {
    const { rerender } = render(component);

    const startTime = performance.now();
    triggerRerender();
    rerender(component);
    await waitFor(() => {}, { timeout: 100 });
    const endTime = performance.now();

    return endTime - startTime;
};

/**
 * Count component renders using a custom hook
 */
export const createRenderCounter = () => {
    let count = 0;

    return {
        increment: () => {
            count++;
        },
        getCount: () => count,
        reset: () => {
            count = 0;
        },
    };
};

/**
 * Measure memory usage (Node.js environment)
 */
export const measureMemoryUsage = (): number => {
    if (typeof process !== "undefined" && process.memoryUsage) {
        const usage = process.memoryUsage();
        return usage.heapUsed / 1024 / 1024; // Convert to MB
    }
    return 0;
};

/**
 * Run performance benchmark
 */
export const runPerformanceBenchmark = async (
    testName: string,
    testFn: () => Promise<void>,
    iterations: number = 10
): Promise<{
    average: number;
    min: number;
    max: number;
    median: number;
}> => {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        await testFn();
        const endTime = performance.now();
        times.push(endTime - startTime);
    }

    times.sort((a, b) => a - b);

    const average = times.reduce((a, b) => a + b, 0) / times.length;
    const min = times[0];
    const max = times[times.length - 1];
    const median = times[Math.floor(times.length / 2)];

    console.log(`\n[Performance Benchmark] ${testName}`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average: ${average.toFixed(2)}ms`);
    console.log(`  Min: ${min.toFixed(2)}ms`);
    console.log(`  Max: ${max.toFixed(2)}ms`);
    console.log(`  Median: ${median.toFixed(2)}ms`);

    return { average, min, max, median };
};

/**
 * Performance test assertions
 */
export const expectPerformance = {
    toBeFasterThan: (actualTime: number, maxTime: number) => {
        if (actualTime > maxTime) {
            throw new Error(`Expected render time to be faster than ${maxTime}ms, but got ${actualTime.toFixed(2)}ms`);
        }
    },

    toBeWithinRange: (actualTime: number, minTime: number, maxTime: number) => {
        if (actualTime < minTime || actualTime > maxTime) {
            throw new Error(
                `Expected render time to be between ${minTime}ms and ${maxTime}ms, but got ${actualTime.toFixed(2)}ms`
            );
        }
    },

    toImproveBy: (baselineTime: number, optimizedTime: number, minImprovement: number) => {
        const improvement = ((baselineTime - optimizedTime) / baselineTime) * 100;
        if (improvement < minImprovement) {
            throw new Error(`Expected improvement of at least ${minImprovement}%, but got ${improvement.toFixed(2)}%`);
        }
    },
};

/**
 * Create a performance test wrapper
 */
export const createPerformanceTest = (
    componentName: string,
    thresholds: {
        maxRenderTime?: number;
        maxRerenderTime?: number;
        maxMemoryUsage?: number;
    }
) => {
    return {
        testRender: async (component: React.ReactElement) => {
            const renderTime = await measureRenderTime(component);

            if (thresholds.maxRenderTime) {
                expectPerformance.toBeFasterThan(renderTime, thresholds.maxRenderTime);
            }

            return renderTime;
        },

        testRerender: async (component: React.ReactElement, triggerRerender: () => void) => {
            const rerenderTime = await measureRerenderTime(component, triggerRerender);

            if (thresholds.maxRerenderTime) {
                expectPerformance.toBeFasterThan(rerenderTime, thresholds.maxRerenderTime);
            }

            return rerenderTime;
        },

        testMemory: () => {
            const memoryUsage = measureMemoryUsage();

            if (thresholds.maxMemoryUsage) {
                if (memoryUsage > thresholds.maxMemoryUsage) {
                    throw new Error(
                        `Memory usage (${memoryUsage.toFixed(2)}MB) exceeds threshold (${thresholds.maxMemoryUsage}MB)`
                    );
                }
            }

            return memoryUsage;
        },
    };
};

/**
 * Debounce function for testing
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, delay);
    };
};

/**
 * Mock localStorage for performance tests
 */
export const createMockLocalStorage = () => {
    let store: { [key: string]: string } = {};
    let operationCount = 0;

    return {
        getItem: (key: string) => {
            operationCount++;
            return store[key] || null;
        },
        setItem: (key: string, value: string) => {
            operationCount++;
            store[key] = value;
        },
        removeItem: (key: string) => {
            operationCount++;
            delete store[key];
        },
        clear: () => {
            operationCount++;
            store = {};
        },
        getOperationCount: () => operationCount,
        resetOperationCount: () => {
            operationCount = 0;
        },
        getStore: () => store,
    };
};
