import { GraphQLSchema } from 'graphql';
import { GraphQLClient } from '../graphql-client/graphql-client';
import { SchemaMetadata } from './extended-schema';
/**
 * Fetches SchemaMetadata over a GraphQL endpoint
 * @param {GraphQLClient} endpoint the endpoint to submit queries
 * @param {GraphQLSchema} schema the client schema
 * @returns {Promise<any>} the metadata
 */
export declare function fetchSchemaMetadata(endpoint: GraphQLClient, schema: GraphQLSchema): Promise<SchemaMetadata>;
export declare function supportsExtendedIntrospection(schema: GraphQLSchema): boolean;
