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
var extended_schema_transformer_1 = require("../extended-schema/extended-schema-transformer");
var utils_1 = require("../utils/utils");
var multi_key_weak_map_1 = require("../utils/multi-key-weak-map");
var link_helpers_1 = require("./helpers/link-helpers");
var schema_utils_1 = require("../graphql/schema-utils");
var field_as_query_1 = require("../graphql/field-as-query");
var language_utils_1 = require("../graphql/language-utils");
var errors_1 = require("../config/errors");
var DataLoader = require("dataloader");
var error_handling_1 = require("../config/error-handling");
var JOIN_ALIAS = '_joined'; // used when a joined field is not selected
/**
 * Adds a feature to link fields to types of other endpoints
 */
var LinksModule = /** @class */ (function () {
    function LinksModule(moduleConfig) {
        this.moduleConfig = moduleConfig;
    }
    LinksModule.prototype.transformExtendedSchema = function (schema) {
        this.unlinkedSchema = schema;
        var transformer = new SchemaLinkTransformer(schema, this.moduleConfig.reportError);
        this.linkedSchema = extended_schema_transformer_1.transformExtendedSchema(schema, transformer);
        this.transformationInfo = transformer.transformationInfo;
        return this.linkedSchema;
    };
    /**
     * Replaces linked fields by scalar fields
     *
     * The resolver of the linked field will do the fetch of the linked object, so here we just need the scalar value
     */
    LinksModule.prototype.transformQuery = function (query) {
        var _this = this;
        if (!this.linkedSchema || !this.unlinkedSchema) {
            throw new Error("Schema is not built yet");
        }
        // this funciton is quite heavy, don't call it if the schema does not use @join or @link at all
        if (!this.transformationInfo || this.transformationInfo.isEmpty()) {
            return query;
        }
        var typeInfo = new graphql_1.TypeInfo(this.linkedSchema.schema);
        var variableValues = query.variableValues;
        var operation = query.document.definitions.filter(function (def) { return def.kind == 'OperationDefinition'; })[0];
        if (!operation) {
            throw new Error("Operation not found");
        }
        var variableDefinitions = operation.variableDefinitions || [];
        var fieldStack = [];
        var hasChanges = false;
        var document = graphql_1.visit(query.document, graphql_1.visitWithTypeInfo(typeInfo, {
            Field: {
                enter: function (child) {
                    var oldChild = child;
                    var fieldStackOuter = fieldStack[fieldStack.length - 1];
                    var fieldStackTop = {};
                    fieldStack.push(fieldStackTop);
                    var parentType = typeInfo.getParentType();
                    if (!parentType) {
                        throw new Error("Failed to retrieve parent type for field " + child.name.value);
                    }
                    if (!(parentType instanceof graphql_1.GraphQLObjectType)) {
                        // field metadata only exists on object types
                        return undefined;
                    }
                    if (!typeInfo.getFieldDef()) {
                        throw new Error("Failed to retrieve field definition for field " + child.name.value);
                    }
                    var linkInfo = _this.transformationInfo.getLinkTransformationInfo(parentType.name, typeInfo.getFieldDef().name);
                    if (linkInfo && linkInfo.linkConfig) {
                        if (fieldStackOuter && fieldStackOuter.joinConfig && fieldStackOuter.joinConfig.linkField == child.name.value) {
                            fieldStackOuter.isLinkFieldSelectedYet = true;
                        }
                        // remove selection from the field node and map it to the source field
                        child = language_utils_1.createFieldNode(linkInfo.sourceFieldName, language_utils_1.getAliasOrName(child));
                    }
                    var metadata = _this.unlinkedSchema.getFieldMetadata(parentType, typeInfo.getFieldDef());
                    if (metadata && metadata.join) {
                        fieldStackTop.joinConfig = metadata.join;
                        fieldStackTop.isLinkFieldSelectedYet = false;
                        var transformationInfo = _this.transformationInfo.getJoinTransformationInfo(parentType.name, typeInfo.getFieldDef().name);
                        if (!transformationInfo) {
                            // no transformation info means, that the join is handled by a nested graphql-weaver
                            return child;
                        }
                        var hasRightFilter = false;
                        var rightObjectType = graphql_1.getNamedType(typeInfo.getType());
                        var linkMetadata = _this.unlinkedSchema.getFieldMetadata(rightObjectType, metadata.join.linkField);
                        if (!linkMetadata || !linkMetadata.link) {
                            throw new Error("Failed to retrieve linkMetadata for join field " + child.name.value + " (looked up " + typeInfo.getType() + "." + metadata.join.linkField + ")");
                        }
                        var outputLinkFieldName = linkMetadata.link.linkFieldName || metadata.join.linkField;
                        // remove right filter
                        var filterArg_1 = (child.arguments || []).filter(function (arg) { return arg.name.value == link_helpers_1.FILTER_ARG; })[0];
                        var rightFilterFieldName_1 = outputLinkFieldName;
                        if (filterArg_1) {
                            var leftFilterType = transformationInfo.leftFilterArgType;
                            // first, remove the joined filter arg
                            child = __assign({}, child, { arguments: child.arguments.filter(function (arg) { return arg != filterArg_1; }) });
                            // now see if we need the filter arg for the left field again
                            if (leftFilterType) {
                                var newValue = void 0;
                                switch (filterArg_1.value.kind) {
                                    case 'Variable':
                                        var value = variableValues[filterArg_1.value.name.value] || {};
                                        hasRightFilter = rightFilterFieldName_1 in value;
                                        var valueWithoutRightFilter = __assign({}, value, (_a = {}, _a[rightFilterFieldName_1] = undefined, _a));
                                        // this also takes care of changing the variable type to the original left type
                                        var _b = language_utils_1.addVariableDefinitionSafely(variableDefinitions, filterArg_1.value.name.value, leftFilterType), varName = _b.name, newVariableDefinitions = _b.variableDefinitions;
                                        variableDefinitions = newVariableDefinitions;
                                        variableValues = __assign({}, variableValues, (_c = {}, _c[varName] = valueWithoutRightFilter, _c));
                                        newValue = {
                                            kind: 'Variable',
                                            name: {
                                                kind: 'Name',
                                                value: varName
                                            }
                                        };
                                        break;
                                    case 'ObjectValue':
                                        hasRightFilter = filterArg_1.value.fields.some(function (field) { return field.name.value == rightFilterFieldName_1; });
                                        if (hasRightFilter) {
                                            newValue = __assign({ kind: 'ObjectValue' }, filterArg_1.value, { fields: filterArg_1.value.fields.filter(function (field) { return field.name.value != rightFilterFieldName_1; }) });
                                        }
                                        else {
                                            newValue = filterArg_1.value;
                                        }
                                        break;
                                    case 'NullValue':
                                        newValue = filterArg_1.value;
                                        break;
                                    default:
                                        throw new Error("Invalid value for filter arg: " + filterArg_1.value.kind);
                                }
                                child = __assign({}, child, { arguments: (child.arguments || []).concat([
                                        {
                                            kind: 'Argument',
                                            name: {
                                                kind: 'Name',
                                                value: link_helpers_1.FILTER_ARG
                                            },
                                            value: newValue
                                        }
                                    ]) });
                            }
                        }
                        var hasRightOrderBy = false;
                        // remove order clause if it actually applies to the right side
                        var orderBy_1 = (child.arguments || []).filter(function (arg) { return arg.name.value == link_helpers_1.ORDER_BY_ARG; })[0];
                        if (orderBy_1) {
                            var orderByValue = void 0;
                            switch (orderBy_1.value.kind) {
                                case 'Variable':
                                    orderByValue = variableValues[orderBy_1.value.name.value];
                                    break;
                                case 'EnumValue':
                                    orderByValue = orderBy_1.value.value;
                                    break;
                                case 'NullValue':
                                    orderByValue = undefined;
                                    break;
                                default:
                                    throw new Error("Invalid value for orderBy arg: " + orderBy_1.value.kind);
                            }
                            hasRightOrderBy = orderByValue != undefined && orderByValue.startsWith(outputLinkFieldName + '_');
                            // re-do the argument in any case, because if it was a variable its type is the merge-type
                            // instead of the original left type
                            // let dropUnusedVariables() below take care of the variable definition in that case
                            // first, remove
                            var newArgs = (child.arguments || []).filter(function (arg) { return arg != orderBy_1; });
                            // then, add if appropiate
                            if (orderByValue && !hasRightOrderBy) {
                                newArgs = newArgs.concat([
                                    {
                                        kind: 'Argument',
                                        name: {
                                            kind: 'Name',
                                            value: link_helpers_1.ORDER_BY_ARG
                                        },
                                        value: {
                                            kind: 'EnumValue',
                                            value: orderByValue
                                        }
                                    }
                                ]);
                            }
                            child = __assign({}, child, { arguments: newArgs });
                        }
                        if (child.arguments && (hasRightOrderBy || hasRightFilter)) {
                            // can't limit the number of left objects if the result set depends on the right side
                            child = __assign({}, child, { arguments: child.arguments.filter(function (arg) { return arg.name.value != link_helpers_1.FIRST_ARG; }) });
                        }
                    }
                    if (child != oldChild) {
                        hasChanges = true;
                        return child;
                    }
                    return undefined;
                    var _a, _c;
                },
                leave: function (child) {
                    var fieldStackTop = fieldStack.pop();
                    if (fieldStackTop && fieldStackTop.joinConfig && !fieldStackTop.isLinkFieldSelectedYet) {
                        hasChanges = true;
                        return __assign({}, child, { selectionSet: {
                                kind: 'SelectionSet',
                                selections: (child.selectionSet ? child.selectionSet.selections : []).concat([
                                    language_utils_1.createFieldNode(fieldStackTop.joinConfig.linkField, JOIN_ALIAS)
                                ])
                            } });
                    }
                    return undefined;
                }
            }
        }));
        // avoid query re-building if no @link or @join field is used
        if (!hasChanges) {
            return query;
        }
        // Remove now unnecessary fragments, to avoid processing them in further modules
        // Remove unnecessary variables, e.g. the joined filters
        document = field_as_query_1.dropUnusedFragments(document);
        var operationWithVariables = __assign({}, document.definitions.filter(function (def) { return def.kind == 'OperationDefinition'; })[0], { variableDefinitions: variableDefinitions.length ? variableDefinitions : undefined });
        query = __assign({}, query, { document: __assign({}, document, { definitions: document.definitions.filter(function (def) { return def.kind != 'OperationDefinition'; }).concat([
                    operationWithVariables
                ]) }), variableValues: variableValues });
        return field_as_query_1.dropUnusedVariables(query);
    };
    return LinksModule;
}());
exports.LinksModule = LinksModule;
var SchemaTransformationInfo = /** @class */ (function () {
    function SchemaTransformationInfo() {
        /**
         * Maps typeName.joinField to the information gathered while transforming a join field
         */
        this.joinTransformationInfos = new Map();
        /**
         * Maps typeName.linkField to the information gathered while transforming a link field
         */
        this.linkTransformationInfos = new Map();
    }
    SchemaTransformationInfo.prototype.getJoinTransformationInfo = function (typeName, fieldName) {
        return this.joinTransformationInfos.get(this.getJoinTransformationInfoKey(typeName, fieldName));
    };
    SchemaTransformationInfo.prototype.setJoinTransformationInfo = function (typeName, fieldName, info) {
        this.joinTransformationInfos.set(this.getJoinTransformationInfoKey(typeName, fieldName), info);
    };
    SchemaTransformationInfo.prototype.getJoinTransformationInfoKey = function (typeName, fieldName) {
        return typeName + "." + fieldName;
    };
    SchemaTransformationInfo.prototype.getLinkTransformationInfo = function (typeName, fieldName) {
        return this.linkTransformationInfos.get(this.getLinkTransformationInfoKey(typeName, fieldName));
    };
    SchemaTransformationInfo.prototype.setLinkTransformationInfo = function (typeName, fieldName, info) {
        this.linkTransformationInfos.set(this.getLinkTransformationInfoKey(typeName, fieldName), info);
    };
    SchemaTransformationInfo.prototype.getLinkTransformationInfoKey = function (typeName, fieldName) {
        return typeName + "." + fieldName;
    };
    SchemaTransformationInfo.prototype.isEmpty = function () {
        return this.linkTransformationInfos.size == 0 && this.joinTransformationInfos.size == 0;
    };
    return SchemaTransformationInfo;
}());
/**
 * This is a token for an object which has already been resolved via the link target endpoint (as apposed to being a link key)
 */
var ResolvedLinkObject = /** @class */ (function () {
    function ResolvedLinkObject(obj) {
        Object.assign(this, obj);
    }
    ResolvedLinkObject.prototype.toString = function () {
        return '[ResolvedLinkObject]';
    };
    return ResolvedLinkObject;
}());
var SchemaLinkTransformer = /** @class */ (function () {
    function SchemaLinkTransformer(schema, reportError) {
        this.schema = schema;
        this.reportError = reportError;
        this.transformationInfo = new SchemaTransformationInfo();
        this.inputObjectTypeMap = {};
    }
    SchemaLinkTransformer.prototype.transformField = function (config, context) {
        var _this = this;
        if (config.metadata && config.metadata.join && !config.metadata.join.ignore) {
            var joinMetadata_1 = config.metadata.join;
            error_handling_1.nestErrorHandling(this.reportError, "Error in @join config on " + config.name, function (reportError) {
                config = _this.transformJoinField(config, context, joinMetadata_1, reportError);
                config.metadata.join.ignore = true;
            });
        }
        return config;
    };
    SchemaLinkTransformer.prototype.transformFields = function (fields, context) {
        var _this = this;
        var newFields = {};
        var _loop_1 = function (name, fieldConfig) {
            if (fieldConfig.metadata && fieldConfig.metadata.link && !fieldConfig.metadata.link.ignore) {
                var linkConfig_1 = fieldConfig.metadata.link;
                error_handling_1.nestErrorHandling(this_1.reportError, "Error in @link config on " + context.oldOuterType.name + "." + name, function (reportError) {
                    var _a = _this.transformLinkField(__assign({}, fieldConfig, { name: name }), context, linkConfig_1, reportError), newName = _a.name, newConfig = __rest(_a, ["name"]);
                    if (newName != name) {
                        newFields[name] = __assign({}, fieldConfig, { metadata: __assign({}, fieldConfig.metadata, { link: __assign({}, linkConfig_1, { ignore: true }) }) }); // preserve old field with to linked flag
                    }
                    newFields[newName] = __assign({}, newConfig, { metadata: __assign({}, newConfig.metadata, { link: __assign({}, linkConfig_1, { ignore: true }) }) });
                });
            }
            else {
                newFields[name] = fieldConfig;
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = utils_1.objectEntries(fields); _i < _a.length; _i++) {
            var _b = _a[_i], name = _b[0], fieldConfig = _b[1];
            _loop_1(name, fieldConfig);
        }
        return newFields;
    };
    SchemaLinkTransformer.prototype.transformLinkField = function (config, context, linkConfig, reportError) {
        var _this = this;
        var unlinkedSchema = this.schema.schema;
        var _a = link_helpers_1.parseLinkTargetPath(linkConfig.field, this.schema.schema) ||
            utils_1.throwError(function () { return new errors_1.WeavingError("Target field " + JSON.stringify(linkConfig.field) + " does not exist"); }), targetFieldPath = _a.fieldPath, targetField = _a.field;
        var targetRawType = graphql_1.getNamedType(context.mapType(targetField.type));
        if (!(targetRawType instanceof graphql_1.GraphQLObjectType) && !(targetRawType instanceof graphql_1.GraphQLInterfaceType)) {
            throw new errors_1.WeavingError("Target field " + JSON.stringify(linkConfig.field) + " is of type " + targetRawType + ", but only object and interface types are supported.");
        }
        if (linkConfig.keyField && !(linkConfig.keyField in targetRawType.getFields())) {
            throw new errors_1.WeavingError("keyField " + JSON.stringify(linkConfig.keyField) + " does not exist in target type " + targetRawType.name + ".");
        }
        if (linkConfig.batchMode && linkConfig.oneToMany) {
            throw new errors_1.WeavingError("batchMode and oneToMany are mutually exclusive.");
        }
        if (linkConfig.oneToMany && !schema_utils_1.isListType(targetField.type)) {
            throw new errors_1.WeavingError("oneToMany is configured, but target field " + JSON.stringify(linkConfig.field) + " is not of type GraphQLList.");
        }
        var isListMode = schema_utils_1.isListType(config.type);
        var keyType = link_helpers_1.getKeyType({
            linkFieldName: config.name,
            linkFieldType: context.mapType(config.type),
            targetField: targetField,
            parentObjectType: context.mapType(context.oldOuterType),
            linkConfig: linkConfig,
            reportError: reportError
        });
        var dataLoaders = new multi_key_weak_map_1.ArrayKeyWeakMap();
        /**
         * Fetches an object by its key, but collects keys before sending a batch request
         */
        function fetchDeferred(key, info, context) {
            return __awaiter(this, void 0, void 0, function () {
                var dataLoaderKey, dataLoader;
                return __generator(this, function (_a) {
                    dataLoaderKey = info.fieldNodes.concat([context]);
                    dataLoader = dataLoaders.get(dataLoaderKey);
                    if (!dataLoader) {
                        dataLoader = new DataLoader(function (keys) { return link_helpers_1.fetchLinkedObjects({
                            keys: keys, info: info, unlinkedSchema: unlinkedSchema, keyType: keyType, linkConfig: linkConfig, context: context
                        }); });
                        dataLoaders.set(dataLoaderKey, dataLoader);
                    }
                    return [2 /*return*/, dataLoader.load(key)];
                });
            });
        }
        var linkFieldName = linkConfig.linkFieldName || config.name;
        this.transformationInfo.setLinkTransformationInfo(context.newOuterType.name, linkFieldName, {
            linkConfig: linkConfig,
            sourceFieldName: config.name
        });
        return __assign({}, config, { name: linkFieldName, resolve: function (source, vars, context, info) { return __awaiter(_this, void 0, void 0, function () {
                var fieldNode, originalValue, _a, extendedInfo, keys, key;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            fieldNode = info.fieldNodes[0];
                            if (!config.resolve) return [3 /*break*/, 2];
                            return [4 /*yield*/, config.resolve(source, vars, context, info)];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = source[fieldNode.name.value];
                            _b.label = 3;
                        case 3:
                            originalValue = _a;
                            if (!originalValue || originalValue instanceof ResolvedLinkObject) {
                                return [2 /*return*/, originalValue];
                            }
                            extendedInfo = __assign({}, info, { context: context });
                            if (isListMode) {
                                keys = originalValue;
                                return [2 /*return*/, Promise.all(keys.map(function (key) { return fetchDeferred(key, info, context); }))];
                            }
                            else {
                                key = originalValue;
                                return [2 /*return*/, fetchDeferred(key, info, context)];
                            }
                            return [2 /*return*/];
                    }
                });
            }); }, type: isListMode || linkConfig.oneToMany ? new graphql_1.GraphQLList(targetRawType) : targetRawType });
    };
    SchemaLinkTransformer.prototype.transformJoinField = function (config, context, joinConfig, reportError) {
        var _this = this;
        var linkFieldName = joinConfig.linkField;
        var leftType = graphql_1.getNamedType(context.oldField.type);
        if (!(leftType instanceof graphql_1.GraphQLObjectType) && !(leftType instanceof graphql_1.GraphQLInterfaceType)) {
            throw new errors_1.WeavingError("@join feature only supported on object types and interface types, but is " + leftType.constructor.name);
        }
        var linkField = leftType.getFields()[linkFieldName]; // why any?
        if (!linkField) {
            throw new errors_1.WeavingError("linkField " + JSON.stringify(linkFieldName) + " does not exist in this type");
        }
        var linkFieldMetadata = this.schema.getFieldMetadata(leftType, linkField); // no metadata on interfaces yet
        var linkConfig = linkFieldMetadata ? linkFieldMetadata.link : undefined;
        if (!linkConfig) {
            throw new errors_1.WeavingError("Field " + JSON.stringify(linkFieldName) + " is referenced as linkField but has no @link configuration");
        }
        if (!linkConfig.batchMode || !linkConfig.keyField) {
            throw new errors_1.WeavingError("@join is only possible on @link fields with batchMode=true and keyField set");
        }
        if (linkConfig.oneToMany) {
            throw new errors_1.WeavingError("Link specifies oneToMany, but @join does not support one-to-many links.");
        }
        var _a = link_helpers_1.parseLinkTargetPath(linkConfig.field, this.schema.schema) ||
            utils_1.throwError("Link defines target field as " + JSON.stringify(linkConfig.field) + " which does not exist"), targetFieldPath = _a.fieldPath, targetField = _a.field;
        if (schema_utils_1.isListType(linkField.type)) {
            throw new errors_1.WeavingError("@join not available for linkFields with array type");
        }
        var leftObjectType = graphql_1.getNamedType(context.oldField.type);
        var rightObjectType = graphql_1.getNamedType(targetField.type);
        var keyType = link_helpers_1.getKeyType({
            linkFieldName: linkFieldName,
            linkFieldType: linkField.type,
            targetField: targetField,
            parentObjectType: leftObjectType,
            linkConfig: linkConfig,
            reportError: reportError
        });
        // This may differ from the name of the linkField in case the link field is renamed
        var outLinkFieldName = linkConfig.linkFieldName || linkFieldName;
        // terminology: left and right in the sense of a SQL join (left is link, right is target)
        // filter
        var leftFilterArg = context.oldField.args.filter(function (arg) { return arg.name == link_helpers_1.FILTER_ARG; })[0];
        var rightFilterArg = targetField.args.filter(function (arg) { return arg.name == link_helpers_1.FILTER_ARG; })[0];
        var newFilterType;
        if (rightFilterArg) {
            var newFilterTypeName = this.generateJoinFilterTypeName(leftObjectType, leftFilterArg, rightObjectType, rightFilterArg);
            var newFilterFields = void 0;
            if (!leftFilterArg) {
                newFilterFields = (_b = {},
                    _b[outLinkFieldName] = {
                        type: context.mapType(rightFilterArg.type)
                    },
                    _b);
            }
            else {
                var leftFilterType = context.mapType(leftFilterArg.type);
                if (!(leftFilterType instanceof graphql_1.GraphQLInputObjectType)) {
                    throw new errors_1.WeavingError("Type of filter argument should be InputObjectType, but is " + leftFilterArg.type);
                }
                newFilterFields = __assign({}, leftFilterType.getFields(), (_c = {}, _c[outLinkFieldName] = {
                    type: context.mapType(rightFilterArg.type)
                }, _c));
            }
            newFilterType = this.findOrCreateInputObjectType(newFilterTypeName, { fields: newFilterFields });
        }
        else {
            newFilterType = leftFilterArg ? leftFilterArg.type : undefined;
        }
        // only provide explicitly supported arguments, as unsupported arguments likely cause unforseen errors in the result
        var newArguments = {};
        if (newFilterType) {
            newArguments = __assign({}, newArguments, (_d = {}, _d[link_helpers_1.FILTER_ARG] = {
                type: newFilterType
            }, _d));
        }
        // order
        var leftOrderByArg = config.args ? config.args[link_helpers_1.ORDER_BY_ARG] : undefined;
        var rightOrderByArg = targetField.args.filter(function (arg) { return arg.name == link_helpers_1.ORDER_BY_ARG; })[0];
        var newOrderByType;
        if (rightOrderByArg) {
            var rightOrderByType = graphql_1.getNamedType(rightOrderByArg.type);
            if (!(rightOrderByType instanceof graphql_1.GraphQLEnumType)) {
                throw new errors_1.WeavingError("orderBy argument of target field " + JSON.stringify(targetFieldPath) + " should be of enum type, but is " + rightOrderByType.constructor.name);
            }
            var newOrderByTypeName = this.generateJoinOrderByTypeName(leftObjectType, leftOrderByArg, rightObjectType, rightOrderByArg);
            var newEnumValues = [];
            if (leftOrderByArg) {
                var leftOrderByType = graphql_1.getNamedType(leftOrderByArg.type);
                if (!(leftOrderByType instanceof graphql_1.GraphQLEnumType)) {
                    throw new errors_1.WeavingError("orderBy argument should be of enum type, but is " + leftOrderByType.constructor.name);
                }
                newEnumValues = leftOrderByType.getValues();
            }
            newEnumValues = newEnumValues.concat((rightOrderByType.getValues().map(function (val) { return (__assign({}, val, { name: outLinkFieldName + "_" + val.name, value: outLinkFieldName + "_" + val.value })); })));
            newOrderByType = this.findOrCreateEnumType(newOrderByTypeName, {
                values: utils_1.arrayToObject(newEnumValues.map(function (_a) {
                    var name = _a.name, value = _a.value, deprecationReason = _a.deprecationReason;
                    return ({
                        name: name, value: value, deprecationReason: deprecationReason
                    });
                }), function (val) { return val.name; })
            });
        }
        else {
            newOrderByType = leftOrderByArg ? leftOrderByArg.type : undefined;
        }
        if (newOrderByType) {
            newArguments = __assign({}, newArguments, (_e = {}, _e[link_helpers_1.ORDER_BY_ARG] = {
                type: newOrderByType
            }, _e));
        }
        // first
        var leftFirstArgument = config.args ? config.args[link_helpers_1.FIRST_ARG] : undefined;
        var rightFirstArgument = targetField.args.filter(function (arg) { return arg.name == link_helpers_1.FIRST_ARG; })[0];
        if (leftFirstArgument) {
            newArguments = __assign({}, newArguments, (_f = {}, _f[link_helpers_1.FIRST_ARG] = leftFirstArgument, _f));
        }
        this.transformationInfo.setJoinTransformationInfo(context.newOuterType.name, config.name, {
            leftFilterArgType: leftFilterArg ? leftFilterArg.type : undefined
        });
        return __assign({}, config, { args: newArguments, resolve: function (source, args, resolveContext, info) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var leftObjects, rightFilter, doInnerJoin, rightOrderBy, orderByValue, selections, linkFieldNodes, linkFieldNodesByAlias, linkFieldAliases, anyAliasFieldNodePair, anyLinkFieldAlias, rightKeysToLeftObjects, rightKeys, aliasesToRightObjectLists, leftObjectList, anyRightObjectList, leftObjectsSoFar_1, _loop_2, _i, _a, rightObject, isDescSort, leftObjectsWithoutRightObject, _b, leftObjects_1, leftObject, _c, aliasesToRightObjectLists_1, _d, alias, objectsByID, key, rightObject, first;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, context.oldField.resolve(source, args, resolveContext, info)];
                        case 1:
                            leftObjects = _e.sent();
                            // Copy the objects so we can add aliases
                            leftObjects = leftObjects.slice();
                            rightFilter = undefined;
                            if (args[link_helpers_1.FILTER_ARG] != undefined) {
                                rightFilter = args[link_helpers_1.FILTER_ARG][outLinkFieldName];
                            }
                            doInnerJoin = !!rightFilter;
                            rightOrderBy = undefined;
                            if (args[link_helpers_1.ORDER_BY_ARG] != undefined) {
                                orderByValue = args[link_helpers_1.ORDER_BY_ARG];
                                if (orderByValue.startsWith(outLinkFieldName + '_')) {
                                    rightOrderBy = orderByValue.substr((outLinkFieldName + '_').length);
                                }
                            }
                            selections = utils_1.flatMap(info.fieldNodes, function (node) { return node.selectionSet.selections; });
                            linkFieldNodes = language_utils_1.expandSelections(selections)
                                .filter(function (node) { return node.name.value == outLinkFieldName; });
                            linkFieldNodesByAlias = Array.from(utils_1.groupBy(linkFieldNodes, function (node) { return language_utils_1.getAliasOrName(node); }));
                            linkFieldAliases = linkFieldNodesByAlias.map(function (_a) {
                                var alias = _a[0];
                                return alias;
                            });
                            // If the link field does not occur in the selection set, do one request anyway just to apply the filtering or ordering
                            // the alias is "undefined" so that it will not occur in the result object
                            if ((rightFilter || rightOrderBy) && !linkFieldNodesByAlias.length) {
                                linkFieldNodesByAlias.push([
                                    undefined, [
                                        {
                                            kind: 'Field',
                                            name: {
                                                kind: 'Name',
                                                value: outLinkFieldName
                                            }
                                        }
                                    ]
                                ]);
                            }
                            anyAliasFieldNodePair = linkFieldNodesByAlias[0];
                            anyLinkFieldAlias = anyAliasFieldNodePair ? anyAliasFieldNodePair[0] || JOIN_ALIAS : JOIN_ALIAS;
                            rightKeysToLeftObjects = anyAliasFieldNodePair ? utils_1.groupBy(leftObjects, function (obj) { return obj[anyLinkFieldAlias]; }) : new Map();
                            rightKeys = Array.from(rightKeysToLeftObjects.keys());
                            return [4 /*yield*/, Promise.all(linkFieldNodesByAlias.map(function (_a) {
                                    var alias = _a[0], fieldNodes = _a[1];
                                    return __awaiter(_this, void 0, void 0, function () {
                                        var linkFieldInfo, first, res;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    linkFieldInfo = {
                                                        operation: info.operation,
                                                        variableValues: info.variableValues,
                                                        fragments: info.fragments,
                                                        fieldNodes: fieldNodes,
                                                        path: info.path
                                                    };
                                                    first = undefined;
                                                    if ((rightFilter || rightOrderBy) && doInnerJoin && link_helpers_1.FIRST_ARG in args) {
                                                        first = args[link_helpers_1.FIRST_ARG];
                                                    }
                                                    return [4 /*yield*/, link_helpers_1.fetchJoinedObjects({
                                                            keys: utils_1.compact(rightKeys),
                                                            additionalFilter: rightFilter,
                                                            filterType: rightFilterArg.type,
                                                            orderBy: rightOrderBy,
                                                            first: first,
                                                            keyType: keyType,
                                                            linkConfig: linkConfig,
                                                            unlinkedSchema: this.schema.schema,
                                                            info: linkFieldInfo,
                                                            context: resolveContext
                                                        })];
                                                case 1:
                                                    res = _a.sent();
                                                    return [2 /*return*/, __assign({ alias: alias }, res)];
                                            }
                                        });
                                    });
                                }))];
                        case 2:
                            aliasesToRightObjectLists = _e.sent();
                            leftObjectList = [];
                            if (rightOrderBy) {
                                anyRightObjectList = aliasesToRightObjectLists[0];
                                leftObjectsSoFar_1 = new Set();
                                _loop_2 = function (rightObject) {
                                    var rightObjectKey = rightObject[anyRightObjectList.keyFieldAlias];
                                    var leftObjectForRightObject = rightKeysToLeftObjects.get(rightObjectKey) || [];
                                    // Filter out left object where one alias found a linked object, but another one did not. This
                                    // is more consistent and uses would not expect a linked field to be Null with an INNER JOIN.
                                    var leftObjectKeyAlias = anyRightObjectList.alias || JOIN_ALIAS;
                                    var leftObjectsWithCompleteRightObjects = leftObjectForRightObject.filter(function (leftObject) { return aliasesToRightObjectLists.every(function (_a) {
                                        var objectsByID = _a.objectsByID;
                                        return objectsByID.has(leftObject[leftObjectKeyAlias]);
                                    }); });
                                    for (var _i = 0, aliasesToRightObjectLists_2 = aliasesToRightObjectLists; _i < aliasesToRightObjectLists_2.length; _i++) {
                                        var _a = aliasesToRightObjectLists_2[_i], alias = _a.alias, orderedObjects = _a.orderedObjects, objectsByID = _a.objectsByID;
                                        for (var _b = 0, leftObjectsWithCompleteRightObjects_1 = leftObjectsWithCompleteRightObjects; _b < leftObjectsWithCompleteRightObjects_1.length; _b++) {
                                            var leftObject = leftObjectsWithCompleteRightObjects_1[_b];
                                            leftObjectsSoFar_1.add(leftObject);
                                            var key = leftObject[alias || JOIN_ALIAS];
                                            var rightObject_1 = objectsByID.get(key);
                                            if (alias && rightObject_1) {
                                                leftObject[alias] = new ResolvedLinkObject(rightObject_1);
                                            }
                                        }
                                    }
                                    leftObjectList.push.apply(leftObjectList, leftObjectsWithCompleteRightObjects);
                                };
                                for (_i = 0, _a = anyRightObjectList.orderedObjects; _i < _a.length; _i++) {
                                    rightObject = _a[_i];
                                    _loop_2(rightObject);
                                }
                                if (!doInnerJoin) {
                                    isDescSort = rightOrderBy.toUpperCase().endsWith('_DESC');
                                    if (!isDescSort && !rightOrderBy.toUpperCase().endsWith('_ASC')) {
                                        throw new Error("Expected order by clause " + rightOrderBy + " to end with _ASC or _DESC");
                                    }
                                    leftObjectsWithoutRightObject = leftObjects.filter(function (obj) { return !leftObjectsSoFar_1.has(obj); });
                                    if (isDescSort) {
                                        leftObjectList.push.apply(leftObjectList, leftObjectsWithoutRightObject);
                                    }
                                    else {
                                        leftObjectList.unshift.apply(leftObjectList, leftObjectsWithoutRightObject);
                                    }
                                }
                            }
                            else {
                                // apply order from left side
                                if (doInnerJoin) {
                                    leftObjects = leftObjects.filter(function (leftObject) { return aliasesToRightObjectLists.every(function (_a) {
                                        var objectsByID = _a.objectsByID, alias = _a.alias;
                                        return objectsByID.has(leftObject[alias || JOIN_ALIAS]);
                                    }); });
                                }
                                for (_b = 0, leftObjects_1 = leftObjects; _b < leftObjects_1.length; _b++) {
                                    leftObject = leftObjects_1[_b];
                                    for (_c = 0, aliasesToRightObjectLists_1 = aliasesToRightObjectLists; _c < aliasesToRightObjectLists_1.length; _c++) {
                                        _d = aliasesToRightObjectLists_1[_c], alias = _d.alias, objectsByID = _d.objectsByID;
                                        key = leftObject[alias || JOIN_ALIAS];
                                        rightObject = objectsByID.get(key);
                                        if (alias && rightObject) {
                                            leftObject[alias] = new ResolvedLinkObject(rightObject);
                                        }
                                    }
                                }
                                leftObjectList = leftObjects;
                            }
                            if (args[link_helpers_1.FIRST_ARG] != undefined) {
                                first = args[link_helpers_1.FIRST_ARG];
                                leftObjectList = leftObjectList.slice(0, first);
                            }
                            return [2 /*return*/, leftObjectList];
                    }
                });
            }); } });
        var _b, _c, _d, _e, _f;
    };
    SchemaLinkTransformer.prototype.generateJoinFilterTypeName = function (leftObjectType, leftFilterArg, rightObjectType, rightFilterArg) {
        var leftPart = '';
        var rightPart = '';
        if (leftFilterArg) {
            leftPart = leftFilterArg.type instanceof graphql_1.GraphQLInputObjectType ? leftFilterArg.type.name.replace(/Filter$/, '') : leftObjectType.name;
        }
        if (rightFilterArg) {
            rightPart = rightFilterArg.type instanceof graphql_1.GraphQLInputObjectType ? rightFilterArg.type.name.replace(/Filter$/, '') : rightObjectType.name;
        }
        var separator = leftPart && rightPart ? 'With' : '';
        return "" + leftPart + separator + rightPart + "JoinedFilter";
    };
    SchemaLinkTransformer.prototype.generateJoinOrderByTypeName = function (leftObjectType, leftOrderArg, rightObjectType, rightOrderArg) {
        var leftPart = '';
        var rightPart = '';
        if (leftOrderArg) {
            leftPart = leftOrderArg.type instanceof graphql_1.GraphQLEnumType ? leftOrderArg.type.name.replace(/OrderBy$/, '') : leftObjectType.name;
        }
        if (rightOrderArg) {
            rightPart = rightOrderArg.type instanceof graphql_1.GraphQLEnumType ? rightOrderArg.type.name.replace(/OrderBy$/, '') : rightObjectType.name;
        }
        var separator = leftPart && rightPart ? 'With' : '';
        return "" + leftPart + separator + rightPart + "JoinedOrderBy";
    };
    SchemaLinkTransformer.prototype.findOrCreateInputObjectType = function (name, fallback) {
        var result = this.inputObjectTypeMap[name];
        if (!result) {
            result = new graphql_1.GraphQLInputObjectType(__assign({}, fallback, { name: name }));
            this.inputObjectTypeMap[name] = result;
        }
        return result;
    };
    SchemaLinkTransformer.prototype.findOrCreateEnumType = function (name, fallback) {
        var result = this.inputObjectTypeMap[name];
        if (!result) {
            result = new graphql_1.GraphQLEnumType(__assign({}, fallback, { name: name }));
            this.inputObjectTypeMap[name] = result;
        }
        return result;
    };
    return SchemaLinkTransformer;
}());
//# sourceMappingURL=links.js.map