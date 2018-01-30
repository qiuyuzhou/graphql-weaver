import { SchemaProvider } from "./schema-provider";
export interface GraphQLServerConfig {
    readonly port: number;
    readonly schemaProvider: SchemaProvider;
}
export declare class GraphQLServer {
    private readonly config;
    private server;
    constructor(config: GraphQLServerConfig);
    stop(): void;
    private getGraphQLOptions();
}
