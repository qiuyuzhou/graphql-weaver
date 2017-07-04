import {
    ArgumentNode, ASTNode, FieldNode, FragmentDefinitionNode, GraphQLList, GraphQLNamedType, GraphQLNonNull,
    GraphQLType, ListTypeNode, NamedTypeNode, NonNullTypeNode, SelectionNode, SelectionSetNode, TypeNode, ValueNode,
    VariableDefinitionNode, visit
} from 'graphql';

/**
 * Creates a field node with a name and an optional alias
 * @param name the name
 * @param alias the alias, or undefined to not specify an alias
 * @returns the field node
 */
export function createFieldNode(name: string, alias?: string): FieldNode {
    return {
        kind: 'Field',
        name: {
            kind: 'Name',
            value: name
        },
        ...(alias ? {
            alias: {
                kind: 'Name',
                value: alias
            }
        } : {})
    };
}

/**
 * Builds a SelectionSetNode for a chain of nested field selections
 *
 * The input (['a', 'b'], selSet) yields the selection set "{ a { b { selSet } } }"
 * @param fieldNames
 * @param innermostSelectionSet
 * @returns {SelectionSetNode}
 */
export function createSelectionChain(fieldNames: string[], innermostSelectionSet: SelectionSetNode): SelectionSetNode {
    let currentSelectionSet = innermostSelectionSet;
    for (const fieldName of fieldNames) {
        currentSelectionSet = {
            kind: 'SelectionSet',
            selections: [
                {
                    kind: 'Field',
                    name: {
                        kind: 'Name',
                        value: fieldName
                    },
                    selectionSet: currentSelectionSet
                }
            ]
        };
    }
    return currentSelectionSet;
}

/**
 * Creates a GraphQL syntax node for a type reference, given the type instance of the schema
 */
export function createTypeNode(type: GraphQLNamedType): NamedTypeNode;
export function createTypeNode(type: GraphQLNonNull<any>): NonNullTypeNode;
export function createTypeNode(type: GraphQLList<any>): ListTypeNode;
export function createTypeNode(type: GraphQLType): TypeNode;
export function createTypeNode(type: GraphQLType): TypeNode {
    if (type instanceof GraphQLList) {
        return {
            kind: 'ListType',
            type: createTypeNode(type.ofType)
        };
    }
    if (type instanceof GraphQLNonNull) {
        return {
            kind: 'NonNullType',
            type: <NamedTypeNode | ListTypeNode>createTypeNode(type.ofType)
        };
    }
    return {
        kind: 'NamedType',
        name: {
            kind: 'Name',
            value: type.name
        }
    };
}

/**
 * Creates a GraphQL syntax node that defines a variable of a given name and type
 */
export function createVariableDefinitionNode(varName: string, type: GraphQLType): VariableDefinitionNode {
    return {
        kind: 'VariableDefinition',
        variable: {
            kind: 'Variable',
            name: {
                kind: 'Name',
                value: varName
            }
        },
        type: createTypeNode(type)
    };
}

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
export function createNestedArgumentWithVariableNode(argumentPath: string, variableName: string): ArgumentNode {
    const parts = argumentPath.split('.');
    const argName = parts.shift();
    if (!argName) {
        throw new Error('Argument must not be empty');
    }

    let value: ValueNode = {
        kind: 'Variable',
        name: {
            kind: 'Name',
            value: variableName
        }
    };

    for (const part of parts.reverse()) {
        value = {
            kind: 'ObjectValue',
            fields: [
                {
                    kind: 'ObjectField',
                    value,
                    name: {
                        kind: 'Name',
                        value: part
                    }
                }
            ]
        };
    }

    return {
        kind: 'Argument',
        name: {
            kind: 'Name',
            value: argName
        },
        value
    };
}

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
export function addFieldSelectionSafely(selectionSet: SelectionSetNode, field: string, fragments: { [fragmentName: string]: FragmentDefinitionNode } = {}): { alias: string, selectionSet: SelectionSetNode } {
    // Do not consider fragments here because we do not know if the type of them always matches the actual type
    const existing = selectionSet.selections.filter(sel => sel.kind == 'Field' && sel.name.value == field);
    if (existing.length) {
        const sel = <FieldNode>existing[0];
        return {
            selectionSet,
            alias: sel.alias ? sel.alias.value : sel.name.value
        };
    }

    // Here, we consider all fragments to be on the safe side
    let alias = field;
    if (aliasExistsInSelection(selectionSet, alias, fragments)) {
        let number = 0;
        do {
            alias = (field + '') + number; // convert field to string, better safe than sorry
            number++;
        } while (aliasExistsInSelection(selectionSet, alias, fragments));
    }

    return {
        selectionSet: {
            ...selectionSet,
            selections: [
                ...selectionSet.selections,
                {
                    kind: 'Field',
                    name: {
                        kind: 'Name',
                        value: field
                    },

                    // simple conditional operator would set alias to undefined which is something different
                    ...(alias == field ? {} : {
                        alias: {
                            kind: 'Name',
                            value: alias
                        }
                    })
                }
            ]
        },
        alias
    };
}

/**
 * Determines whether an unaliased field with the given name or an aliased field with the given name as alias exists.
 * Inline fragments and fragment spread operators are crawled recursively. The type of fragments is not considered.
 *
 * @param selectionSet the selection set
 * @param alias the name of the field or alias to check
 * @param fragments an array of fragment definitions for lookup of fragment spreads
 */
export function aliasExistsInSelection(selectionSet: SelectionSetNode, alias: string, fragments: { [fragmentName: string]: FragmentDefinitionNode } = {}) {
    function findFragment(name: string): FragmentDefinitionNode {
        if (!(name in fragments)) {
            throw new Error(`Fragment ${name} is referenced but not defined`);
        }
        return fragments[name];
    }

    function aliasExistsInSelectionNode(node: SelectionNode): boolean {
        switch (node.kind) {
            case 'Field':
                if (node.alias) {
                    return node.alias.value == alias;
                }
                return node.name.value == alias;
            case 'FragmentSpread':
                const fragment = findFragment(node.name.value);
                return aliasExistsInSelection(fragment.selectionSet, alias, fragments);
            case 'InlineFragment':
                return aliasExistsInSelection(node.selectionSet, alias, fragments);
            default:
                throw new Error(`Unexpected node kind: ${(<any>node).kind}`);
        }
    }

    return selectionSet.selections.some(aliasExistsInSelectionNode);
}

export function addVariableDefinitionSafely(variableDefinitions: VariableDefinitionNode[], name: string, type: GraphQLType): { name: string, variableDefinitions: VariableDefinitionNode[] } {
    const names = new Set(variableDefinitions.map(def => def.variable.name.value));
    let varName = name;
    if (names.has(name)) {
        let number = 0;
        do {
            varName = name + number;
            number++;
        } while (names.has(name));
    }

    return {
        variableDefinitions: [
            ...variableDefinitions,
            createVariableDefinitionNode(varName, type)
        ],
        name: varName
    };
}

/**
 * Renames all named types starting at a node
 * @param root the node where to start
 * @param typeNameTransformer a function that gets the old name and returns the new name
 * @returns {any}
 */
export function renameTypes<T extends ASTNode>(root: T, typeNameTransformer: (name: string) => string): T {
    return visit(root, {
        NamedType(node: NamedTypeNode) {
            return {
                ...node,
                name: {
                    kind: 'Name',
                    value: typeNameTransformer(node.name.value)
                }
            };
        }
    });
}