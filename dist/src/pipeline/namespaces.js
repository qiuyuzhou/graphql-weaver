"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var utils_1 = require("../utils/utils");
/**
 * Wraps the root types into a field of a new type
 *
 * This is in preparation of schema merges
 */
var NamespaceModule = /** @class */ (function () {
    function NamespaceModule(namespace) {
        this.namespace = namespace;
    }
    NamespaceModule.prototype.transformSchema = function (schema) {
        var _this = this;
        var newSchema = new graphql_1.GraphQLSchema({
            directives: schema.getDirectives(),
            query: this.wrap(schema.getQueryType(), 'Query'),
            mutation: utils_1.maybeDo(schema.getMutationType(), function (type) { return _this.wrap(type, 'Mutation'); }),
            subscription: utils_1.maybeDo(schema.getSubscriptionType(), function (type) { return _this.wrap(type, 'Subscription'); })
        });
        this.schema = newSchema;
        return newSchema;
    };
    NamespaceModule.prototype.transformQuery = function (query) {
        var _this = this;
        if (!this.schema) {
            throw new Error("Schema not yet built");
        }
        // unwrap namespaced queries
        var document = graphql_1.visit(query.document, {
            FragmentDefinition: function (fragment) {
                // only unwrap fragments on root type
                if (!isRootTypeName(fragment.typeCondition.name.value, _this.schema)) {
                    return false;
                }
                return undefined; // not changed, visit into
            },
            Field: function () { return false; },
            SelectionSet: function (selectionSet) {
                if (!selectionSet.selections.length) {
                    return false; // empty, skip
                }
                var node = selectionSet.selections[0];
                if (selectionSet.selections.length > 1 || node.kind != 'Field' || !node.selectionSet) {
                    // we make this assertion because proxy-resolver always wraps the selection into the field
                    throw new Error('Unexpected top-level selection set, should be one field with selections');
                }
                return node.selectionSet;
            }
        });
        return __assign({}, query, { document: document });
    };
    NamespaceModule.prototype.wrap = function (type, operation) {
        return new graphql_1.GraphQLObjectType({
            name: "Wrapped" + type.name,
            description: 'Namespace root',
            fields: (_a = {},
                _a[this.namespace] = {
                    type: type,
                    description: operation + " of " + this.namespace,
                    resolve: function (obj) { return ({}); }
                },
                _a)
        });
        var _a;
    };
    return NamespaceModule;
}());
exports.NamespaceModule = NamespaceModule;
/**
 * Determines whether the given type is one of the operation root types (query, mutation, subscription) of a schema
 */
function isRootTypeName(type, schema) {
    var mut = schema.getMutationType();
    var sub = schema.getSubscriptionType();
    return type == schema.getQueryType().name ||
        (mut && type == mut.name) ||
        (sub && type == sub.name);
}
//# sourceMappingURL=namespaces.js.map