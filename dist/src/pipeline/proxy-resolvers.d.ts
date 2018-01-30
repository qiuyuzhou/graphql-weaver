import { PipelineModule } from './pipeline-module';
import { FieldTransformationContext, GraphQLNamedFieldConfig, SchemaTransformer } from 'graphql-transformer';
import { GraphQLClient } from '../graphql-client/graphql-client';
import { Query } from '../graphql/common';
import { EndpointConfig } from '../config/weaving-config';
export interface Config {
    readonly client: GraphQLClient;
    processQuery(query: Query): Query;
    readonly endpointConfig: EndpointConfig;
}
/**
 * Adds resolvers to the top-level fields of all root types that proxy the request to a specified endpoint
 */
export declare class ProxyResolversModule implements PipelineModule {
    private readonly config;
    constructor(config: Config);
    getSchemaTransformer(): ResolverTransformer;
}
export declare class ResolverTransformer implements SchemaTransformer {
    private readonly config;
    constructor(config: Config);
    transformField(config: GraphQLNamedFieldConfig<any, any>, context: FieldTransformationContext): GraphQLNamedFieldConfig<any, any>;
}
