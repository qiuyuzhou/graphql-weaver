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
var client_factory_1 = require("./graphql-client/client-factory");
var pipeline_1 = require("./pipeline/pipeline");
var extended_schema_1 = require("./extended-schema/extended-schema");
var fetch_metadata_1 = require("./extended-schema/fetch-metadata");
var execution_result_1 = require("./graphql/execution-result");
var errors_1 = require("./config/errors");
var utils_1 = require("./utils/utils");
var local_client_1 = require("./graphql-client/local-client");
var dist_1 = require("graphql-transformer/dist");
var error_handling_1 = require("./config/error-handling");
var TraceError = require("trace-error");
// Not decided on an API to choose this, so leave non-configurable for now
var endpointFactory = new client_factory_1.DefaultClientFactory();
function weaveSchemas(config) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, weaveSchemasExt(config)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.schema];
            }
        });
    });
}
exports.weaveSchemas = weaveSchemas;
/**
 * Weaves schemas according to a config. If only recoverable errors occurred, these are reported in the result.
 */
function weaveSchemasExt(config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (error_handling_1.shouldContinueOnError(config.errorHandling)) {
                return [2 /*return*/, weaveSchemasContinueOnError(config)];
            }
            return [2 /*return*/, weaveSchemasThrowOnError(config)];
        });
    });
}
exports.weaveSchemasExt = weaveSchemasExt;
function weaveSchemasThrowOnError(config) {
    return __awaiter(this, void 0, void 0, function () {
        var pipeline, schema;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createPipeline(config, errors_1.throwingErrorConsumer)];
                case 1:
                    pipeline = _a.sent();
                    schema = pipeline.schema.schema;
                    return [2 /*return*/, {
                            schema: schema,
                            errors: [],
                            hasErrors: false
                        }];
            }
        });
    });
}
function weaveSchemasContinueOnError(config) {
    return __awaiter(this, void 0, void 0, function () {
        function onError(error) {
            errors.push(error);
        }
        var errors, pipeline, schema;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = [];
                    return [4 /*yield*/, createPipeline(config, onError)];
                case 1:
                    pipeline = _a.sent();
                    schema = pipeline.schema.schema;
                    if (error_handling_1.shouldProvideErrorsInSchema(config.errorHandling) && errors.length) {
                        schema = dist_1.transformSchema(schema, {
                            transformFields: function (config, context) {
                                if (context.oldOuterType == schema.getQueryType()) {
                                    return __assign({}, config, { _errors: {
                                            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(new graphql_1.GraphQLObjectType({
                                                name: '_WeavingError',
                                                fields: {
                                                    message: {
                                                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
                                                    },
                                                    endpoint: {
                                                        type: graphql_1.GraphQLString
                                                    }
                                                }
                                            })))),
                                            resolve: function () { return errors.map(function (e) { return ({ message: e.message, endpoint: e.endpointName }); }); }
                                        } });
                                }
                                return config;
                            }
                        });
                    }
                    return [2 /*return*/, {
                            schema: schema,
                            errors: errors,
                            hasErrors: errors.length > 0
                        }];
            }
        });
    });
}
function createPipeline(config, errorConsumer) {
    if (errorConsumer === void 0) { errorConsumer = errors_1.throwingErrorConsumer; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var endpoints, usableEndpoints;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validateConfig(config);
                    return [4 /*yield*/, Promise.all(config.endpoints.map(function (endpointConfig) { return __awaiter(_this, void 0, void 0, function () {
                            var endpoint, schema, error_1, weavingError, metadata, error_2, extendedSchema, endpointInfo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        endpoint = endpointFactory.getEndpoint(endpointConfig);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, getClientSchema(endpoint)];
                                    case 2:
                                        schema = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        weavingError = new errors_1.WeavingError("Failed to retrieve schema: " + error_1.message, endpointConfig, error_1);
                                        errorConsumer(weavingError);
                                        // If this is namespaced, we can place a pseudo-field to report errors more visibly
                                        if (error_handling_1.shouldAddPlaceholdersOnError(config.errorHandling) && endpointConfig.namespace) {
                                            return [2 /*return*/, createPlaceholderEndpoint(endpointConfig, weavingError)];
                                        }
                                        // otherwise, exclude this endpoint from the result
                                        return [2 /*return*/, undefined];
                                    case 4:
                                        _a.trys.push([4, 6, , 7]);
                                        return [4 /*yield*/, fetch_metadata_1.fetchSchemaMetadata(endpoint, schema)];
                                    case 5:
                                        metadata = _a.sent();
                                        return [3 /*break*/, 7];
                                    case 6:
                                        error_2 = _a.sent();
                                        errorConsumer(new errors_1.WeavingError("Failed to retrieve schema metadata: " + error_2.message, endpointConfig, error_2));
                                        metadata = new extended_schema_1.SchemaMetadata();
                                        return [3 /*break*/, 7];
                                    case 7:
                                        extendedSchema = new extended_schema_1.ExtendedSchema(schema, metadata);
                                        endpointInfo = {
                                            endpointConfig: endpointConfig,
                                            client: endpoint,
                                            schema: extendedSchema
                                        };
                                        return [2 /*return*/, endpointInfo];
                                }
                            });
                        }); }))];
                case 1:
                    endpoints = _a.sent();
                    usableEndpoints = utils_1.compact(endpoints);
                    return [2 /*return*/, new pipeline_1.Pipeline(usableEndpoints, errorConsumer, config.pipelineConfig)];
            }
        });
    });
}
exports.createPipeline = createPipeline;
function validateConfig(config) {
    // TODO push code to new file/class ProxyConfigValidator
    config.endpoints.forEach(function (endpointConfig) {
        if (!endpointConfig.identifier && endpointConfig.namespace) {
            endpointConfig.identifier = endpointConfig.namespace;
        }
        if (!endpointConfig.identifier) {
            endpointConfig.identifier = Math.random().toString(36).slice(2);
        }
    });
}
function getClientSchema(endpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var introspectionRes, introspection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, endpoint.execute(graphql_1.parse(graphql_1.introspectionQuery), {}, undefined, true)];
                case 1:
                    introspectionRes = _a.sent();
                    introspection = execution_result_1.assertSuccessfulResult(introspectionRes);
                    try {
                        return [2 /*return*/, graphql_1.buildClientSchema(introspection)];
                    }
                    catch (error) {
                        throw new TraceError("Failed to build schema from introspection result: " + error.message, error);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function createPlaceholderEndpoint(endpointConfig, error) {
    var schema = createPlaceholderSchema(endpointConfig, error);
    return {
        endpointConfig: endpointConfig,
        client: new local_client_1.LocalGraphQLClient(schema),
        schema: new extended_schema_1.ExtendedSchema(schema)
    };
}
function createPlaceholderSchema(endpoint, error) {
    return new graphql_1.GraphQLSchema({
        query: new graphql_1.GraphQLObjectType({
            description: 'Failed to fetch the schema for this endpoint. This type only exists to show the error message.',
            name: endpoint.typePrefix ? 'Query' : "Query_" + endpoint.identifier,
            fields: {
                _error: {
                    type: graphql_1.GraphQLString,
                    resolve: function () { return error.message; }
                }
            }
        })
    });
}
//# sourceMappingURL=weave-schemas.js.map