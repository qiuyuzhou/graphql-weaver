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
var fs = require("fs");
var weave_schemas_1 = require("../../../src/weave-schemas");
var graphql_1 = require("graphql");
var http_client_1 = require("../../../src/graphql-client/http-client");
var path = require("path");
var execution_result_1 = require("../../../src/graphql/execution-result");
var UPSTREAM_URL = 'http://localhost:1337/graphql';
var queryStr = fs.readFileSync(path.resolve(__dirname, 'query.graphql'), 'utf-8');
var config = {
    endpoints: [
        {
            url: UPSTREAM_URL
        }
    ]
};
function testDirect(params) {
    if (params === void 0) { params = {}; }
    var client = new http_client_1.HttpGraphQLClient({ url: UPSTREAM_URL });
    var document = graphql_1.parse(queryStr);
    return {
        name: "direct " + (params && params.useLargeList ? 'with large list' : ''),
        maxTime: 5,
        fn: function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.execute(document, params)];
                        case 1:
                            result = _a.sent();
                            execution_result_1.assertSuccessfulResult(result);
                            return [2 /*return*/];
                    }
                });
            });
        }
    };
}
function testProxied(params) {
    if (params === void 0) { params = {}; }
    var schema;
    return {
        name: "woven " + (params && params.useLargeList ? 'with large list' : ''),
        maxTime: 5,
        fn: function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, graphql_1.graphql(schema, queryStr, {}, {}, params)];
                        case 1:
                            result = _a.sent();
                            execution_result_1.assertSuccessfulResult(result);
                            return [2 /*return*/];
                    }
                });
            });
        },
        beforeAll: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, weave_schemas_1.weaveSchemas(config)];
                        case 1:
                            schema = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    };
}
exports.COMPARISON = [
    testDirect({ useLargeList: false }), testProxied({ useLargeList: false })
];
exports.COMPARISON_LARGE = [
    testDirect({ useLargeList: true }), testProxied({ useLargeList: true })
];
//# sourceMappingURL=comparison.js.map