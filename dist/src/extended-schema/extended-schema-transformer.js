"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var extended_schema_1 = require("./extended-schema");
var graphql_transformer_1 = require("graphql-transformer");
var graphql_1 = require("graphql");
var utils_1 = require("../utils/utils");
// do everything as if fieldMetadata was a property of Field / FieldConfig
// transformObjectType: no action required
// transformField: get metadata via old type -> call (if defined) -> store metadata with new key (type + field)
// transformFields (if defined): get and delete all metadata via new type + new field names -> call -> store all metadata
/**
 * Transforms an ExtendedSchema via transformation functions for the schema elements
 *
 * This makes it seem as if fieldMetadata was a property of GraphQLField / GraphQLFieldConfig - it can be modified in
 * transformField() and transformFields(). Fields can even be added or removed in transformFields(). As long as the
 * metadata property is carried around properly, everything should work as expected.
 *
 * @param schema
 * @param transformer
 * @returns {any}
 */
function transformExtendedSchema(schema, transformer) {
    // This is a bit of an ugly data structure because it changes over time
    // At the beginning, it is empty
    // After transformField() is called for all fields of a type, it contains the *new* metadata map with new type names,
    //   new field names and new metadata values.
    // If transformFields() is defined, for each type, the metadata keys are first removed completely (and passed to
    //   transformFields), then re-added properly with the even newer field names and metadata values
    var fieldMetadata = new Map();
    // not using methods in here to work around https://github.com/Microsoft/TypeScript/issues/16765
    var regularTransformer = __assign({}, bindTransformerFunctions(transformer), { transformField: function (config, context) {
            // non-object (interface) fields have no metadata
            var type = context.oldOuterType;
            if (!(type instanceof graphql_1.GraphQLObjectType)) {
                if (transformer.transformField) {
                    return transformer.transformField(config, context);
                }
                else {
                    return config;
                }
            }
            // for object types, we need to do this even if the transformField method is not defined, just to do the
            // potential *type* renaming
            // enrich with metadata, using old type and field because we use the schema's metadata store
            var extendedConfig = __assign({}, config, { metadata: schema.getFieldMetadata(type, context.oldField) });
            // if there is a transformer, call it
            if (transformer.transformField) {
                extendedConfig = transformer.transformField(extendedConfig, context);
            }
            // Now, if there is (still) metadata, set it in the new store with new type and field name
            if (extendedConfig.metadata) {
                fieldMetadata.set(context.newOuterType.name + "." + extendedConfig.name, extendedConfig.metadata);
            }
            // Do the "normal" transformation, but strip out metadata
            var metadata = extendedConfig.metadata, regularConfig = __rest(extendedConfig, ["metadata"]);
            return regularConfig;
        }, transformFields: function (config, context) {
            // If transformFields is not defined, we don't need to do anything
            var fn = utils_1.maybeDo(transformer.transformFields, function (fn) { return fn.bind(transformer); });
            if (!fn) {
                return config;
            }
            // non-object (interface) fields have no metadata
            var type = context.oldOuterType;
            if (!(type instanceof graphql_1.GraphQLObjectType)) {
                return fn(config, context);
            }
            // Enrich config with metadata values from new metadata store, but delete them from the store
            // because we will add all the even-newer metadata later
            var extendedConfig = utils_1.mapValues(config, function (config, fieldName) {
                var key = context.newOuterType + "." + fieldName;
                var metadata = fieldMetadata.get(key);
                fieldMetadata.delete(key);
                return __assign({}, config, { metadata: metadata });
            });
            // call the transformer
            var result = fn(extendedConfig, context);
            // Now, store the even-newer metadata and strip the metadata property from the config
            var regularResult = utils_1.mapValues(result, function (_a, fieldName) {
                var metadata = _a.metadata, regularConfig = __rest(_a, ["metadata"]);
                if (metadata) {
                    var key = context.newOuterType + "." + fieldName;
                    fieldMetadata.set(key, metadata);
                }
                return regularConfig;
            });
            // do the regular transform
            return regularResult;
        } });
    var newSchema = graphql_transformer_1.transformSchema(schema.schema, regularTransformer);
    return new extended_schema_1.ExtendedSchema(newSchema, new extended_schema_1.SchemaMetadata({ fieldMetadata: fieldMetadata }));
}
exports.transformExtendedSchema = transformExtendedSchema;
function bindTransformerFunctions(t) {
    return {
        transformScalarType: utils_1.bindNullable(t.transformScalarType, t),
        transformEnumType: utils_1.bindNullable(t.transformEnumType, t),
        transformInterfaceType: utils_1.bindNullable(t.transformInterfaceType, t),
        transformInputObjectType: utils_1.bindNullable(t.transformInputObjectType, t),
        transformUnionType: utils_1.bindNullable(t.transformUnionType, t),
        transformObjectType: utils_1.bindNullable(t.transformObjectType, t),
        transformDirective: utils_1.bindNullable(t.transformDirective, t),
        transformField: utils_1.bindNullable(t.transformField, t),
        transformInputField: utils_1.bindNullable(t.transformInputField, t)
    };
}
//# sourceMappingURL=extended-schema-transformer.js.map