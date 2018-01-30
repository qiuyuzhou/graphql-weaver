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
var graphql_1 = require("graphql");
var extended_schema_1 = require("./extended-schema");
var extended_introspection_1 = require("./extended-introspection");
var language_utils_1 = require("../graphql/language-utils");
var execution_result_1 = require("../graphql/execution-result");
/**
 * Fetches SchemaMetadata over a GraphQL endpoint
 * @param {GraphQLClient} endpoint the endpoint to submit queries
 * @param {GraphQLSchema} schema the client schema
 * @returns {Promise<any>} the metadata
 */
function fetchSchemaMetadata(endpoint, schema) {
    return __awaiter(this, void 0, void 0, function () {
        var result, resultData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!supportsExtendedIntrospection(schema)) {
                        return [2 /*return*/, new extended_schema_1.SchemaMetadata()];
                    }
                    return [4 /*yield*/, endpoint.execute(getTailoredExtendedIntrospectionQuery(schema), undefined, undefined, true)];
                case 1:
                    result = _a.sent();
                    resultData = execution_result_1.assertSuccessfulResult(result);
                    return [2 /*return*/, extended_introspection_1.buildSchemaMetadata(resultData[extended_introspection_1.EXTENDED_INTROSPECTION_FIELD])];
            }
        });
    });
}
exports.fetchSchemaMetadata = fetchSchemaMetadata;
function supportsExtendedIntrospection(schema) {
    return extended_introspection_1.EXTENDED_INTROSPECTION_FIELD in schema.getQueryType().getFields();
}
exports.supportsExtendedIntrospection = supportsExtendedIntrospection;
function getTailoredExtendedIntrospectionQuery(schema) {
    var fieldMetadataSelections = [];
    var joinType = schema.getType(extended_introspection_1.EXTENDED_INTROSPECTION_TYPE_NAMES.fieldJoin);
    if (joinType) {
        // mandatory fields
        var joinSelections = [
            language_utils_1.createFieldNode('linkField'),
            language_utils_1.createFieldNode('ignore')
        ];
        fieldMetadataSelections.push(language_utils_1.createFieldNode('join', undefined, joinSelections));
    }
    var linkType = schema.getType(extended_introspection_1.EXTENDED_INTROSPECTION_TYPE_NAMES.fieldLink);
    if (linkType && linkType instanceof graphql_1.GraphQLObjectType) {
        var propertyNames = ['field', 'argument', 'batchMode', 'keyField', 'linkFieldName', 'ignore'];
        var linkSelections = propertyNames
            .filter(function (name) { return name in linkType.getFields(); })
            .map(function (name) { return language_utils_1.createFieldNode(name); });
        fieldMetadataSelections.push(language_utils_1.createFieldNode('link', undefined, linkSelections));
    }
    var introspectionField = language_utils_1.createFieldNode(extended_introspection_1.EXTENDED_INTROSPECTION_FIELD, undefined, [
        language_utils_1.createFieldNode('types', undefined, [
            language_utils_1.createFieldNode('name'),
            language_utils_1.createFieldNode('fields', undefined, [
                language_utils_1.createFieldNode('name'),
                language_utils_1.createFieldNode('metadata', undefined, fieldMetadataSelections)
            ])
        ])
    ]);
    return {
        kind: 'Document',
        definitions: [
            {
                kind: 'OperationDefinition',
                operation: 'query',
                selectionSet: {
                    kind: 'SelectionSet',
                    selections: [introspectionField]
                }
            }
        ]
    };
}
//# sourceMappingURL=fetch-metadata.js.map