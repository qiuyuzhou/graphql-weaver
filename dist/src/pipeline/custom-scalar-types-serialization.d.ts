import { PipelineModule } from './pipeline-module';
import { GraphQLScalarType } from 'graphql';
import { SchemaTransformer } from 'graphql-transformer';
/**
 * Overwrite the default behaviour from generateClientSchema which sets values of custom scalar types to false.
 * As types don't have to be serialized, just pass them through.
 */
export declare class CustomScalarTypesSerializationModule implements PipelineModule {
    getSchemaTransformer(): CustomScalarTypesSerializationTransformer;
}
export declare class CustomScalarTypesSerializationTransformer implements SchemaTransformer {
    transformScalarType(type: GraphQLScalarType): GraphQLScalarType;
}
