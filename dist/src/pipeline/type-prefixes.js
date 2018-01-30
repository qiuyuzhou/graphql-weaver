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
var language_utils_1 = require("../graphql/language-utils");
var type_renamer_1 = require("../graphql/type-renamer");
/**
 * Adds endpoint-specific prefixes to all type names to avoid name collisions
 */
var TypePrefixesModule = /** @class */ (function () {
    function TypePrefixesModule(prefix) {
        this.prefix = prefix;
    }
    TypePrefixesModule.prototype.getSchemaTransformer = function () {
        var _this = this;
        return new type_renamer_1.TypeRenamingTransformer(function (name) { return _this.prefix + name; });
    };
    TypePrefixesModule.prototype.transformQuery = function (query) {
        var _this = this;
        return __assign({}, query, { document: language_utils_1.renameTypes(query.document, function (name) { return _this.removeTypePrefix(name); }) });
    };
    TypePrefixesModule.prototype.removeTypePrefix = function (name) {
        if (!name.startsWith(this.prefix)) {
            return name;
        }
        return name.substr(this.prefix.length);
    };
    return TypePrefixesModule;
}());
exports.TypePrefixesModule = TypePrefixesModule;
//# sourceMappingURL=type-prefixes.js.map