import { GraphQLSchema } from 'graphql';
/**
 * Merges multiple GraphQL schemas by merging the fields of root types (query, mutation, subscription)
 *
 * If the given array of schemas is empty, a dummy query field is created to satisfy the GraphQL invariant
 * @param schemas
 */
export declare function mergeSchemas(schemas: GraphQLSchema[]): GraphQLSchema;
