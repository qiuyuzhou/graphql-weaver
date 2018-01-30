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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var extended_schema_1 = require("../../src/extended-schema/extended-schema");
var extended_introspection_1 = require("../../src/extended-schema/extended-introspection");
var fetch_metadata_1 = require("../../src/extended-schema/fetch-metadata");
var local_client_1 = require("../../src/graphql-client/local-client");
var graphql_transformer_1 = require("graphql-transformer");
var utils_1 = require("../../src/utils/utils");
var execution_result_1 = require("../../src/graphql/execution-result");
describe('extended-introspection', function () {
    var fieldMetadata = {
        link: {
            field: 'targetField',
            batchMode: true,
            keyField: 'keyField',
            argument: 'arg'
        }
    };
    function createSchemaWithIntrospection(fields, metadata) {
        var data = extended_introspection_1.getExtendedIntrospectionData(metadata);
        return new graphql_1.GraphQLSchema({
            query: new graphql_1.GraphQLObjectType({
                name: 'Query',
                fields: __assign({}, fields, (_a = {}, _a[extended_introspection_1.EXTENDED_INTROSPECTION_FIELD] = {
                    type: extended_introspection_1.getExtendedIntrospectionType(),
                    resolve: function () { return data; }
                }, _a))
            })
        });
        var _a;
    }
    function createSimpleSchema() {
        var metadata = new extended_schema_1.SchemaMetadata();
        metadata.fieldMetadata.set('Query.field', fieldMetadata);
        return createSchemaWithIntrospection({
            field: {
                type: graphql_1.GraphQLString
            }
        }, metadata);
    }
    describe('ExtendedIntrospectionType', function () {
        it('creates valid GraphQL schema', function () {
            createSimpleSchema();
        });
        it('is compatible with a basic introspection query', function () { return __awaiter(_this, void 0, void 0, function () {
            var schema, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = createSimpleSchema();
                        query = "{ _extIntrospection { types { name fields { name metadata { link { argument } } } } } }";
                        return [4 /*yield*/, graphql_1.graphql(schema, query)];
                    case 1:
                        result = _a.sent();
                        execution_result_1.assertSuccessfulResult(result);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchSchemaMetadata', function () {
        it('is compatible with ExtendedIntrospectionType', function () { return __awaiter(_this, void 0, void 0, function () {
            var schema, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = createSimpleSchema();
                        return [4 /*yield*/, fetch_metadata_1.fetchSchemaMetadata(new local_client_1.LocalGraphQLClient(schema), schema)];
                    case 1:
                        metadata = _a.sent();
                        expect(metadata.fieldMetadata.has('Query.field')).toBeTruthy('Query.field missing');
                        expect(metadata.fieldMetadata.get('Query.field')).toEqual(fieldMetadata);
                        return [2 /*return*/];
                }
            });
        }); });
        it('is compatible with older ExtendedIntrospectionType', function () { return __awaiter(_this, void 0, void 0, function () {
            var schema, reducedSchema, linkConfigType, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = createSimpleSchema();
                        reducedSchema = graphql_transformer_1.transformSchema(schema, {
                            transformFields: function (config) {
                                return utils_1.filterValues(config, function (value, key) { return key != 'keyField'; });
                            }
                        });
                        linkConfigType = reducedSchema.getTypeMap()[extended_introspection_1.EXTENDED_INTROSPECTION_TYPE_NAMES.fieldLink];
                        expect(Object.keys(linkConfigType.getFields())).toEqual(['field', 'batchMode', 'argument', 'linkFieldName', 'ignore']);
                        return [4 /*yield*/, fetch_metadata_1.fetchSchemaMetadata(new local_client_1.LocalGraphQLClient(reducedSchema), reducedSchema)];
                    case 1:
                        metadata = _a.sent();
                        expect(metadata.fieldMetadata.has('Query.field')).toBeTruthy('Query.field missing');
                        expect(metadata.fieldMetadata.get('Query.field').link.field).toEqual(fieldMetadata.link.field);
                        expect(metadata.fieldMetadata.get('Query.field').link.keyField).toBeUndefined('keyField should be undefined');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=extended-introspection.spec.js.map