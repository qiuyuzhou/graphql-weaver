import { ArgumentNode, ASTNode, FieldNode, FragmentDefinitionNode, GraphQLList, GraphQLNamedType, GraphQLNonNull, GraphQLType, ListTypeNode, NamedTypeNode, NonNullTypeNode, SelectionNode, SelectionSetNode, TypeNode, VariableDefinitionNode } from "graphql";
/**
 * Creates a field node with a name and an optional alias
 * @param name the name
 * @param alias the alias, or undefined to not specify an alias
 * @param selections an array of selection nodes, or undefined to not specify a SelectionSet node
 * @returns the field node
 */
export declare function createFieldNode(name: string, alias?: string, selections?: SelectionNode[]): FieldNode;
/**
 * Builds a SelectionSetNode for a chain of nested field selections
 *
 * The input (['a', 'b'], selSet) yields the selection set "{ a { b { selSet } } }"
 * @param fieldNames
 * @param innermostSelectionSet
 * @returns {SelectionSetNode}
 */
export declare function createSelectionChain(fieldNames: string[], innermostSelectionSet: SelectionSetNode): SelectionSetNode;
/**
 * Wraps a selection set in a linear chain of selections according to an array of field nodes
 *
 * The input ("node1", "alias: node2", "node3(arg: true)"], selSet) yields the selection set
 * "{ node1 { alias: node2 { node3(arg:true) { selSet } } } }"
 *
 * @param fieldNodes
 * @param innermostSelectionSet
 * @returns {SelectionSetNode}
 */
export declare function cloneSelectionChain(fieldNodes: FieldNode[], innermostSelectionSet?: SelectionSetNode): SelectionSetNode;
/**
 * Creates a GraphQL syntax node for a type reference, given the type instance of the schema
 */
export declare function createTypeNode(type: GraphQLNamedType): NamedTypeNode;
export declare function createTypeNode(type: GraphQLNonNull<any>): NonNullTypeNode;
export declare function createTypeNode(type: GraphQLList<any>): ListTypeNode;
export declare function createTypeNode(type: GraphQLType): TypeNode;
/**
 * Creates a GraphQL syntax node that defines a variable of a given name and type
 */
export declare function createVariableDefinitionNode(varName: string, type: GraphQLType): VariableDefinitionNode;
/**
 * Creates a GraphQL syntax node for an actual argument with a variable as value
 *
 * argumentPath is split into dot-separated parts. The first part is the argument name, and if there are more parts,
 * they describe a sequence of input field names. For example, "arg.field1.field2" will generate a node like this:
 *
 *     arg: { field1: { field2: $variableName } }
 *
 * @param argumentPath a dot-separated segment string
 * @param variableName
 */
export declare function createNestedArgumentWithVariableNode(argumentPath: string, variableName: string): ArgumentNode;
/**
 * Adds a field to a selection set. If it already exists, does nothing and returns the name or alias of that field.
 * If there is a selection of a different field, chooses a different alias for the field and returns that alias.
 * @param selectionSet
 * @param field the name of the field to fetch
 * @param fragments an array of fragment definitions for lookup of fragment spreads (needed for uniqueness check)
 * @return an object,
 *     selectionSet: the modified selection set
 *     alias: the name of the field in the object that will be returned (alias if aliased, otherwise field name)
 */
export declare function addFieldSelectionSafely(selectionSet: SelectionSetNode, field: string, fragments?: {
    [fragmentName: string]: FragmentDefinitionNode;
}): {
    alias: string;
    selectionSet: SelectionSetNode;
};
/**
 * Determines whether an unaliased field with the given name or an aliased field with the given name as alias exists.
 * Inline fragments and fragment spread operators are crawled recursively. The type of fragments is not considered.
 *
 * @param selectionSet the selection set
 * @param alias the name of the field or alias to check
 * @param fragments an array of fragment definitions for lookup of fragment spreads
 */
export declare function aliasExistsInSelection(selectionSet: SelectionSetNode, alias: string, fragments?: {
    [fragmentName: string]: FragmentDefinitionNode;
}): boolean;
/**
 * Finds all the field nodes that are selected by a given selection set, by spreading all referenced fragments
 *
 * @param selections the selection set
 * @param fragments an array of fragment definitions for lookup of fragment spreads
 * @return the field nodes
 */
export declare function expandSelections(selections: SelectionNode[], fragments?: {
    [fragmentName: string]: FragmentDefinitionNode;
}): FieldNode[];
export declare function findNodesByAliasInSelections(selections: SelectionNode[], alias: string, fragments?: {
    [fragmentName: string]: FragmentDefinitionNode;
}): FieldNode[];
export declare function addVariableDefinitionSafely(variableDefinitions: VariableDefinitionNode[], name: string, type: GraphQLType): {
    name: string;
    variableDefinitions: VariableDefinitionNode[];
};
/**
 * Renames all named types starting at a node
 * @param root the node where to start
 * @param typeNameTransformer a function that gets the old name and returns the new name
 * @returns {any}
 */
export declare function renameTypes<T extends ASTNode>(root: T, typeNameTransformer: (name: string) => string): T;
export declare function collectFieldNodesInPath(selectionSet: SelectionSetNode, aliases: string[], fragments?: {
    [fragmentName: string]: FragmentDefinitionNode;
}): FieldNode[];
/**
 * Gets the alias of a field node, or the field name if it does not have an alias
 * @param fieldNode
 * @returns {string}
 */
export declare function getAliasOrName(fieldNode: FieldNode): string;
