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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var schema_utils_1 = require("../../graphql/schema-utils");
var utils_1 = require("../../utils/utils");
var field_as_query_1 = require("../../graphql/field-as-query");
var language_utils_1 = require("../../graphql/language-utils");
var util_1 = require("util");
var execution_result_1 = require("../../graphql/execution-result");
var errors_in_result_1 = require("../../graphql/errors-in-result");
var error_paths_1 = require("./error-paths");
var errors_1 = require("../../config/errors");
exports.FILTER_ARG = 'filter';
exports.ORDER_BY_ARG = 'orderBy';
exports.FIRST_ARG = 'first';
function parseLinkTargetPath(path, schema) {
    var fieldPath = path.split('.');
    var field = schema_utils_1.walkFields(schema.getQueryType(), fieldPath);
    if (!field) {
        return undefined;
    }
    return { field: field, fieldPath: fieldPath };
}
exports.parseLinkTargetPath = parseLinkTargetPath;
function basicResolve(params) {
    return __awaiter(this, void 0, void 0, function () {
        var payloadSelectionSet, variableValues, variableDefinitions, context, schema, targetFieldPath, args, fragments, outerFieldNames, innerFieldName, innerFieldNode, innerSelectionSet, selectionSet, operation, document, result, resultData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payloadSelectionSet = params.payloadSelectionSet, variableValues = params.variableValues, variableDefinitions = params.variableDefinitions, context = params.context, schema = params.schema, targetFieldPath = params.targetFieldPath, args = params.args, fragments = params.fragments;
                    outerFieldNames = targetFieldPath.slice();
                    innerFieldName = outerFieldNames.pop();
                    innerFieldNode = __assign({}, language_utils_1.createFieldNode(innerFieldName), { selectionSet: payloadSelectionSet, arguments: args });
                    innerSelectionSet = {
                        kind: 'SelectionSet',
                        selections: [innerFieldNode]
                    };
                    selectionSet = language_utils_1.createSelectionChain(outerFieldNames, innerSelectionSet);
                    operation = {
                        kind: 'OperationDefinition',
                        operation: 'query',
                        variableDefinitions: variableDefinitions,
                        selectionSet: selectionSet
                    };
                    document = {
                        kind: 'Document',
                        definitions: [
                            operation
                        ].concat(fragments)
                    };
                    return [4 /*yield*/, graphql_1.execute(schema, document, {} /* root */, context, variableValues)];
                case 1:
                    result = _a.sent();
                    resultData = execution_result_1.assertSuccessfulResult(errors_in_result_1.moveErrorsToData(result, function (e) { return error_paths_1.prefixGraphQLErrorPath(e, params.path, targetFieldPath.length); }));
                    // unwrap
                    return [2 /*return*/, targetFieldPath.reduce(function (data, fieldName) { return data[fieldName]; }, resultData)];
            }
        });
    });
}
/**
 * Fetches a list of objects by their keys
 *
 * @param params.keys an array of key values
 * @param params.info the resolve info that specifies the structure of the query
 * @return an array of objects, with 1:1 mapping to the keys
 */
function fetchLinkedObjects(params) {
    return __awaiter(this, void 0, void 0, function () {
        /**
         * Fetches one object, or a list of objects in batch mode, according to the query underlying the resolveInfo
         * @param key the key
         * @param resolveInfo the resolveInfo from the request
         * @param context graphql execution context
         * @returns {Promise<void>}
         */
        function fetchSingular(key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, fragments, originalParts, varType, varNameBase, _b, variableDefinitions, varName, variableValues, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = field_as_query_1.getFieldAsQueryParts(info), fragments = _a.fragments, originalParts = __rest(_a, ["fragments"]);
                            varType = schema_utils_1.getNonNullType(keyType);
                            varNameBase = linkConfig.argument.split('.').pop();
                            _b = language_utils_1.addVariableDefinitionSafely(originalParts.variableDefinitions, varNameBase, varType), variableDefinitions = _b.variableDefinitions, varName = _b.name;
                            variableValues = __assign({}, originalParts.variableValues, (_c = {}, _c[varName] = key, _c));
                            return [4 /*yield*/, basicResolve({
                                    targetFieldPath: targetFieldPath,
                                    schema: unlinkedSchema,
                                    context: context,
                                    variableDefinitions: variableDefinitions,
                                    variableValues: variableValues,
                                    fragments: fragments,
                                    args: [
                                        language_utils_1.createNestedArgumentWithVariableNode(linkConfig.argument, varName)
                                    ],
                                    payloadSelectionSet: originalParts.selectionSet,
                                    path: info.path
                                })];
                        case 1: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        }
        /**
         * Fetches one object, or a list of objects in batch mode, according to the query underlying the resolveInfo
         * @param keyOrKeys either a single key of a list of keys, depending on link.batchMode
         * @param resolveInfo the resolveInfo from the request
         * @param context graphql execution context
         * @returns {Promise<void>}
         */
        function fetchBatchOneToOne(keys) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, fragments, originalParts, varType, varNameBase, _b, variableDefinitions, varName, variableValues, _c;
                return __generator(this, function (_d) {
                    _a = field_as_query_1.getFieldAsQueryParts(info), fragments = _a.fragments, originalParts = __rest(_a, ["fragments"]);
                    varType = new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(schema_utils_1.getNonNullType(keyType)));
                    varNameBase = linkConfig.argument.split('.').pop();
                    _b = language_utils_1.addVariableDefinitionSafely(originalParts.variableDefinitions, varNameBase, varType), variableDefinitions = _b.variableDefinitions, varName = _b.name;
                    variableValues = __assign({}, originalParts.variableValues, (_c = {}, _c[varName] = keys, _c));
                    return [2 /*return*/, basicResolve({
                            targetFieldPath: targetFieldPath,
                            schema: unlinkedSchema,
                            context: context,
                            variableDefinitions: variableDefinitions,
                            variableValues: variableValues,
                            fragments: fragments,
                            args: [
                                language_utils_1.createNestedArgumentWithVariableNode(linkConfig.argument, varName)
                            ],
                            payloadSelectionSet: originalParts.selectionSet,
                            path: info.path
                        })];
                });
            });
        }
        /**
         * Fetches one object, or a list of objects in batch mode, according to the query underlying the resolveInfo
         * @param keyOrKeys either a single key of a list of keys, depending on link.batchMode
         * @param resolveInfo the resolveInfo from the request
         * @param context graphql execution context
         * @returns {Promise<void>}
         */
        function fetchBatchWithKeyField(keyOrKeys) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, fragments, originalParts, varType, varNameBase, _b, variableDefinitions, varName, variableValues, _c, keyFieldAlias, payloadSelectionSet, data, map, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = field_as_query_1.getFieldAsQueryParts(info), fragments = _a.fragments, originalParts = __rest(_a, ["fragments"]);
                            varType = new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(schema_utils_1.getNonNullType(keyType)));
                            varNameBase = linkConfig.argument.split('.').pop();
                            _b = language_utils_1.addVariableDefinitionSafely(originalParts.variableDefinitions, varNameBase, varType), variableDefinitions = _b.variableDefinitions, varName = _b.name;
                            variableValues = __assign({}, originalParts.variableValues, (_d = {}, _d[varName] = keyOrKeys, _d));
                            _c = language_utils_1.addFieldSelectionSafely(originalParts.selectionSet, linkConfig.keyField, utils_1.arrayToObject(fragments, function (f) { return f.name.value; })), keyFieldAlias = _c.alias, payloadSelectionSet = _c.selectionSet;
                            return [4 /*yield*/, basicResolve({
                                    targetFieldPath: targetFieldPath,
                                    schema: unlinkedSchema,
                                    context: context,
                                    variableDefinitions: variableDefinitions,
                                    variableValues: variableValues,
                                    fragments: fragments,
                                    args: [
                                        language_utils_1.createNestedArgumentWithVariableNode(linkConfig.argument, varName)
                                    ],
                                    payloadSelectionSet: payloadSelectionSet,
                                    path: info.path
                                })];
                        case 1:
                            data = _e.sent();
                            checkObjectsAndKeysForErrorValues(data, keyFieldAlias, linkConfig.keyField);
                            // unordered case: endpoints does not preserve order, so we need to remap based on a key field
                            // first, create a lookup table from id to item
                            if (!util_1.isArray(data)) {
                                throw new Error("Result of " + targetFieldPath.join('.') + " expected to be an array because batchMode is true");
                            }
                            map = new Map(data.map(function (item) { return [item[keyFieldAlias], item]; }));
                            // Then, use the lookup table to efficiently order the result
                            return [2 /*return*/, keyOrKeys.map(function (key) { return map.get(key); })];
                    }
                });
            });
        }
        var unlinkedSchema, keys, keyType, linkConfig, info, context, targetFieldPath;
        return __generator(this, function (_a) {
            unlinkedSchema = params.unlinkedSchema, keys = params.keys, keyType = params.keyType, linkConfig = params.linkConfig, info = params.info, context = params.context;
            targetFieldPath = (parseLinkTargetPath(linkConfig.field, unlinkedSchema) ||
                utils_1.throwError("Link target field as " + linkConfig.field + " which does not exist in the schema")).fieldPath;
            if (!linkConfig.batchMode) {
                return [2 /*return*/, keys.map(function (key) { return fetchSingular(key); })];
            }
            if (linkConfig.keyField) {
                return [2 /*return*/, fetchBatchWithKeyField(keys)];
            }
            return [2 /*return*/, fetchBatchOneToOne(keys)];
        });
    });
}
exports.fetchLinkedObjects = fetchLinkedObjects;
function fetchJoinedObjects(params) {
    return __awaiter(this, void 0, void 0, function () {
        var unlinkedSchema, additionalFilter, orderBy, filterType, linkConfig, info, context, keys, _a, fragments, originalParts, targetFieldPath, _b, filterArgumentName, keyFieldPath, filterValue, varNameBase, _c, variableDefinitions, varName, variableValues, _d, keyFieldAlias, payloadSelectionSet, filterArgument, args, orderByArg, firstArg, data, objectsByID, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    unlinkedSchema = params.unlinkedSchema, additionalFilter = params.additionalFilter, orderBy = params.orderBy, filterType = params.filterType, linkConfig = params.linkConfig, info = params.info, context = params.context, keys = params.keys;
                    _a = field_as_query_1.getFieldAsQueryParts(info), fragments = _a.fragments, originalParts = __rest(_a, ["fragments"]);
                    targetFieldPath = (parseLinkTargetPath(linkConfig.field, unlinkedSchema) ||
                        utils_1.throwError(function () { return new errors_1.WeavingError("Target field " + JSON.stringify(linkConfig.field) + " does not exist"); })).fieldPath;
                    _b = linkConfig.argument.split('.'), filterArgumentName = _b[0], keyFieldPath = _b.slice(1);
                    if (!keyFieldPath) {
                        throw new errors_1.WeavingError("argument " + JSON.stringify(linkConfig.argument) + " on link field needs to be a path of the form argumentName.fieldPath, where fieldPath is dot-separated.");
                    }
                    filterValue = utils_1.modifyPropertyAtPath(additionalFilter, function (existingKeys) { return existingKeys ? utils_1.intersect(existingKeys, keys) : keys; }, keyFieldPath);
                    varNameBase = info.fieldNodes[0].name.value + 'Filter';
                    _c = language_utils_1.addVariableDefinitionSafely(originalParts.variableDefinitions, varNameBase, filterType), variableDefinitions = _c.variableDefinitions, varName = _c.name;
                    variableValues = __assign({}, originalParts.variableValues, (_e = {}, _e[varName] = filterValue, _e));
                    _d = language_utils_1.addFieldSelectionSafely(originalParts.selectionSet, linkConfig.keyField, utils_1.arrayToObject(fragments, function (f) { return f.name.value; })), keyFieldAlias = _d.alias, payloadSelectionSet = _d.selectionSet;
                    filterArgument = {
                        kind: 'Argument',
                        name: {
                            kind: 'Name',
                            value: filterArgumentName
                        },
                        value: {
                            kind: 'Variable',
                            name: {
                                kind: 'Name',
                                value: varName
                            }
                        }
                    };
                    args = [filterArgument];
                    if (orderBy) {
                        orderByArg = {
                            kind: 'Argument',
                            name: {
                                kind: 'Name',
                                value: exports.ORDER_BY_ARG
                            },
                            value: {
                                kind: 'EnumValue',
                                value: orderBy
                            }
                        };
                        args = args.concat([orderByArg]);
                    }
                    if (params.first != undefined) {
                        firstArg = {
                            kind: 'Argument',
                            name: {
                                kind: 'Name',
                                value: exports.FIRST_ARG
                            },
                            value: {
                                kind: 'IntValue',
                                value: params.first + ""
                            }
                        };
                        args = args.concat([firstArg]);
                    }
                    return [4 /*yield*/, basicResolve({
                            targetFieldPath: targetFieldPath,
                            schema: unlinkedSchema,
                            context: context,
                            variableDefinitions: variableDefinitions,
                            variableValues: variableValues,
                            fragments: fragments,
                            args: args,
                            payloadSelectionSet: payloadSelectionSet,
                            path: info.path
                        })];
                case 1:
                    data = _f.sent();
                    if (!util_1.isArray(data)) {
                        throw new Error("Result of " + targetFieldPath.join('.') + " expected to be an array because batchMode is true");
                    }
                    checkObjectsAndKeysForErrorValues(data, keyFieldAlias, linkConfig.keyField);
                    objectsByID = new Map(data.map(function (item) { return [item[keyFieldAlias], item]; }));
                    return [2 /*return*/, {
                            orderedObjects: data,
                            objectsByID: objectsByID,
                            keyFieldAlias: keyFieldAlias
                        }];
            }
        });
    });
}
exports.fetchJoinedObjects = fetchJoinedObjects;
function getLinkArgumentType(linkConfig, targetField) {
    var _a = linkConfig.argument.split('.'), filterArgumentName = _a[0], keyFieldPath = _a.slice(1);
    var arg = targetField.args.filter(function (arg) { return arg.name == filterArgumentName; })[0];
    if (!arg) {
        throw new errors_1.WeavingError("Argument " + JSON.stringify(filterArgumentName) + " does not exist on target field " + JSON.stringify(linkConfig.field));
    }
    var type = arg.type;
    return keyFieldPath.reduce(function (type, fieldName) {
        if (!(type instanceof graphql_1.GraphQLInputObjectType) || !(fieldName in type.getFields())) {
            throw new Error("Argument path " + JSON.stringify(linkConfig.argument) + " cannot be resolved: " + type + " does not have a field " + JSON.stringify(fieldName));
        }
        return type.getFields()[fieldName].type;
    }, type);
}
exports.getLinkArgumentType = getLinkArgumentType;
function getKeyType(config) {
    var linkKeyType = graphql_1.getNamedType(config.linkFieldType);
    var argumentType = graphql_1.getNamedType(getLinkArgumentType(config.linkConfig, config.targetField));
    if (!(linkKeyType instanceof graphql_1.GraphQLScalarType)) {
        throw new errors_1.WeavingError("Type of @link field must be scalar type or list/non-null type of scalar type, but is " + config.linkFieldType);
    }
    if (!(argumentType instanceof graphql_1.GraphQLScalarType)) {
        throw new errors_1.WeavingError("Type of argument field " + JSON.stringify(config.linkConfig.argument) + " must be scalar type or list/non-null-type of a scalar type, but is " + argumentType);
    }
    if (argumentType != linkKeyType) {
        config.reportError(new errors_1.WeavingError("Link field " + JSON.stringify(config.linkFieldName) + " is of type " + linkKeyType + ", but argument " + JSON.stringify(config.linkConfig.argument) + " on target field " + JSON.stringify(config.linkConfig.field) + " has type " + argumentType));
    }
    // Even if the types do not match, we can still continue and just pass the link value as argument. For ID/String/Int mismatches, this should not be a problem.
    // However, we need to use the argument type as variable name, so this will be returned
    return argumentType;
}
exports.getKeyType = getKeyType;
function checkObjectsAndKeysForErrorValues(objects, keyFieldAlias, keyFieldName) {
    // Don't try to access the key field on this error object - just throw it
    if (objects instanceof errors_in_result_1.FieldErrorValue) {
        throw objects.getError();
    }
    var erroredKeys = objects
        .map(function (item) { return item[keyFieldAlias]; })
        .filter(function (keyValue) { return keyValue instanceof errors_in_result_1.FieldErrorValue; });
    if (erroredKeys.length) {
        throw new Error("Errors retrieving key field " + JSON.stringify(keyFieldName) + ":\n\n" + erroredKeys.map(function (error) { return error.getError().message; }).join('\n\n'));
    }
}
//# sourceMappingURL=link-helpers.js.map