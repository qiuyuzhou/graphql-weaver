import { GraphQLField, GraphQLInputType, GraphQLNamedType, GraphQLOutputType, GraphQLScalarType, GraphQLSchema } from 'graphql';
import { LinkConfig } from '../../extended-schema/extended-schema';
import { SlimGraphQLResolveInfo } from '../../graphql/field-as-query';
import { WeavingErrorConsumer } from '../../config/errors';
export declare const FILTER_ARG = "filter";
export declare const ORDER_BY_ARG = "orderBy";
export declare const FIRST_ARG = "first";
export declare function parseLinkTargetPath(path: string, schema: GraphQLSchema): {
    field: GraphQLField<any, any>;
    fieldPath: string[];
} | undefined;
/**
 * Fetches a list of objects by their keys
 *
 * @param params.keys an array of key values
 * @param params.info the resolve info that specifies the structure of the query
 * @return an array of objects, with 1:1 mapping to the keys
 */
export declare function fetchLinkedObjects(params: {
    keys: any[];
    keyType: GraphQLScalarType;
    linkConfig: LinkConfig;
    unlinkedSchema: GraphQLSchema;
    context: any;
    info: SlimGraphQLResolveInfo;
}): Promise<any[]>;
export declare function fetchJoinedObjects(params: {
    keys: any[];
    additionalFilter: any;
    orderBy?: string;
    first?: number;
    filterType: GraphQLInputType;
    keyType: GraphQLScalarType;
    linkConfig: LinkConfig;
    unlinkedSchema: GraphQLSchema;
    context: any;
    info: SlimGraphQLResolveInfo;
}): Promise<{
    orderedObjects: {
        [key: string]: any;
    }[];
    objectsByID: Map<string, {
        [key: string]: any;
    }>;
    keyFieldAlias: string;
}>;
export declare function getLinkArgumentType(linkConfig: LinkConfig, targetField: GraphQLField<any, any>): GraphQLInputType;
export declare function getKeyType(config: {
    linkConfig: LinkConfig;
    linkFieldType: GraphQLOutputType;
    linkFieldName: string;
    parentObjectType: GraphQLNamedType;
    targetField: GraphQLField<any, any>;
    reportError: WeavingErrorConsumer;
}): GraphQLScalarType;
