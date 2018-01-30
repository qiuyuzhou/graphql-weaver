"use strict";
// asynchronous benchmarks
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TARGET_RELATIVE_MARGIN_OF_ERROR = 0.02;
var DEFAULT_MAX_TIME = 30;
var INITIAL_ITERATION_COUNT = 1;
var TARGET_CYCLE_TIME = DEFAULT_MAX_TIME / 10;
var INCLUDE_INITIAL_SETUP_IN_MAX_TIME = false; // makes million-docs-tests feasable
var BenchmarkCycleDetails = /** @class */ (function () {
    function BenchmarkCycleDetails(config) {
        this.name = config.name;
        this.index = config.index;
        this.iterationCount = config.iterationCount;
        this.elapsedTime = config.elapsedTime;
        this.setUpTime = config.setUpTime;
        this.timingsSoFar = config.timingsSoFar;
    }
    return BenchmarkCycleDetails;
}());
exports.BenchmarkCycleDetails = BenchmarkCycleDetails;
var BenchmarkResult = /** @class */ (function () {
    function BenchmarkResult(config) {
        this.cycles = config.cycles;
        this.meanTime = config.meanTime;
        this.relativeMarginOfError = config.relativeMarginOfError;
        this.elapsedTime = config.elapsedTime;
        this.setUpTime = config.setUpTime;
        this.cycleDetails = config.cycleDetails;
        this.iterationCount = config.iterationCount;
        this.samples = config.samples;
    }
    BenchmarkResult.prototype.toString = function () {
        return (this.meanTime * 1000).toFixed(3) + " ms per iteration (\u00B1" + (this.relativeMarginOfError * 100).toFixed(2) + "%)";
    };
    BenchmarkResult.add = function () {
        var results = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            results[_i] = arguments[_i];
        }
        var samples = results.reduce(function (value, r) { return value.concat(r.samples); }, []);
        var timings = getTimings(samples);
        return new BenchmarkResult({
            cycles: results.reduce(function (value, r) { return value + r.cycles; }, 0),
            cycleDetails: results.reduce(function (value, r) { return value.concat(r.cycleDetails); }, []),
            meanTime: timings.meanTime,
            relativeMarginOfError: timings.relativeMarginOfError,
            elapsedTime: results.reduce(function (value, r) { return value + r.elapsedTime; }, 0),
            setUpTime: results.reduce(function (value, r) { return value + r.setUpTime; }, 0),
            iterationCount: results.reduce(function (value, r) { return value + r.iterationCount; }, 0),
            samples: samples
        });
    };
    return BenchmarkResult;
}());
exports.BenchmarkResult = BenchmarkResult;
var stats = require("stats-lite");
function benchmark(config, callbacks) {
    return __awaiter(this, void 0, void 0, function () {
        function cycle(count) {
            return __awaiter(this, void 0, void 0, function () {
                var timeBefore, i, timeAfter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!config.before) return [3 /*break*/, 2];
                            return [4 /*yield*/, config.before({ count: count })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            timeBefore = time();
                            i = 0;
                            _a.label = 3;
                        case 3:
                            if (!(i < count)) return [3 /*break*/, 6];
                            return [4 /*yield*/, config.fn()];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            i++;
                            return [3 /*break*/, 3];
                        case 6:
                            timeAfter = time();
                            return [2 /*return*/, [(timeAfter - timeBefore) / count]];
                    }
                });
            });
        }
        function cycleDetailed(count) {
            return __awaiter(this, void 0, void 0, function () {
                var times, i, timeBefore, timeAfter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!config.before) return [3 /*break*/, 2];
                            return [4 /*yield*/, config.before({ count: count })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            times = Array(count);
                            i = 0;
                            _a.label = 3;
                        case 3:
                            if (!(i < count)) return [3 /*break*/, 6];
                            timeBefore = time();
                            return [4 /*yield*/, config.fn()];
                        case 4:
                            _a.sent();
                            timeAfter = time();
                            times[i] = timeAfter - timeBefore;
                            _a.label = 5;
                        case 5:
                            i++;
                            return [3 /*break*/, 3];
                        case 6: return [2 /*return*/, times];
                    }
                });
            });
        }
        var startTime, elapsedTimeForInitialSetUp, samples, cycleDetails, state, iterationCount, cycleFn, netTimes, netTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = time();
                    if (!config.beforeAll) return [3 /*break*/, 2];
                    return [4 /*yield*/, config.beforeAll()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    elapsedTimeForInitialSetUp = time() - startTime;
                    samples = [];
                    cycleDetails = [];
                    state = {
                        elapsedTime: 0,
                        elapsedNetTime: 0,
                        elapsedTimeForInitialSetUp: elapsedTimeForInitialSetUp,
                        cycles: 0,
                        iterationCount: 0,
                        config: config,
                        timings: getTimings(samples)
                    };
                    if (!config.warmupCycles) return [3 /*break*/, 4];
                    return [4 /*yield*/, cycle(config.warmupCycles)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 6];
                    iterationCount = nextIterationCount(state);
                    cycleFn = iterationCount > 10000 ? cycle : cycleDetailed;
                    if (!iterationCount) {
                        return [3 /*break*/, 6];
                    }
                    return [4 /*yield*/, cycleFn(iterationCount)];
                case 5:
                    netTimes = _a.sent();
                    netTime = stats.sum(netTimes);
                    samples.push.apply(samples, netTimes);
                    state = {
                        timings: getTimings(samples),
                        config: state.config,
                        cycles: state.cycles + 1,
                        iterationCount: state.iterationCount + iterationCount,
                        elapsedTime: time() - startTime,
                        elapsedNetTime: state.elapsedNetTime + netTime,
                        elapsedTimeForInitialSetUp: state.elapsedTimeForInitialSetUp
                    };
                    // Report status
                    cycleDetails.push(new BenchmarkCycleDetails({
                        name: config.name,
                        index: state.cycles - 1,
                        elapsedTime: state.elapsedTime,
                        setUpTime: state.elapsedTime - state.elapsedNetTime,
                        iterationCount: iterationCount,
                        timingsSoFar: state.timings
                    }));
                    if (callbacks && callbacks.onCycleDone) {
                        callbacks.onCycleDone(cycleDetails[cycleDetails.length - 1]);
                    }
                    return [3 /*break*/, 4];
                case 6: return [2 /*return*/, new BenchmarkResult({
                        meanTime: state.timings.meanTime,
                        relativeMarginOfError: state.timings.relativeMarginOfError,
                        cycles: cycleDetails.length,
                        iterationCount: state.iterationCount,
                        elapsedTime: state.elapsedTime,
                        setUpTime: state.elapsedTime - state.elapsedNetTime,
                        cycleDetails: cycleDetails,
                        samples: samples
                    })];
            }
        });
    });
}
exports.benchmark = benchmark;
function nextIterationCount(state) {
    var maxTime = state.config.maxTime || DEFAULT_MAX_TIME;
    var remainingTime = maxTime - state.elapsedTime;
    if (!INCLUDE_INITIAL_SETUP_IN_MAX_TIME) {
        // this time is included in elapsedTime, so give it back
        remainingTime += state.elapsedTimeForInitialSetUp;
    }
    // Always do at least one cycle
    if (state.cycles == 0) {
        return INITIAL_ITERATION_COUNT;
    }
    // Already out of time?
    if (remainingTime <= 0) {
        return 0;
    }
    // We're accurate enough
    if (state.timings.relativeMarginOfError < TARGET_RELATIVE_MARGIN_OF_ERROR) {
        return 0;
    }
    // be very careful, but do not abort test just because we have no confidence
    var errorFactor = Math.min(state.timings.relativeMarginOfError + 1, 10);
    // Do we still have time for setup?
    var meanSetUpTime = (state.elapsedTime - state.elapsedNetTime - state.elapsedTimeForInitialSetUp) / state.cycles;
    if (remainingTime < meanSetUpTime) {
        return 0;
    }
    // try to get to the target cycle time
    var remainingNetTime = remainingTime - meanSetUpTime;
    // we don't include the errorFactor in meanTime because it does not matter if a iteration is too long as long as we
    // don't overshoot the remaining time
    var remainingNetTimeWithSafetyMargin = remainingNetTime / errorFactor;
    var targetNetTime = Math.min(remainingNetTimeWithSafetyMargin, TARGET_CYCLE_TIME);
    return Math.round(targetNetTime / state.timings.meanTime);
}
function time() {
    var hrTime = process.hrtime();
    return hrTime[0] + hrTime[1] / 1000000000;
}
exports.time = time;
/**
 * T-Distribution two-tailed critical values for 95% confidence.
 * For more info see http://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm.
 */
var tTable = {
    '1': 12.706, '2': 4.303, '3': 3.182, '4': 2.776, '5': 2.571, '6': 2.447,
    '7': 2.365, '8': 2.306, '9': 2.262, '10': 2.228, '11': 2.201, '12': 2.179,
    '13': 2.16, '14': 2.145, '15': 2.131, '16': 2.12, '17': 2.11, '18': 2.101,
    '19': 2.093, '20': 2.086, '21': 2.08, '22': 2.074, '23': 2.069, '24': 2.064,
    '25': 2.06, '26': 2.056, '27': 2.052, '28': 2.048, '29': 2.045, '30': 2.042,
    'infinity': 1.96
};
function getTimings(samples) {
    var mean = stats.mean(samples);
    // Compute the sample standard deviation (estimate of the population standard deviation).
    var sd = stats.stdev(samples);
    // Compute the standard error of the mean (a.k.a. the standard deviation of the sampling distribution of the sample mean).
    var sem = sd / Math.sqrt(samples.length);
    // Compute the degrees of freedom.
    var df = samples.length - 1;
    // Compute the critical value.
    var critical = tTable[Math.round(df) || 1] || tTable['infinity'];
    // Compute the margin of error.
    var moe = sem * critical;
    // Compute the relative margin of error.
    var rme = (moe / mean) || Infinity;
    return {
        relativeMarginOfError: rme,
        meanTime: mean,
        sampleCount: samples.length
    };
}
exports.getTimings = getTimings;
//# sourceMappingURL=async-bench.js.map