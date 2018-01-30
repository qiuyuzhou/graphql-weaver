import { ExtendedSchema, FieldMetadata } from './extended-schema';
import { FieldsTransformationContext, FieldTransformationContext, GraphQLNamedFieldConfig, SchemaTransformationContext, SchemaTransformer } from 'graphql-transformer';
import { GraphQLFieldConfig } from 'graphql';
export declare type TransformationFunction<TConfig, TContext extends SchemaTransformationContext> = (config: TConfig, context: TContext) => TConfig;
export interface GraphQLNamedFieldConfigWithMetadata<TSource = any, TContext = any> extends GraphQLNamedFieldConfig<TSource, TContext> {
    metadata?: FieldMetadata;
}
export interface GraphQLFieldConfigWithMetadata<TSource = any, TContext = any> extends GraphQLFieldConfig<TSource, TContext> {
    metadata?: FieldMetadata;
}
export declare type GraphQLFieldConfigMapWithMetadata<TSource = any, TContext = any> = {
    [name: string]: GraphQLFieldConfigWithMetadata<TSource, TContext>;
};
export interface ExtendedSchemaTransformer extends SchemaTransformer {
    transformField?: TransformationFunction<GraphQLNamedFieldConfigWithMetadata<any, any>, FieldTransformationContext>;
    transformFields?: TransformationFunction<GraphQLFieldConfigMapWithMetadata<any, any>, FieldsTransformationContext>;
}
/**
 * Transforms an ExtendedSchema via transformation functions for the schema elements
 *
 * This makes it seem as if fieldMetadata was a property of GraphQLField / GraphQLFieldConfig - it can be modified in
 * transformField() and transformFields(). Fields can even be added or removed in transformFields(). As long as the
 * metadata property is carried around properly, everything should work as expected.
 *
 * @param schema
 * @param transformer
 * @returns {any}
 */
export declare function transformExtendedSchema(schema: ExtendedSchema, transformer: ExtendedSchemaTransformer): ExtendedSchema;
