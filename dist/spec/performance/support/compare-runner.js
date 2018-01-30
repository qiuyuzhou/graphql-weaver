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
var compare_1 = require("./compare");
var colors = require('colors');
colors.enabled = true;
var SHOW_CYCLE_INFO = false;
function formatMs(seconds) {
    return (seconds * 1000).toFixed(3) + "ms";
}
function formatPercent(fraction) {
    return (fraction * 100).toFixed(2) + "%";
}
function formatTimings(_a) {
    var meanTime = _a.meanTime, relativeMarginOfError = _a.relativeMarginOfError;
    return formatMs(meanTime) + " (\u00B1" + formatPercent(relativeMarginOfError) + "%)";
}
function formatElapsedTime(_a) {
    var elapsedTime = _a.elapsedTime, setUpTime = _a.setUpTime;
    return elapsedTime.toFixed() + "s elapsed (" + (setUpTime / elapsedTime * 100).toFixed() + "% for setup)";
}
function formatOverhead(x) {
    return formatMs(x.overheadMin) + " \u2013 " + formatMs(x.overheadMax) + " (" + formatPercent(x.relativeOverheadMin) + " \u2013 " + formatPercent(x.relativeOverheadMax) + ")";
}
function runAsync(benchmarks) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, index, erroredCount, result, _i, _a, candidate, elapsed, elapsedMinutes, elapsedSeconds;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startTime = async_bench_1.time();
                    console.log('');
                    console.log('Running comparison suite');
                    index = 1;
                    erroredCount = 0;
                    return [4 /*yield*/, compare_1.runComparison(benchmarks, {
                            onCycleDone: function (cycle) {
                                if (SHOW_CYCLE_INFO) {
                                    console.log(("  Cycle " + (cycle.index + 1) + " of " + cycle.name + ": " + cycle.iterationCount + " iterations, " +
                                        ("current estimate: " + formatTimings(cycle.timingsSoFar) + " per iteration, ") +
                                        ("" + formatElapsedTime(cycle))).grey);
                                }
                            }
                        })];
                case 1:
                    result = _b.sent();
                    for (_i = 0, _a = result.candidates; _i < _a.length; _i++) {
                        candidate = _a[_i];
                        console.log('');
                        console.log(("[" + index + " / " + benchmarks.length + "] " + candidate.config.name + "...").yellow.bold);
                        console.log(("  " + formatTimings(candidate.benchmark)).green + " per iteration");
                        console.log("  " + formatElapsedTime(candidate.benchmark) + " for " + candidate.benchmark.iterationCount + " iterations in " + candidate.benchmark.cycles + " cycles");
                        if (candidate.isFastest) {
                            console.log("  Fastest result.".green.bgBlack);
                        }
                        else {
                            console.log(("  Slower than fastest by " + formatOverhead(candidate)).yellow.bgBlack);
                        }
                        index++;
                    }
                    elapsed = async_bench_1.time() - startTime;
                    elapsedMinutes = Math.floor(elapsed / 60);
                    elapsedSeconds = Math.floor(elapsed % 60);
                    console.log('');
                    console.log("Done.".bold);
                    console.log(("Executed " + benchmarks.length + " benchmarks in " + elapsedMinutes + " minutes, " + elapsedSeconds + " seconds").bold);
                    if (erroredCount) {
                        console.log((erroredCount + " benchmarks reported an error.").red.bold);
                    }
                    console.log('');
                    return [2 /*return*/, {
                            hasErrors: erroredCount > 0
                        }];
            }
        });
    });
}
function runComparisons(benchmarks) {
    return runAsync(benchmarks)
        .then(function (result) {
        if (result.hasErrors && !process.exitCode) {
            process.exitCode = 1;
        }
    })
        .catch(function (err) {
        console.log(err.message, err.stack);
        if (!process.exitCode) {
            process.exitCode = 1;
        }
    });
}
exports.runComparisons = runComparisons;
//# sourceMappingURL=compare-runner.js.map