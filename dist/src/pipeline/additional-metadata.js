"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var merge_extended_schemas_1 = require("../extended-schema/merge-extended-schemas");
var utils_1 = require("../utils/utils");
/**
 * Adds metadata specified within the endpoint configs to the extended schemas
 */
var AdditionalMetadataModule = /** @class */ (function () {
    function AdditionalMetadataModule(endpointConfig) {
        this.endpointConfig = endpointConfig;
    }
    AdditionalMetadataModule.prototype.transformExtendedSchema = function (schema) {
        var meta = this.endpointConfig.fieldMetadata;
        if (!this.endpointConfig.fieldMetadata) {
            return schema;
        }
        return schema.withFieldMetadata(merge_extended_schemas_1.mergeFieldMetadata(schema.fieldMetadata, utils_1.objectToMap(this.endpointConfig.fieldMetadata)));
    };
    return AdditionalMetadataModule;
}());
exports.AdditionalMetadataModule = AdditionalMetadataModule;
//# sourceMappingURL=additional-metadata.js.map