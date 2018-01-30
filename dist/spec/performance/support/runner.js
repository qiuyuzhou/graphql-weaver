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
var colors = require('colors');
colors.enabled = true;
var SHOW_CYCLE_INFO = false;
function formatTimings(_a) {
    var meanTime = _a.meanTime, relativeMarginOfError = _a.relativeMarginOfError;
    return (meanTime * 1000).toFixed(3) + "ms (\u00B1" + (relativeMarginOfError * 100).toFixed(2) + "%)";
}
function formatElapsedTime(_a) {
    var elapsedTime = _a.elapsedTime, setUpTime = _a.setUpTime;
    return elapsedTime.toFixed() + "s elapsed (" + (setUpTime / elapsedTime * 100).toFixed() + "% for setup)";
}
function runAsync(factories) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, index, erroredCount, _i, factories_1, factory, config, result, err_1, elapsed, elapsedMinutes, elapsedSeconds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = async_bench_1.time();
                    console.log('');
                    console.log('Running benchmark suite');
                    index = 1;
                    erroredCount = 0;
                    _i = 0, factories_1 = factories;
                    _a.label = 1;
                case 1:
                    if (!(_i < factories_1.length)) return [3 /*break*/, 7];
                    factory = factories_1[_i];
                    config = factory();
                    console.log('');
                    console.log(("[" + index + " / " + factories.length + "] " + config.name + "...").yellow.bold);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, async_bench_1.benchmark(config, {
                            onCycleDone: function (cycle) {
                                if (SHOW_CYCLE_INFO) {
                                    console.log(("  Cycle " + (cycle.index + 1) + ": " + cycle.iterationCount + " iterations, " +
                                        ("current estimate: " + formatTimings(cycle.timingsSoFar) + " per iteration, ") +
                                        ("" + formatElapsedTime(cycle))).grey);
                                }
                            }
                        })];
                case 3:
                    result = _a.sent();
                    console.log(("  " + formatTimings(result)).green + " per iteration");
                    console.log("  " + formatElapsedTime(result) + " for " + result.iterationCount + " iterations in " + result.cycles + " cycles");
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1.message, err_1.stack);
                    erroredCount++;
                    return [3 /*break*/, 5];
                case 5:
                    index++;
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    elapsed = async_bench_1.time() - startTime;
                    elapsedMinutes = Math.floor(elapsed / 60);
                    elapsedSeconds = Math.floor(elapsed % 60);
                    console.log('');
                    console.log("Done.".bold);
                    console.log(("Executed " + factories.length + " benchmarks in " + elapsedMinutes + " minutes, " + elapsedSeconds + " seconds").bold);
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
function runBenchmarks(factories) {
    return runAsync(factories)
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
exports.runBenchmarks = runBenchmarks;
//# sourceMappingURL=runner.js.map