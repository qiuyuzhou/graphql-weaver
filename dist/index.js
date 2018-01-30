"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Main function
var weave_schemas_1 = require("./src/weave-schemas");
exports.weaveSchemas = weave_schemas_1.weaveSchemas;
exports.weaveSchemasExt = weave_schemas_1.weaveSchemasExt;
exports.createProxySchema = weave_schemas_1.weaveSchemas;
var error_handling_1 = require("./src/config/error-handling");
exports.WeavingErrorHandlingMode = error_handling_1.WeavingErrorHandlingMode;
var errors_1 = require("./src/config/errors");
exports.WeavingError = errors_1.WeavingError;
var http_client_1 = require("./src/graphql-client/http-client");
exports.HttpGraphQLClient = http_client_1.HttpGraphQLClient;
var local_client_1 = require("./src/graphql-client/local-client");
exports.LocalGraphQLClient = local_client_1.LocalGraphQLClient;
// Extended schema
var extended_schema_1 = require("./src/extended-schema/extended-schema");
exports.ExtendedSchema = extended_schema_1.ExtendedSchema;
exports.SchemaMetadata = extended_schema_1.SchemaMetadata;
var extended_introspection_1 = require("./src/extended-schema/extended-introspection");
exports.EXTENDED_INTROSPECTION_FIELD = extended_introspection_1.EXTENDED_INTROSPECTION_FIELD;
exports.getExtendedIntrospectionType = extended_introspection_1.getExtendedIntrospectionType;
exports.getExtendedIntrospectionData = extended_introspection_1.getExtendedIntrospectionData;
// Utilities to write modules
var extended_schema_transformer_1 = require("./src/extended-schema/extended-schema-transformer");
exports.transformExtendedSchema = extended_schema_transformer_1.transformExtendedSchema;
var graphql_transformer_1 = require("graphql-transformer");
exports.transformSchema = graphql_transformer_1.transformSchema;
// some useful modules
var namespaces_1 = require("./src/pipeline/namespaces");
exports.NamespaceModule = namespaces_1.NamespaceModule;
var type_prefixes_1 = require("./src/pipeline/type-prefixes");
exports.TypePrefixesModule = type_prefixes_1.TypePrefixesModule;
var links_1 = require("./src/pipeline/links");
exports.LinksModule = links_1.LinksModule;
//# sourceMappingURL=index.js.map