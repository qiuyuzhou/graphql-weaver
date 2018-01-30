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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var helpers_1 = require("./helpers");
var equal_json_1 = require("../helpers/equal-json");
var graphql_http_test_endpoint_1 = require("../helpers/grapqhl-http-test/graphql-http-test-endpoint");
describe('regression tests', function () {
    var httpTestEndpoint = new graphql_http_test_endpoint_1.GraphQLHTTPTestEndpoint();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            jasmine.addMatchers(equal_json_1.TO_EQUAL_JSON_MATCHERS);
            httpTestEndpoint.start(1337);
            return [2 /*return*/];
        });
    }); });
    var dir = path.join(__dirname, 'data');
    var files = fs.readdirSync(dir);
    var saveActualAsExpected = process.argv.includes('--save-actual-as-expected');
    var _loop_1 = function (fileName) {
        if (!fileName.endsWith('.graphql')) {
            return "continue";
        }
        var queryString = fs.readFileSync(path.join(dir, fileName), 'utf-8');
        it(fileName, function () { return __awaiter(_this, void 0, void 0, function () {
            var configFile, resultPath, expectedResult, variablesPath, variableValues, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        configFile = require(path.join(dir, fileName.replace(/.graphql$/, '.config.ts')));
                        resultPath = path.join(dir, fileName.replace(/.graphql$/, '.result.json'));
                        expectedResult = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
                        variablesPath = path.join(dir, fileName.replace(/.graphql$/, '.vars.json'));
                        variableValues = fs.existsSync(variablesPath) ? JSON.parse(fs.readFileSync(variablesPath, 'utf-8')) : {};
                        _a = helpers_1.testConfigWithQuery;
                        return [4 /*yield*/, configFile.getConfig()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), queryString, variableValues])];
                    case 2:
                        result = _b.sent();
                        if (saveActualAsExpected && !jasmine.matchersUtil.equals(result, expectedResult)) {
                            fs.writeFileSync(resultPath, JSON.stringify(result, undefined, '  '), 'utf-8');
                        }
                        expect(result).toEqualJSON(expectedResult);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var fileName = files_1[_i];
        _loop_1(fileName);
    }
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            httpTestEndpoint.stop();
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=regressions.spec.js.map