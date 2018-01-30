"use strict";
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
var async_bench_1 = require("./async-bench");
var utils_1 = require("../../../src/utils/utils");
var COMPARISON_ITERATIONS = 3;
function runComparison(benchmarkConfigs, callbacks) {
    return __awaiter(this, void 0, void 0, function () {
        var resultMap, configMap, i, _i, benchmarkConfigs_1, config, candidateResult, benchmarkResult, benchmarkResults, orderedResults, fastestSamples, fastestResults, candidates, nonFastestResults, _loop_1, _a, nonFastestResults_1, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resultMap = new Map();
                    configMap = utils_1.arrayToObject(benchmarkConfigs, function (config) { return config.name; });
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < COMPARISON_ITERATIONS)) return [3 /*break*/, 6];
                    _i = 0, benchmarkConfigs_1 = benchmarkConfigs;
                    _b.label = 2;
                case 2:
                    if (!(_i < benchmarkConfigs_1.length)) return [3 /*break*/, 5];
                    config = benchmarkConfigs_1[_i];
                    candidateResult = utils_1.getOrSetFromMap(resultMap, config.name, function () { return []; });
                    return [4 /*yield*/, async_bench_1.benchmark(config, callbacks)];
                case 3:
                    benchmarkResult = _b.sent();
                    candidateResult.push(benchmarkResult);
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    benchmarkResults = Array.from(utils_1.mapMapValues(resultMap, function (results, name) { return ({
                        result: async_bench_1.BenchmarkResult.add.apply(async_bench_1.BenchmarkResult, results),
                        config: configMap[name],
                        name: name
                    }); }).values());
                    orderedResults = benchmarkResults.sort(function (lhs, rhs) {
                        if (getPessimisticMean(lhs.result) > getPessimisticMean(rhs.result)) {
                            return 1;
                        }
                        return -1;
                    });
                    fastestSamples = orderedResults[0].result.samples;
                    fastestResults = orderedResults.filter(function (result) { return compare(result.result.samples, fastestSamples) >= 0; });
                    candidates = fastestResults.map(function (res) { return ({
                        config: res.config, benchmark: res.result,
                        isFastest: true, overheadMin: 0, relativeOverheadMin: 0, overheadMax: 0, relativeOverheadMax: 0
                    }); });
                    nonFastestResults = orderedResults.filter(function (result) { return compare(result.result.samples, fastestSamples) < 0; });
                    _loop_1 = function (result) {
                        var calculateOverhead = function (predicate) {
                            var effectiveMax = (getPessimisticMean(result.result) - getPessimisticMean(fastestResults[0].result)) * 2;
                            var steps = 20;
                            var min = 0;
                            var max = Infinity;
                            var _loop_2 = function (i) {
                                var handicap = (min + effectiveMax) / 2;
                                var handicappedFastestSamples = fastestSamples.map(function (sample) { return sample + handicap; });
                                if (predicate(compare(result.result.samples, handicappedFastestSamples))) {
                                    // with this much handicap, we have reached the fastest, so overhead can't be even worse
                                    max = handicap;
                                    effectiveMax = handicap;
                                }
                                else {
                                    // we didn't catch up, so overhead must be worse than handicap
                                    min = handicap;
                                    if (!isFinite(max)) {
                                        effectiveMax *= 2;
                                    }
                                }
                                if (max / min < 1.0001) {
                                    return "break";
                                }
                            };
                            for (var i = 0; i < steps; i++) {
                                var state_1 = _loop_2(i);
                                if (state_1 === "break")
                                    break;
                            }
                            return max;
                        };
                        var overheadMin = calculateOverhead(function (x) { return x >= 0; });
                        var overheadMax = calculateOverhead(function (x) { return x > 0; });
                        candidates.push({
                            config: result.config,
                            benchmark: result.result,
                            isFastest: false,
                            overheadMin: overheadMin,
                            relativeOverheadMin: overheadMin / result.result.meanTime,
                            overheadMax: overheadMax,
                            relativeOverheadMax: overheadMax / result.result.meanTime
                        });
                    };
                    for (_a = 0, nonFastestResults_1 = nonFastestResults; _a < nonFastestResults_1.length; _a++) {
                        result = nonFastestResults_1[_a];
                        _loop_1(result);
                    }
                    return [2 /*return*/, { candidates: candidates }];
            }
        });
    });
}
exports.runComparison = runComparison;
function getPessimisticMean(result) {
    return result.meanTime * (1 + result.relativeMarginOfError);
}
/**
 * Critical Mann-Whitney U-values for 95% confidence.
 * For more info see http://www.saburchill.com/IBbiology/stats/003.html.
 */
var uTable = {
    '5': [0, 1, 2],
    '6': [1, 2, 3, 5],
    '7': [1, 3, 5, 6, 8],
    '8': [2, 4, 6, 8, 10, 13],
    '9': [2, 4, 7, 10, 12, 15, 17],
    '10': [3, 5, 8, 11, 14, 17, 20, 23],
    '11': [3, 6, 9, 13, 16, 19, 23, 26, 30],
    '12': [4, 7, 11, 14, 18, 22, 26, 29, 33, 37],
    '13': [4, 8, 12, 16, 20, 24, 28, 33, 37, 41, 45],
    '14': [5, 9, 13, 17, 22, 26, 31, 36, 40, 45, 50, 55],
    '15': [5, 10, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59, 64],
    '16': [6, 11, 15, 21, 26, 31, 37, 42, 47, 53, 59, 64, 70, 75],
    '17': [6, 11, 17, 22, 28, 34, 39, 45, 51, 57, 63, 67, 75, 81, 87],
    '18': [7, 12, 18, 24, 30, 36, 42, 48, 55, 61, 67, 74, 80, 86, 93, 99],
    '19': [7, 13, 19, 25, 32, 38, 45, 52, 58, 65, 72, 78, 85, 92, 99, 106, 113],
    '20': [8, 14, 20, 27, 34, 41, 48, 55, 62, 69, 76, 83, 90, 98, 105, 112, 119, 127],
    '21': [8, 15, 22, 29, 36, 43, 50, 58, 65, 73, 80, 88, 96, 103, 111, 119, 126, 134, 142],
    '22': [9, 16, 23, 30, 38, 45, 53, 61, 69, 77, 85, 93, 101, 109, 117, 125, 133, 141, 150, 158],
    '23': [9, 17, 24, 32, 40, 48, 56, 64, 73, 81, 89, 98, 106, 115, 123, 132, 140, 149, 157, 166, 175],
    '24': [10, 17, 25, 33, 42, 50, 59, 67, 76, 85, 94, 102, 111, 120, 129, 138, 147, 156, 165, 174, 183, 192],
    '25': [10, 18, 27, 35, 44, 53, 62, 71, 80, 89, 98, 107, 117, 126, 135, 145, 154, 163, 173, 182, 192, 201, 211],
    '26': [
        11, 19, 28, 37, 46, 55, 64, 74, 83, 93, 102, 112, 122, 132, 141, 151, 161, 171, 181, 191, 200, 210, 220, 230
    ],
    '27': [
        11, 20, 29, 38, 48, 57, 67, 77, 87, 97, 107, 118, 125, 138, 147, 158, 168, 178, 188, 199, 209, 219, 230, 240,
        250
    ],
    '28': [
        12, 21, 30, 40, 50, 60, 70, 80, 90, 101, 111, 122, 132, 143, 154, 164, 175, 186, 196, 207, 218, 228, 239, 250,
        261, 272
    ],
    '29': [
        13, 22, 32, 42, 52, 62, 73, 83, 94, 105, 116, 127, 138, 149, 160, 171, 182, 193, 204, 215, 226, 238, 249, 260,
        271, 282, 294
    ],
    '30': [
        13, 23, 33, 43, 54, 65, 76, 87, 98, 109, 120, 131, 143, 154, 166, 177, 189, 200, 212, 223, 235, 247, 258, 270,
        282, 293, 305, 317
    ]
};
/**
 * Determines if a benchmark is faster than another.
 *
 * @memberOf Benchmark
 * @param {Object} other The benchmark to compare.
 * @returns {number} Returns `-1` if slower, `1` if faster, and `0` if indeterminate.
 */
function compare(lhs, rhs) {
    if (lhs == rhs) {
        return 0;
    }
    var size1 = lhs.length;
    var size2 = rhs.length;
    var maxSize = Math.max(size1, size2);
    var minSize = Math.min(size1, size2);
    var u1 = getU(lhs, rhs);
    var u2 = getU(rhs, lhs);
    var u = Math.min(u1, u2);
    function getScore(xA, sampleB) {
        return sampleB.reduce(function (total, xB) { return total + (xB > xA ? 0 : xB < xA ? 1 : 0.5); }, 0);
    }
    function getU(sampleA, sampleB) {
        return sampleA.reduce(function (total, xA) { return total + getScore(xA, sampleB); }, 0);
    }
    function getZ(u) {
        return (u - ((size1 * size2) / 2)) / Math.sqrt((size1 * size2 * (size1 + size2 + 1)) / 12);
    }
    // Reject the null hypothesis the two samples come from the
    // same population (i.e. have the same median) if...
    if (size1 + size2 > 30) {
        // ...the z-stat is greater than 1.96 or less than -1.96
        // http://www.statisticslectures.com/topics/mannwhitneyu/
        var zStat = getZ(u);
        return Math.abs(zStat) > 1.96 ? (u == u1 ? 1 : -1) : 0;
    }
    // ...the U value is less than or equal the critical U value.
    var critical = maxSize < 5 || minSize < 3 ? 0 : uTable[maxSize][minSize - 3];
    return u <= critical ? (u == u1 ? 1 : -1) : 0;
}
//# sourceMappingURL=compare.js.map