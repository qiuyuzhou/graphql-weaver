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
var extended_introspection_1 = require("../extended-schema/extended-introspection");
var graphql_transformer_1 = require("graphql-transformer");
/**
 * Adds the extended introspection field with the current extended schema information.
 *
 * If the extended introspection field already exists, it is overridden. Use this field at the very end of the pipeline
 * so that the correct schema is used.
 */
var ExtendedIntrospectionModule = /** @class */ (function () {
    function ExtendedIntrospectionModule() {
    }
    // Do we need a query transformer here? I think technically yes, but should not matter because this field would never be proxy-called
    ExtendedIntrospectionModule.prototype.transformExtendedSchema = function (schema) {
        return schema.withSchema(graphql_transformer_1.transformSchema(schema.schema, {
            transformFields: function (config, _a) {
                var oldOuterType = _a.oldOuterType;
                if (oldOuterType != schema.schema.getQueryType()) {
                    return config;
                }
                return __assign({}, config, (_b = {}, _b[extended_introspection_1.EXTENDED_INTROSPECTION_FIELD] = {
                    type: extended_introspection_1.getExtendedIntrospectionType(),
                    resolve: function () { return extended_introspection_1.getExtendedIntrospectionData(schema.metadata); }
                }, _b));
                var _b;
            }
        }));
    };
    return ExtendedIntrospectionModule;
}());
exports.ExtendedIntrospectionModule = ExtendedIntrospectionModule;
//# sourceMappingURL=extended-introspection.js.map