import { EndpointConfig } from '../config/weaving-config';
import { GraphQLClient } from './graphql-client';
import { HttpGraphQLClient } from './http-client';
/**
 * A factory that creates active GraphQLEndpoints from passive config objects
 */
export interface ClientFactory {
    getEndpoint(config: EndpointConfig): GraphQLClient;
}
export declare class DefaultClientFactory implements ClientFactory {
    getEndpoint(config: EndpointConfig): GraphQLClient | HttpGraphQLClient;
}
