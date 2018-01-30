"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extended_schema_transformer_1 = require("../extended-schema/extended-schema-transformer");
function runQueryPipelineModule(module, query) {
    if (module.transformQuery) {
        query = module.transformQuery(query);
    }
    return query;
}
exports.runQueryPipelineModule = runQueryPipelineModule;
function runQueryPipeline(modules, query) {
    return modules.reduce(function (query, module) { return runQueryPipelineModule(module, query); }, query);
}
exports.runQueryPipeline = runQueryPipeline;
function runSchemaPipelineModule(module, schema) {
    if (module.transformExtendedSchema) {
        schema = module.transformExtendedSchema(schema);
    }
    if (module.transformSchema) {
        schema = schema.withSchema(module.transformSchema(schema.schema));
    }
    if (module.getSchemaTransformer) {
        var transformer = module.getSchemaTransformer();
        if (transformer) {
            schema = extended_schema_transformer_1.transformExtendedSchema(schema, transformer);
        }
    }
    return schema;
}
exports.runSchemaPipelineModule = runSchemaPipelineModule;
function runSchemaPipeline(modules, schema) {
    // TODO be more efficient by combining schema transformers if possible
    return modules.reduce(function (schema, module) { return runSchemaPipelineModule(module, schema); }, schema);
}
exports.runSchemaPipeline = runSchemaPipeline;
//# sourceMappingURL=pipeline-module.js.map