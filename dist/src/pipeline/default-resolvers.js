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
/**
 * Replaces default (undefined) resolves with resolvers that use the alias instead of field name for lookup
 *
 * This is required because proxied responses already have the target structure with aliased fields
 */
var DefaultResolversModule = /** @class */ (function () {
    function DefaultResolversModule() {
    }
    DefaultResolversModule.prototype.getSchemaTransformer = function () {
        return new DefaultResolversTransformer();
    };
    return DefaultResolversModule;
}());
exports.DefaultResolversModule = DefaultResolversModule;
/**
 * Adds default resolves that use node aliases instead of normal field names for object property lookup
 *
 * This is needed because the aliasing is already done on the target endpoint.
 */
var DefaultResolversTransformer = /** @class */ (function () {
    function DefaultResolversTransformer() {
    }
    DefaultResolversTransformer.prototype.transformField = function (config) {
        if (config.resolve) {
            return config;
        }
        return __assign({}, config, { resolve: function (source, args, context, info) {
                var fieldNode = info.fieldNodes[0];
                var alias = fieldNode.alias ? fieldNode.alias.value : fieldNode.name.value;
                return source[alias];
            } });
    };
    return DefaultResolversTransformer;
}());
exports.DefaultResolversTransformer = DefaultResolversTransformer;
//# sourceMappingURL=default-resolvers.js.map