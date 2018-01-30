import { GraphQLClient } from './graphql-client';
import { DocumentNode, ExecutionResult, GraphQLSchema } from 'graphql';
export declare class LocalGraphQLClient implements GraphQLClient {
    readonly schema: GraphQLSchema | Promise<GraphQLSchema>;
    constructor(schema: GraphQLSchema | Promise<GraphQLSchema>);
    execute(query: DocumentNode, variables?: {
        [name: string]: any;
    }, context?: any): Promise<ExecutionResult>;
}
