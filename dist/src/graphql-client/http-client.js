"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var graphql_1 = require("graphql");
var node_fetch_1 = require("node-fetch");
var node_at_location_1 = require("../graphql/node-at-location");
var ast_synchronization_1 = require("../graphql/ast-synchronization");
var TraceError = require("trace-error");
var utils_1 = require("../utils/utils");
var HttpGraphQLClient = /** @class */ (function () {
    function HttpGraphQLClient(config) {
        this.fetch = node_fetch_1.default;
        this.url = config.url;
    }
    HttpGraphQLClient.prototype.execute = function (document, variables, context, introspect) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1, json_1, error_2, json, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetchResponse(document, variables, context, introspect)];
                    case 1:
                        res = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw new TraceError("Error connecting to GraphQL endpoint at " + this.url + ": " + error_1.message, error_1);
                    case 3:
                        if (!!res.ok) return [3 /*break*/, 8];
                        if (!(res.headers.get('Content-Type') == 'application/json')) return [3 /*break*/, 7];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, res.json()];
                    case 5:
                        json_1 = _a.sent();
                        if (json_1 && typeof json_1 == 'object' && json_1.errors && typeof json_1.errors == 'object' && json_1.errors.length) {
                            // only if we got what seems like a proper unsuccessful GraphQL result, use this. Otherwise, fall back to error message
                            return [2 /*return*/, json_1];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: throw new Error("GraphQL endpoint at " + this.url + " reported " + res.status + " " + res.statusText);
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, res.json()];
                    case 9:
                        json = _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_3 = _a.sent();
                        throw new TraceError("Response from GraphQL endpoint at " + this.url + " is invalid json: " + error_3.message, error_3);
                    case 11:
                        if (typeof json != 'object') {
                            throw new Error("Response from GraphQL endpoint at " + this.url + " is not an object");
                        }
                        return [4 /*yield*/, this.processResponse(json, document, variables, context, introspect)];
                    case 12: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HttpGraphQLClient.prototype.fetchResponse = function (document, variables, context, introspect) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.fetch;
                        return [4 /*yield*/, this.getRequest(document, variables, context, introspect)];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                }
            });
        });
    };
    HttpGraphQLClient.prototype.getRequest = function (document, variables, context, introspect) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = node_fetch_1.Request.bind;
                        _b = [void 0, this.url];
                        _c = {
                            method: 'POST'
                        };
                        return [4 /*yield*/, this.getHeaders(document, variables, context, introspect)];
                    case 1:
                        _c.headers = _d.sent();
                        return [4 /*yield*/, this.getBody(document, variables, context)];
                    case 2: return [2 /*return*/, new (_a.apply(node_fetch_1.Request, _b.concat([(_c.body = _d.sent(),
                                _c)])))()];
                }
            });
        });
    };
    HttpGraphQLClient.prototype.getHeaders = function (document, variables, context, introspect) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }];
            });
        });
    };
    HttpGraphQLClient.prototype.getBody = function (document, variables, context, introspect) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, JSON.stringify({
                        query: graphql_1.print(document),
                        variables: variables
                    })];
            });
        });
    };
    HttpGraphQLClient.prototype.processResponse = function (response, document, variables, context, introspect) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var printedAST;
            return __generator(this, function (_a) {
                if (!response || !response.errors || !response.errors.length || !response.errors.some(function (er) { return !!er.locations && er.locations.length > 0; })) {
                    return [2 /*return*/, response];
                }
                printedAST = graphql_1.parse(graphql_1.print(document));
                return [2 /*return*/, __assign({}, response, { errors: response.errors.map(function (error) {
                            if (!error.locations || !error.locations.length) {
                                return error;
                            }
                            var positions = utils_1.compact(error.locations.map(function (location) { return _this.mapLocationsToOriginal(location, printedAST, document); }));
                            var source = positions.length ? positions[0].source : undefined;
                            return new graphql_1.GraphQLError(error.message, undefined, source, positions.map(function (p) { return p.start; }), error.path);
                        }) })];
            });
        });
    };
    HttpGraphQLClient.prototype.mapLocationsToOriginal = function (location, sourceDocument, targetDocument) {
        var nodeInPrinted = node_at_location_1.findNodeAtLocation(location, sourceDocument);
        if (!nodeInPrinted) {
            return undefined;
        }
        // find node
        var nodeInOriginalDoc = ast_synchronization_1.findNodeInOtherDocument(nodeInPrinted, sourceDocument, targetDocument);
        if (!nodeInOriginalDoc || !nodeInOriginalDoc.loc) {
            return undefined;
        }
        return nodeInOriginalDoc.loc;
    };
    return HttpGraphQLClient;
}());
exports.HttpGraphQLClient = HttpGraphQLClient;
//# sourceMappingURL=http-client.js.map