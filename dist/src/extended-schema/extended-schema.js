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
 * Holds metadata of a GraphQLSchema
 */
var SchemaMetadata = /** @class */ (function () {
    function SchemaMetadata(config) {
        if (config === void 0) { config = {}; }
        this.fieldMetadata = new Map();
        this.fieldMetadata = config.fieldMetadata || this.fieldMetadata;
    }
    SchemaMetadata.prototype.getFieldMetadata = function (type, field) {
        if (typeof type != 'string') {
            type = type.name;
        }
        if (typeof field != 'string') {
            field = field.name;
        }
        return this.fieldMetadata.get(SchemaMetadata.getFieldKey(type, field));
    };
    SchemaMetadata.getFieldKey = function (type, field) {
        return type + "." + field;
    };
    return SchemaMetadata;
}());
exports.SchemaMetadata = SchemaMetadata;
var ExtendedSchema = /** @class */ (function () {
    function ExtendedSchema(schema, metadata) {
        if (metadata === void 0) { metadata = new SchemaMetadata(); }
        this.schema = schema;
        this.metadata = metadata;
    }
    ExtendedSchema.prototype.getFieldMetadata = function (type, field) {
        return this.metadata.getFieldMetadata(type, field);
    };
    ExtendedSchema.prototype.withSchema = function (schema) {
        return new ExtendedSchema(schema, this.metadata);
    };
    ExtendedSchema.prototype.withMetadata = function (metadata) {
        return new ExtendedSchema(this.schema, metadata);
    };
    ExtendedSchema.prototype.withFieldMetadata = function (fieldMetadata) {
        return new ExtendedSchema(this.schema, new SchemaMetadata(__assign({}, this.metadata, { fieldMetadata: fieldMetadata })));
    };
    Object.defineProperty(ExtendedSchema.prototype, "fieldMetadata", {
        get: function () {
            return this.metadata.fieldMetadata;
        },
        enumerable: true,
        configurable: true
    });
    return ExtendedSchema;
}());
exports.ExtendedSchema = ExtendedSchema;
//# sourceMappingURL=extended-schema.js.map