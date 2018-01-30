import { GraphQLError, ResponsePath } from 'graphql';
export declare function prefixGraphQLErrorPath(error: GraphQLError, pathPrefix: ResponsePath, removePrefixLength: number): GraphQLError;
