export interface BenchmarkConfig {
    readonly name: string;
    readonly fn: () => Promise<any>;
    readonly before?: (info: {
        count: number;
    }) => Promise<any>;
    readonly beforeAll?: () => Promise<any>;
    readonly maxTime?: number;
    /**
     * Number of cycles to be done before actual benchmark
     */
    readonly warmupCycles?: number;
}
export declare type BenchmarkFactories = Array<() => BenchmarkConfig>;
export interface Timings {
    readonly sampleCount: number;
    readonly meanTime: number;
    readonly relativeMarginOfError: number;
}
export declare class BenchmarkCycleDetails {
    /**
     * The name of the benchmark
     */
    readonly name: string;
    /**
     * The zero-based index of this cycyle
     */
    readonly index: number;
    /**
     * The number of iterations executed in this cycle
     */
    readonly iterationCount: number;
    /**
     * The total time spent so far
     */
    readonly elapsedTime: number;
    /**
     * The time, in seconds, spent on non-iteration tasks so far
     */
    readonly setUpTime: number;
    /**
     * The statistics collected up to this point
     */
    readonly timingsSoFar: Timings;
    constructor(config: {
        name: string;
        index: number;
        iterationCount: number;
        elapsedTime: number;
        setUpTime: number;
        timingsSoFar: Timings;
    });
}
export interface BenchmarkResultConfig {
    readonly cycles: number;
    readonly iterationCount: number;
    readonly meanTime: number;
    readonly relativeMarginOfError: number;
    readonly elapsedTime: number;
    readonly setUpTime: number;
    readonly cycleDetails: BenchmarkCycleDetails[];
    readonly samples: number[];
}
export declare class BenchmarkResult {
    /**
     * The number of cycles
     */
    readonly cycles: number;
    /**
     * Detailed information about each cycle
     */
    readonly cycleDetails: BenchmarkCycleDetails[];
    /**
     * The mean time, in seconds, per iteration
     */
    readonly meanTime: number;
    /**
     * The relative margin of error of the meanTime
     */
    readonly relativeMarginOfError: number;
    /**
     * The total time, in seconds, the whole benchmark took
     */
    readonly elapsedTime: number;
    /**
     * The total time spent on non-iteration tasks
     */
    readonly setUpTime: number;
    /**
     * The total number of iterations
     */
    readonly iterationCount: number;
    /**
     * The raw array of cycle times
     */
    readonly samples: number[];
    constructor(config: BenchmarkResultConfig);
    toString(): string;
    static add(...results: BenchmarkResult[]): BenchmarkResult;
}
export interface BenchmarkExecutionCallbacks {
    readonly onCycleDone?: (cycleDetails: BenchmarkCycleDetails) => void;
}
export declare function benchmark(config: BenchmarkConfig, callbacks?: BenchmarkExecutionCallbacks): Promise<BenchmarkResult>;
export declare function time(): number;
export declare function getTimings(samples: number[]): Timings;
