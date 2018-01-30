import { GraphQLSchema } from 'graphql';
export declare class GraphQLHTTPTestEndpoint {
    private graphqlServer;
    start(port: number, schema?: GraphQLSchema): void;
    stop(): void;
}
