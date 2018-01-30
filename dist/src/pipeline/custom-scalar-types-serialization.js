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
 * Overwrite the default behaviour from generateClientSchema which sets values of custom scalar types to false.
 * As types don't have to be serialized, just pass them through.
 */
var CustomScalarTypesSerializationModule = /** @class */ (function () {
    function CustomScalarTypesSerializationModule() {
    }
    CustomScalarTypesSerializationModule.prototype.getSchemaTransformer = function () {
        return new CustomScalarTypesSerializationTransformer();
    };
    return CustomScalarTypesSerializationModule;
}());
exports.CustomScalarTypesSerializationModule = CustomScalarTypesSerializationModule;
var CustomScalarTypesSerializationTransformer = /** @class */ (function () {
    function CustomScalarTypesSerializationTransformer() {
    }
    CustomScalarTypesSerializationTransformer.prototype.transformScalarType = function (type) {
        return __assign({}, type, { parseValue: parseValue, parseLiteral: parseLiteral });
    };
    return CustomScalarTypesSerializationTransformer;
}());
exports.CustomScalarTypesSerializationTransformer = CustomScalarTypesSerializationTransformer;
function parseValue(value) {
    if (value == undefined || value == null) {
        return false;
    }
    return value;
}
function parseLiteral(value) {
    if (value == undefined || value == null) {
        return false;
    }
    return value;
}
//# sourceMappingURL=custom-scalar-types-serialization.js.map