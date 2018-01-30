"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var utils_1 = require("../utils/utils");
/**
 * Creates a field node with a name and an optional alias
 * @param name the name
 * @param alias the alias, or undefined to not specify an alias
 * @param selections an array of selection nodes, or undefined to not specify a SelectionSet node
 * @returns the field node
 */
function createFieldNode(name, alias, selections) {
    return __assign({ kind: 'Field', name: {
            kind: 'Name',
            value: name
        } }, (alias ? {
        alias: {
            kind: 'Name',
            value: alias
        }
    } : {}), (selections ? {
        selectionSet: {
            kind: 'SelectionSet',
            selections: selections
        }
    } : {}));
}
exports.createFieldNode = createFieldNode;
/**
 * Builds a SelectionSetNode for a chain of nested field selections
 *
 * The input (['a', 'b'], selSet) yields the selection set "{ a { b { selSet } } }"
 * @param fieldNames
 * @param innermostSelectionSet
 * @returns {SelectionSetNode}
 */
function createSelectionChain(fieldNames, innermostSelectionSet) {
    return cloneSelectionChain(fieldNames.map(function (name) { return createFieldNode(name); }), innermostSelectionSet);
}
exports.createSelectionChain = createSelectionChain;
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
function cloneSelectionChain(fieldNodes, innermostSelectionSet) {
    if (!fieldNodes.length && !innermostSelectionSet) {
        throw new Error("Either provide innermostSelectionSet or a non-empty fieldNodes array");
    }
    var currentSelectionSet = innermostSelectionSet;
    for (var _i = 0, _a = Array.from(fieldNodes).reverse(); _i < _a.length; _i++) {
        var fieldNode = _a[_i];
        currentSelectionSet = {
            kind: 'SelectionSet',
            selections: [
                __assign({}, fieldNode, { selectionSet: currentSelectionSet })
            ]
        };
    }
    return currentSelectionSet;
}
exports.cloneSelectionChain = cloneSelectionChain;
function createTypeNode(type) {
    if (type instanceof graphql_1.GraphQLList) {
        return {
            kind: 'ListType',
            type: createTypeNode(type.ofType)
        };
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return {
            kind: 'NonNullType',
            type: createTypeNode(type.ofType)
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
exports.createTypeNode = createTypeNode;
/**
 * Creates a GraphQL syntax node that defines a variable of a given name and type
 */
function createVariableDefinitionNode(varName, type) {
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
exports.createVariableDefinitionNode = createVariableDefinitionNode;
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
function createNestedArgumentWithVariableNode(argumentPath, variableName) {
    var parts = argumentPath.split('.');
    var argName = parts.shift();
    if (!argName) {
        throw new Error('Argument must not be empty');
    }
    var value = {
        kind: 'Variable',
        name: {
            kind: 'Name',
            value: variableName
        }
    };
    for (var _i = 0, _a = parts.reverse(); _i < _a.length; _i++) {
        var part = _a[_i];
        value = {
            kind: 'ObjectValue',
            fields: [
                {
                    kind: 'ObjectField',
                    value: value,
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
        value: value
    };
}
exports.createNestedArgumentWithVariableNode = createNestedArgumentWithVariableNode;
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
function addFieldSelectionSafely(selectionSet, field, fragments) {
    if (fragments === void 0) { fragments = {}; }
    // Do not consider fragments here because we do not know if the type of them always matches the actual type
    var existing = selectionSet.selections.filter(function (sel) { return sel.kind == 'Field' && sel.name.value == field; });
    if (existing.length) {
        var sel = existing[0];
        return {
            selectionSet: selectionSet,
            alias: sel.alias ? sel.alias.value : sel.name.value
        };
    }
    // Here, we consider all fragments to be on the safe side
    var alias = field;
    if (aliasExistsInSelection(selectionSet, alias, fragments)) {
        var number = 0;
        do {
            alias = (field + '') + number; // convert field to string, better safe than sorry
            number++;
        } while (aliasExistsInSelection(selectionSet, alias, fragments));
    }
    return {
        selectionSet: __assign({}, selectionSet, { selections: selectionSet.selections.concat([
                __assign({ kind: 'Field', name: {
                        kind: 'Name',
                        value: field
                    } }, (alias == field ? {} : {
                    alias: {
                        kind: 'Name',
                        value: alias
                    }
                }))
            ]) }),
        alias: alias
    };
}
exports.addFieldSelectionSafely = addFieldSelectionSafely;
/**
 * Determines whether an unaliased field with the given name or an aliased field with the given name as alias exists.
 * Inline fragments and fragment spread operators are crawled recursively. The type of fragments is not considered.
 *
 * @param selectionSet the selection set
 * @param alias the name of the field or alias to check
 * @param fragments an array of fragment definitions for lookup of fragment spreads
 */
function aliasExistsInSelection(selectionSet, alias, fragments) {
    if (fragments === void 0) { fragments = {}; }
    return findNodesByAliasInSelections(selectionSet.selections, alias, fragments).length > 0;
}
exports.aliasExistsInSelection = aliasExistsInSelection;
/**
 * Finds all the field nodes that are selected by a given selection set, by spreading all referenced fragments
 *
 * @param selections the selection set
 * @param fragments an array of fragment definitions for lookup of fragment spreads
 * @return the field nodes
 */
function expandSelections(selections, fragments) {
    if (fragments === void 0) { fragments = {}; }
    function findFragment(name) {
        if (!(name in fragments)) {
            throw new Error("Fragment " + name + " is referenced but not defined");
        }
        return fragments[name];
    }
    function expandSelection(node) {
        switch (node.kind) {
            case 'Field':
                return [node];
            case 'FragmentSpread':
                var fragment = findFragment(node.name.value);
                return expandSelections(fragment.selectionSet.selections, fragments);
            case 'InlineFragment':
                return expandSelections(node.selectionSet.selections, fragments);
            default:
                throw new Error("Unexpected node kind: " + node.kind);
        }
    }
    return utils_1.flatMap(selections, expandSelection);
}
exports.expandSelections = expandSelections;
/*
 * Finds all field node with a given alias (or name if no alias is specified) within a selection set.
 * Inline fragments and fragment spread operators are crawled recursively. The type of fragments is not considered.
 * Multiple matching nodes are collected recusivily, according to GraphQL's field node merging logic
 */
function findNodesByAliasInSelections(selections, alias, fragments) {
    if (fragments === void 0) { fragments = {}; }
    return expandSelections(selections, fragments).filter(function (node) { return getAliasOrName(node) == alias; });
}
exports.findNodesByAliasInSelections = findNodesByAliasInSelections;
function addVariableDefinitionSafely(variableDefinitions, name, type) {
    var names = new Set(variableDefinitions.map(function (def) { return def.variable.name.value; }));
    var varName = name;
    if (names.has(name)) {
        var number = 0;
        do {
            varName = name + number;
            number++;
        } while (names.has(varName));
    }
    return {
        variableDefinitions: variableDefinitions.concat([
            createVariableDefinitionNode(varName, type)
        ]),
        name: varName
    };
}
exports.addVariableDefinitionSafely = addVariableDefinitionSafely;
/**
 * Renames all named types starting at a node
 * @param root the node where to start
 * @param typeNameTransformer a function that gets the old name and returns the new name
 * @returns {any}
 */
function renameTypes(root, typeNameTransformer) {
    return graphql_1.visit(root, {
        NamedType: function (node) {
            return __assign({}, node, { name: {
                    kind: 'Name',
                    value: typeNameTransformer(node.name.value)
                } });
        }
    });
}
exports.renameTypes = renameTypes;
function collectFieldNodesInPath(selectionSet, aliases, fragments) {
    if (fragments === void 0) { fragments = {}; }
    if (!aliases.length) {
        throw new Error("Aliases must not be empty");
    }
    var currentSelectionSets = [selectionSet];
    var fieldNodesInPath = [];
    var _loop_1 = function (alias) {
        if (!currentSelectionSets.length) {
            throw new Error("Expected field " + (fieldNodesInPath.length ? fieldNodesInPath[fieldNodesInPath.length - 1].name.value : '') + " to have sub-selection but it does not");
        }
        var matchingFieldNodes = utils_1.flatMap(currentSelectionSets, function (selSet) { return findNodesByAliasInSelections(selSet.selections, alias, fragments); });
        if (!matchingFieldNodes.length) {
            throw new Error("Field " + alias + " expected but not found");
        }
        currentSelectionSets = utils_1.compact(matchingFieldNodes.map(function (node) { return node.selectionSet; }));
        // those matching nodes all need to be compatible - except their selection sets (which will be merged)
        // As the consumer probably does not care about the selection set (this function here is there to process them, after all), this is probably ok
        fieldNodesInPath.push(matchingFieldNodes[0]);
    };
    for (var _i = 0, aliases_1 = aliases; _i < aliases_1.length; _i++) {
        var alias = aliases_1[_i];
        _loop_1(alias);
    }
    return fieldNodesInPath;
}
exports.collectFieldNodesInPath = collectFieldNodesInPath;
/**
 * Gets the alias of a field node, or the field name if it does not have an alias
 * @param fieldNode
 * @returns {string}
 */
function getAliasOrName(fieldNode) {
    if (fieldNode.alias) {
        return fieldNode.alias.value;
    }
    return fieldNode.name.value;
}
exports.getAliasOrName = getAliasOrName;
//# sourceMappingURL=language-utils.js.map