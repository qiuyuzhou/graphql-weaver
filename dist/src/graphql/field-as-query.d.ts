import { ASTNode, DocumentNode, FieldNode, FragmentDefinitionNode, OperationDefinitionNode, OperationTypeNode, ResponsePath, SelectionSetNode, VariableDefinitionNode } from 'graphql';
import { Query } from './common';
export declare type QueryParts = {
    fragments: FragmentDefinitionNode[];
    selectionSet: SelectionSetNode;
    variableDefinitions: VariableDefinitionNode[];
    variableValues: {
        [name: string]: any;
    };
    operation: OperationTypeNode;
};
export interface SlimGraphQLResolveInfo {
    fieldNodes: FieldNode[];
    fragments: {
        [fragmentName: string]: FragmentDefinitionNode;
    };
    operation: OperationDefinitionNode;
    variableValues: {
        [variableName: string]: any;
    };
    path: ResponsePath;
}
/**
 * Prepares all the parts necessary to construct a GraphQL query document like produced by getFieldAsQuery
 */
export declare function getFieldAsQueryParts(info: SlimGraphQLResolveInfo): QueryParts;
/**
 * Constructs a GraphQL query document from a field as seen by a resolver
 *
 * This is the basic component of a proxy - a resolver calls this method and then sends the query to the upstream server
 */
export declare function getFieldAsQuery(info: SlimGraphQLResolveInfo): Query;
export declare function getQueryFromParts(parts: QueryParts): {
    document: DocumentNode;
    variableValues: {
        [name: string]: any;
    };
};
export declare function collectUsedFragments(roots: ASTNode[], fragmentMap: {
    [name: string]: FragmentDefinitionNode;
}): FragmentDefinitionNode[];
/**
 * Gets a new, semantically equal document where unused fragments are removed
 */
export declare function dropUnusedFragments(document: DocumentNode): DocumentNode;
/**
 * Gets a new, semantically equal query where unused variables are removed
 */
export declare function dropUnusedVariables(query: Query): Query;
