"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extended_schema_1 = require("./extended-schema");
var utils_1 = require("../utils/utils");
var merge_schemas_1 = require("../graphql/merge-schemas");
/**
 * Merges multiple GraphQL schemas by merging the fields of root types (query, mutation, subscription).
 * Also takes care of extended field metadata
 */
function mergeExtendedSchemas() {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    var fieldMetadata = mergeFieldMetadata.apply(void 0, schemas.map(function (schema) { return schema.fieldMetadata; }));
    return new extended_schema_1.ExtendedSchema(merge_schemas_1.mergeSchemas(schemas.map(function (schema) { return schema.schema; })), new extended_schema_1.SchemaMetadata({ fieldMetadata: fieldMetadata }));
}
exports.mergeExtendedSchemas = mergeExtendedSchemas;
function mergeFieldMetadata() {
    var metadatas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        metadatas[_i] = arguments[_i];
    }
    return new Map(utils_1.flatMap(metadatas, function (map) { return Array.from(map); }));
}
exports.mergeFieldMetadata = mergeFieldMetadata;
//# sourceMappingURL=merge-extended-schemas.js.map