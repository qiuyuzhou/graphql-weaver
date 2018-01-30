"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var utils_1 = require("../utils/utils");
var schema_utils_1 = require("./schema-utils");
/**
 * Merges multiple GraphQL schemas by merging the fields of root types (query, mutation, subscription)
 *
 * If the given array of schemas is empty, a dummy query field is created to satisfy the GraphQL invariant
 * @param schemas
 */
function mergeSchemas(schemas) {
    if (!schemas.length) {
        return createEmptySchema();
    }
    var nonRootTypes = utils_1.flatMap(schemas, function (schema) { return utils_1.objectValues(schema.getTypeMap()).filter(function (type) { return !schema_utils_1.isRootType(type, schema); }); });
    return new graphql_1.GraphQLSchema({
        query: mergeFields(schemas.map(function (schema) { return schema.getQueryType(); }), 'Query'),
        mutation: maybeMergeFields(utils_1.mapAndCompact(schemas, function (schema) { return schema.getMutationType(); }), 'Mutation'),
        subscription: maybeMergeFields(utils_1.mapAndCompact(schemas, function (schema) { return schema.getSubscriptionType(); }), 'Subscription'),
        directives: (_a = []).concat.apply(_a, schemas.map(function (schema) { return schema.getDirectives(); })),
        // add types from type map, to avoid losing implementations of interfaces that are not referenced elsewhere
        // do not include root types of schemas because they are discared in favor of the new merged root types
        // no need to include the newly generated types, they are implicitly added
        types: nonRootTypes
    });
    var _a;
}
exports.mergeSchemas = mergeSchemas;
function createEmptySchema() {
    return new graphql_1.GraphQLSchema({
        query: new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: {
                '_empty': {
                    type: graphql_1.GraphQLBoolean,
                    description: 'This field only exists because the schema is empty.',
                    resolve: function () { return true; }
                }
            }
        })
    });
}
function mergeFields(types, name) {
    return new graphql_1.GraphQLObjectType({
        name: name,
        description: "The merged " + name + " root type",
        fields: Object.assign.apply(Object, [{}].concat(types.map(function (type) { return utils_1.mapValues(type.getFields(), fieldToFieldConfig); })))
    });
}
/**
 * See as #mergeFields but returns undefined if types is empty or null or undefined.
 */
function maybeMergeFields(types, name) {
    if (types == undefined || types.length == 0) {
        return undefined;
    }
    return mergeFields(types, name);
}
function fieldToFieldConfig(field) {
    return {
        description: field.description,
        type: field.type,
        resolve: field.resolve,
        deprecationReason: field.deprecationReason,
        args: utils_1.arrayToObject(field.args, function (arg) { return arg.name; })
    };
}
//# sourceMappingURL=merge-schemas.js.map