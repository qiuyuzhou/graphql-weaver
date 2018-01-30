import { BenchmarkConfig, BenchmarkExecutionCallbacks, BenchmarkResult } from './async-bench';
export interface ComparisonBenchmarkResult {
    readonly candidates: CandidateResult[];
}
export interface CandidateResult {
    readonly config: BenchmarkConfig;
    readonly benchmark: BenchmarkResult;
    readonly isFastest: boolean;
    readonly overheadMin: number;
    readonly relativeOverheadMin: number;
    readonly overheadMax: number;
    readonly relativeOverheadMax: number;
}
export declare function runComparison(benchmarkConfigs: BenchmarkConfig[], callbacks?: BenchmarkExecutionCallbacks): Promise<ComparisonBenchmarkResult>;
