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
var graphql_transformer_1 = require("graphql-transformer");
/**
 * Creates a new schema that equals the given one but with all names of non-native types transformed by a custom callback
 */
function renameTypes(schema, typeNameTransformer) {
    return graphql_transformer_1.transformSchema(schema, new TypeRenamingTransformer(typeNameTransformer));
}
exports.renameTypes = renameTypes;
/**
 * A schema transform that renames all no-native types according to a simple provided function
 */
var TypeRenamingTransformer = /** @class */ (function () {
    function TypeRenamingTransformer(typeNameTransformer) {
        this.typeNameTransformer = typeNameTransformer;
        this.transformEnumType = this.rename;
        this.transformInterfaceType = this.rename;
        this.transformObjectType = this.rename;
        this.transformScalarType = this.rename;
        this.transformUnionType = this.rename;
        this.transformInputObjectType = this.rename;
        this.transformDirective = this.rename;
    }
    TypeRenamingTransformer.prototype.rename = function (config) {
        // ugly assertions needed until typescript 2.5, waiting for https://github.com/Microsoft/TypeScript/issues/10727
        return __assign({}, config, { name: this.typeNameTransformer(config.name) });
    };
    return TypeRenamingTransformer;
}());
exports.TypeRenamingTransformer = TypeRenamingTransformer;
//# sourceMappingURL=type-renamer.js.map