import { PipelineModule } from './pipeline-module';
import { GraphQLSchema } from 'graphql';
import { Query } from '../graphql/common';
/**
 * Wraps the root types into a field of a new type
 *
 * This is in preparation of schema merges
 */
export declare class NamespaceModule implements PipelineModule {
    private readonly namespace;
    private schema;
    constructor(namespace: string);
    transformSchema(schema: GraphQLSchema): GraphQLSchema;
    transformQuery(query: Query): Query;
    private wrap(type, operation);
}
