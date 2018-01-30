"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var extended_schema_1 = require("./extended-schema");
var utils_1 = require("../utils/utils");
exports.EXTENDED_INTROSPECTION_FIELD = '_extIntrospection';
exports.EXTENDED_INTROSPECTION_TYPE_NAMES = {
    introspection: '_ExtendedIntrospection',
    type: '_ExtendedType',
    field: '_ExtendedField',
    fieldMetadata: '_FieldMetadata',
    fieldLink: '_FieldLink',
    fieldJoin: '_FieldJoin'
};
var extendedIntrospectionType;
/**
 * Gets an object type to be used as a field called {@link EXTENDED_INTROSPECTION_FIELD} that exposes metadata in the
 * schema. The field value should be {@link ExtendedIntrospectionData}, as created by
 * {@link getExtendedIntrospectionData}
 */
function getExtendedIntrospectionType() {
    if (!extendedIntrospectionType) {
        extendedIntrospectionType = createExtendedIntrospectionType();
    }
    return extendedIntrospectionType;
}
exports.getExtendedIntrospectionType = getExtendedIntrospectionType;
/**
 * Constructs the data for {@link getExtendedIntrospectionType()} from a SchemaMetadata
 */
function getExtendedIntrospectionData(metadata) {
    var keys = Array.from(metadata.fieldMetadata.keys());
    return {
        types: keys
            .map(function (key) { return key.split('.')[0]; })
            .map(function (typeName) { return ({
            name: typeName,
            fields: keys
                .filter(function (key) { return key.startsWith(typeName + '.'); })
                .map(function (key) { return ({ name: key.split('.', 2)[1], metadata: metadata.fieldMetadata.get(key) }); })
        }); })
    };
}
exports.getExtendedIntrospectionData = getExtendedIntrospectionData;
/**
 * Builds a {@link SchemaMetadata} instance from the result of an extended introspection query
 * @param data
 */
function buildSchemaMetadata(data) {
    var map = new Map();
    for (var _i = 0, _a = data.types; _i < _a.length; _i++) {
        var type = _a[_i];
        for (var _b = 0, _c = type.fields; _b < _c.length; _b++) {
            var field = _c[_b];
            // remove the null fields of GraphQL because fields in FieldMetadata are marked as optional and not with |null.
            var fieldMetadata = utils_1.filterValuesDeep(field.metadata, function (val) { return val != undefined; });
            map.set(type.name + '.' + field.name, fieldMetadata);
        }
    }
    return new extended_schema_1.SchemaMetadata({ fieldMetadata: map });
}
exports.buildSchemaMetadata = buildSchemaMetadata;
function createExtendedIntrospectionType() {
    var linkType = new graphql_1.GraphQLObjectType({
        name: exports.EXTENDED_INTROSPECTION_TYPE_NAMES.fieldLink,
        description: 'Configuration of a link on a field. If this metadata is present, the consumer should replace the type of the field with the type of the linked field and, for the value of this field, fetch objects from the linked field according to this config',
        fields: {
            field: {
                description: 'The field or a dot-separated list of fields starting from the query type that is used to resolve the link',
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            },
            batchMode: {
                description: 'If true, the field returns a list of objects instead of one object',
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
            },
            argument: {
                description: 'The argument name, optionally followed by a dot-separated path of input field names, that is to be set to the id (or list of ids in case of batchMode)',
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            },
            keyField: {
                description: 'The name of a field in the target type that contains the id. Only needed if batchMode is true and the field may return the objects out of order',
                type: graphql_1.GraphQLString
            },
            linkFieldName: {
                description: 'If specified, a new field with this name will be added with the target type. If not specified, the annotated field will be replaced with the link field.',
                type: graphql_1.GraphQLString
            },
            ignore: {
                description: 'Indicates that the link has already been processed.',
                type: graphql_1.GraphQLBoolean
            }
        }
    });
    var joinType = new graphql_1.GraphQLObjectType({
        name: exports.EXTENDED_INTROSPECTION_TYPE_NAMES.fieldJoin,
        description: 'Configuration on how to join filters, ordering and limiting of a linked child field into this field',
        fields: {
            linkField: {
                description: 'The name of the child field that has a link configured',
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
            },
            ignore: {
                description: 'Indicates that the join has already been processed.',
                type: graphql_1.GraphQLBoolean
            }
        }
    });
    var fieldMetadataType = new graphql_1.GraphQLObjectType({
        name: exports.EXTENDED_INTROSPECTION_TYPE_NAMES.fieldMetadata,
        description: 'Metadata on a GraphQL field',
        fields: {
            link: {
                description: 'Specifies if this field should be resolved as a link to a different field',
                type: linkType
            },
            join: {
                description: 'Specifies if and how filters, ordering and limiting of a linked child field should be joined into this field',
                type: joinType
            }
        }
    });
    var fieldType = new graphql_1.GraphQLObjectType({
        name: exports.EXTENDED_INTROSPECTION_TYPE_NAMES.field,
        description: 'Extension of the field introspection type',
        fields: {
            name: {
                description: 'The field name',
                type: graphql_1.GraphQLString
            },
            metadata: {
                description: 'Additional metadata on this field',
                type: fieldMetadataType
            },
        }
    });
    var typeType = new graphql_1.GraphQLObjectType({
        name: exports.EXTENDED_INTROSPECTION_TYPE_NAMES.type,
        description: 'Extension of the type introspection type',
        fields: {
            name: {
                description: 'The type name',
                type: graphql_1.GraphQLString
            },
            fields: {
                description: 'A list of all fields of this type that have extended information',
                type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(fieldType)))
            }
        }
    });
    return new graphql_1.GraphQLObjectType({
        name: exports.EXTENDED_INTROSPECTION_TYPE_NAMES.introspection,
        description: 'Offers non-standard type information',
        fields: {
            types: {
                description: 'A list of all types that have extended information',
                type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(typeType)))
            }
        }
    });
}
//# sourceMappingURL=extended-introspection.js.map