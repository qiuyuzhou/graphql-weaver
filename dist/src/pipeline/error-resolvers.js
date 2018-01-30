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
var errors_in_result_1 = require("../graphql/errors-in-result");
var graphql_1 = require("graphql");
var utils_1 = require("../utils/utils");
/**
 * Throws GraphQL errors if FieldErrorValues are encountered.
 *
 * This complements moveErrorsIntoData().
 */
var ErrorResolversModule = /** @class */ (function () {
    function ErrorResolversModule() {
    }
    ErrorResolversModule.prototype.getSchemaTransformer = function () {
        return new ErrorResolversTransformer();
    };
    return ErrorResolversModule;
}());
exports.ErrorResolversModule = ErrorResolversModule;
var ErrorResolversTransformer = /** @class */ (function () {
    function ErrorResolversTransformer() {
    }
    ErrorResolversTransformer.prototype.transformField = function (config) {
        var oldResolve = config.resolve || graphql_1.defaultFieldResolver;
        return __assign({}, config, { resolve: function (source, args, context, info) {
                var value = oldResolve(source, args, context, info);
                // For performance reasons, don't use async/await here. This resolver is called for each individual
                // field of each object instance. Most calls are just synchronous field value lookups. Using the state
                // machine for ever for every call would be very expensive (slows down large queries by factor of ~10).
                if (utils_1.isPromise(value)) {
                    return value.then(function (val) {
                        if (val instanceof errors_in_result_1.FieldErrorValue) {
                            throw val.getError();
                        }
                        return val;
                    });
                }
                if (value instanceof errors_in_result_1.FieldErrorValue) {
                    throw value.getError();
                }
                return value;
            } });
    };
    return ErrorResolversTransformer;
}());
exports.ErrorResolversTransformer = ErrorResolversTransformer;
//# sourceMappingURL=error-resolvers.js.map