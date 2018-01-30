"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
/**
 * Finds a field by traversing a schema from field to field
 * @param type the type where to start
 * @param fieldNames an array of field names to traverse
 * @return the field, or undefined if not found
 */
function walkFields(type, fieldNames) {
    var field;
    var currentType = type;
    for (var _i = 0, fieldNames_1 = fieldNames; _i < fieldNames_1.length; _i++) {
        var fieldName = fieldNames_1[_i];
        if (!(currentType instanceof graphql_1.GraphQLObjectType) && !(currentType instanceof graphql_1.GraphQLInterfaceType)) {
            return undefined;
        }
        var fields = currentType.getFields();
        if (!(fieldName in fields)) {
            return undefined;
        }
        field = fields[fieldName];
        currentType = field.type;
    }
    return field;
}
exports.walkFields = walkFields;
/**
 * Determines if the type is a List type (or a NonNull wrapper of a list type)
 */
function isListType(type) {
    return graphql_1.getNullableType(type) instanceof graphql_1.GraphQLList;
}
exports.isListType = isListType;
function getNonNullType(type) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return type;
    }
    return new graphql_1.GraphQLNonNull(type);
}
exports.getNonNullType = getNonNullType;
/**
 * Determines whether the given type is one of the operation root types (query, mutation, subscription) of a schema
 */
function isRootType(type, schema) {
    return type == schema.getQueryType() ||
        type == schema.getMutationType() ||
        type == schema.getSubscriptionType();
}
exports.isRootType = isRootType;
//# sourceMappingURL=schema-utils.js.map