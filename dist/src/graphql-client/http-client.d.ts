import { DocumentNode, ExecutionResult } from 'graphql';
import fetch, { Request, Response } from 'node-fetch';
import { GraphQLClient } from './graphql-client';
export declare class HttpGraphQLClient implements GraphQLClient {
    readonly url: string;
    constructor(config: {
        url: string;
    });
    execute(document: DocumentNode, variables?: {
        [name: string]: any;
    }, context?: any, introspect?: boolean): Promise<any>;
    protected fetchResponse(document: DocumentNode, variables?: {
        [name: string]: any;
    }, context?: any, introspect?: boolean): Promise<Response>;
    protected fetch: typeof fetch;
    protected getRequest(document: DocumentNode, variables?: {
        [name: string]: any;
    }, context?: any, introspect?: boolean): Promise<Request>;
    protected getHeaders(document: DocumentNode, variables?: {
        [name: string]: any;
    }, context?: any, introspect?: boolean): Promise<{
        [index: string]: string;
    }>;
    protected getBody(document: DocumentNode, variables?: {
        [name: string]: any;
    }, context?: any, introspect?: boolean): Promise<any>;
    protected processResponse(response: ExecutionResult, document: DocumentNode, variables?: {
        [name: string]: any;
    }, context?: any, introspect?: boolean): Promise<ExecutionResult>;
    private mapLocationsToOriginal(location, sourceDocument, targetDocument);
}
