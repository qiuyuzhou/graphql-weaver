import { ResponsePath } from "graphql";
/**
 * Walks a response path as given in GraphQLResolveInfo.path and collects the aliases from root to leaf
 *
 * List types are not supported
 * @param path
 * @returns {string[]}
 */
export declare function collectAliasesInResponsePath(path: ResponsePath): string[];
