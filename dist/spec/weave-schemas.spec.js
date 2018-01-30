"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var weave_schemas_1 = require("../src/weave-schemas");
var graphql_1 = require("graphql");
var graphql_transformer_1 = require("graphql-transformer");
var execution_result_1 = require("../src/graphql/execution-result");
var error_handling_1 = require("../src/config/error-handling");
var errors_1 = require("../src/config/errors");
describe('weaveSchemas', function () {
    var testSchema = new graphql_1.GraphQLSchema({
        query: new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: {
                test: {
                    type: graphql_1.GraphQLString, resolve: function () {
                        return 'the value';
                    }
                }
            }
        })
    });
    it('supports custom endpoints and passes through context', function () { return __awaiter(_this, void 0, void 0, function () {
        var wasExecuted, capturedContext, client, wovenSchema, context, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wasExecuted = false;
                    capturedContext = undefined;
                    client = {
                        execute: function (document, variables, context) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    wasExecuted = true;
                                    capturedContext = context;
                                    return [2 /*return*/, graphql_1.execute(testSchema, document, undefined, context, variables)];
                                });
                            });
                        }
                    };
                    return [4 /*yield*/, weave_schemas_1.weaveSchemas({
                            endpoints: [
                                {
                                    client: client
                                }
                            ]
                        })];
                case 1:
                    wovenSchema = _a.sent();
                    context = { the: 'context' };
                    return [4 /*yield*/, graphql_1.graphql(wovenSchema, '{test}', undefined, context)];
                case 2:
                    result = _a.sent();
                    expect(wasExecuted).toBeTruthy('Endpoint was not called');
                    expect(capturedContext).toBe(context, 'Context was not passed to endpoint');
                    return [2 /*return*/];
            }
        });
    }); });
    it('allows to customize pre-merge pipeline', function () { return __awaiter(_this, void 0, void 0, function () {
        var module, wovenSchema, result, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    module = new ScreamModule();
                    return [4 /*yield*/, weave_schemas_1.weaveSchemas({
                            endpoints: [
                                {
                                    schema: testSchema
                                }
                            ],
                            pipelineConfig: {
                                transformPreMergePipeline: function (modules, context) {
                                    return modules.concat([module]);
                                }
                            }
                        })];
                case 1:
                    wovenSchema = _a.sent();
                    expect(module.schemaPipelineExecuted).toBeTruthy('Schema pipeline was not executed');
                    return [4 /*yield*/, graphql_1.graphql(wovenSchema, '{TEST}')];
                case 2:
                    result = _a.sent();
                    data = execution_result_1.assertSuccessfulResult(result);
                    expect(module.queryPipelineExecuted).toBeTruthy('Query pipeline was not executed');
                    expect(data['TEST']).toBe('the value');
                    return [2 /*return*/];
            }
        });
    }); });
    it('allows to customize post-merge pipeline', function () { return __awaiter(_this, void 0, void 0, function () {
        var module, wovenSchema, result, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    module = new ScreamModule();
                    return [4 /*yield*/, weave_schemas_1.weaveSchemas({
                            endpoints: [
                                {
                                    schema: testSchema
                                }
                            ],
                            pipelineConfig: {
                                transformPostMergePipeline: function (modules, context) {
                                    return modules.concat([module]);
                                }
                            }
                        })];
                case 1:
                    wovenSchema = _a.sent();
                    expect(module.schemaPipelineExecuted).toBeTruthy('Schema pipeline was not executed');
                    return [4 /*yield*/, graphql_1.graphql(wovenSchema, '{TEST}')];
                case 2:
                    result = _a.sent();
                    data = execution_result_1.assertSuccessfulResult(result);
                    expect(module.queryPipelineExecuted).toBeTruthy('Query pipeline was not executed');
                    expect(data['TEST']).toBe('the value');
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws when endpoint schemas can not be retrieved', function () { return __awaiter(_this, void 0, void 0, function () {
        function test(config) {
            return __awaiter(this, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = undefined;
                            // can't use expect().toThrow because of promises
                            return [4 /*yield*/, weave_schemas_1.weaveSchemas(config).catch(function (e) { return error = e; })];
                        case 1:
                            // can't use expect().toThrow because of promises
                            _a.sent();
                            expect(error).toBeDefined('failed with ' + config.errorHandling);
                            expect(error.constructor.name).toBe(errors_1.WeavingError.name);
                            expect(error.message).toMatch(/.*Throwing introspection.*/);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var errorClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errorClient = {
                        execute: function (query, vars, context, introspection) {
                            throw new Error(introspection ? 'Throwing introspection' : 'Throwing query');
                        }
                    };
                    return [4 /*yield*/, test({
                            endpoints: [
                                {
                                    client: errorClient
                                }
                            ]
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, test({
                            endpoints: [
                                {
                                    client: errorClient
                                }
                            ],
                            errorHandling: error_handling_1.WeavingErrorHandlingMode.THROW
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('passes through client errors in originalError', function () { return __awaiter(_this, void 0, void 0, function () {
        var CustomError, errorClient, schema, result, originalError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CustomError = /** @class */ (function (_super) {
                        __extends(CustomError, _super);
                        function CustomError() {
                            var _this = _super.call(this, 'custom message') || this;
                            Object.setPrototypeOf(_this, CustomError.prototype);
                            return _this;
                        }
                        Object.defineProperty(CustomError.prototype, "specialValue", {
                            get: function () {
                                return true;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        return CustomError;
                    }(Error));
                    errorClient = {
                        execute: function (query, vars, context, introspection) {
                            if (introspection) {
                                return graphql_1.graphql(testSchema, graphql_1.print(query), {}, {}, vars);
                            }
                            else {
                                throw new CustomError();
                            }
                        }
                    };
                    return [4 /*yield*/, weave_schemas_1.weaveSchemas({
                            endpoints: [{
                                    client: errorClient
                                }]
                        })];
                case 1:
                    schema = _a.sent();
                    return [4 /*yield*/, graphql_1.graphql(schema, '{test}')];
                case 2:
                    result = _a.sent();
                    expect(result.errors).toBeDefined();
                    expect(result.errors.length).toBeDefined();
                    expect(result.errors[0].message).toEqual('custom message');
                    originalError = result.errors[0].originalError;
                    expect(originalError.constructor.name).toBe(CustomError.name);
                    expect(originalError instanceof CustomError).toBeTruthy();
                    expect(originalError.specialValue).toEqual(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('weaveSchemasExt', function () {
    it('reports recoverable errors', function () { return __awaiter(_this, void 0, void 0, function () {
        var errorClient, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errorClient = {
                        execute: function (query, vars, context, introspection) {
                            throw new Error(introspection ? 'Throwing introspection' : 'Throwing query');
                        }
                    };
                    return [4 /*yield*/, weave_schemas_1.weaveSchemasExt({
                            endpoints: [
                                {
                                    client: errorClient
                                }
                            ],
                            errorHandling: error_handling_1.WeavingErrorHandlingMode.CONTINUE
                        })];
                case 1:
                    result = _a.sent();
                    expect(result.schema).toBeDefined();
                    expect(result.hasErrors).toBe(true);
                    expect(result.errors.length).toBe(1);
                    expect(result.errors[0].message).toContain('Throwing introspection');
                    return [2 /*return*/];
            }
        });
    }); });
    it('reports successful results correctly', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, weave_schemas_1.weaveSchemasExt({
                        endpoints: []
                    })];
                case 1:
                    result = _a.sent();
                    expect(result.schema).toBeDefined();
                    expect(result.hasErrors).toBe(false);
                    expect(result.errors).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
// only works in schemas with only lowercase names
var ScreamModule = /** @class */ (function () {
    function ScreamModule() {
        this.schemaPipelineExecuted = false;
        this.queryPipelineExecuted = false;
    }
    ScreamModule.prototype.transformSchema = function (schema) {
        this.schemaPipelineExecuted = true;
        return graphql_transformer_1.transformSchema(schema, {
            transformField: function (field) {
                return __assign({}, field, { name: field.name.toUpperCase() });
            }
        });
    };
    ScreamModule.prototype.transformQuery = function (query) {
        this.queryPipelineExecuted = true;
        return __assign({}, query, { document: graphql_1.visit(query.document, {
                Field: function (node) {
                    return __assign({}, node, { name: {
                            kind: 'Name',
                            value: node.name.value.toLowerCase()
                        }, alias: {
                            kind: 'Name',
                            value: node.alias ? node.alias.value : node.name.value
                        } });
                }
            }) });
    };
    return ScreamModule;
}());
//# sourceMappingURL=weave-schemas.spec.js.map