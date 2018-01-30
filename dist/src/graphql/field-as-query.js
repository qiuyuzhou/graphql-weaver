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
 * Prepares all the parts necessary to construct a GraphQL query document like produced by getFieldAsQuery
 */
function getFieldAsQueryParts(info) {
    var fragments = collectUsedFragments(info.fieldNodes, info.fragments);
    var selections = collectSelections(info.fieldNodes);
    var selectionSet = {
        kind: 'SelectionSet',
        selections: selections
    };
    var variableNames = collectUsedVariableNames(fragments.concat(info.fieldNodes));
    var variableDefinitions = (info.operation.variableDefinitions || [])
        .filter(function (variable) { return variableNames.has(variable.variable.name.value); });
    var variableValues = pickIntoObject(info.variableValues, Array.from(variableNames));
    var operation = info.operation.operation;
    return { fragments: fragments, variableDefinitions: variableDefinitions, variableValues: variableValues, selectionSet: selectionSet, operation: operation };
}
exports.getFieldAsQueryParts = getFieldAsQueryParts;
/**
 * Constructs a GraphQL query document from a field as seen by a resolver
 *
 * This is the basic component of a proxy - a resolver calls this method and then sends the query to the upstream server
 */
function getFieldAsQuery(info) {
    return getQueryFromParts(getFieldAsQueryParts(info));
}
exports.getFieldAsQuery = getFieldAsQuery;
function getQueryFromParts(parts) {
    var fragments = parts.fragments, variableDefinitions = parts.variableDefinitions, variableValues = parts.variableValues, selectionSet = parts.selectionSet, operation = parts.operation;
    var operationNode = {
        kind: 'OperationDefinition',
        operation: operation,
        variableDefinitions: variableDefinitions,
        selectionSet: selectionSet
    };
    var document = {
        kind: 'Document',
        definitions: [
            operationNode
        ].concat(fragments)
    };
    return {
        document: document,
        variableValues: variableValues
    };
}
exports.getQueryFromParts = getQueryFromParts;
function collectDirectlyUsedFragmentNames(roots) {
    var fragments = new Set();
    for (var _i = 0, roots_1 = roots; _i < roots_1.length; _i++) {
        var root = roots_1[_i];
        graphql_1.visit(root, {
            FragmentSpread: function (node) {
                fragments.add(node.name.value);
            }
        });
    }
    return Array.from(fragments);
}
function collectUsedVariableNames(roots) {
    var variables = new Set();
    for (var _i = 0, roots_2 = roots; _i < roots_2.length; _i++) {
        var root = roots_2[_i];
        graphql_1.visit(root, {
            VariableDefinition: function () {
                return false; // don't regard var definitions as usages
            },
            Variable: function (node) {
                variables.add(node.name.value);
            }
        });
    }
    return variables;
}
function collectUsedFragments(roots, fragmentMap) {
    var fragments = [];
    var originalFragments = new Set();
    var hasChanged = false;
    do {
        var newFragments = pickIntoArray(fragmentMap, collectDirectlyUsedFragmentNames(roots.concat(fragments))); // seemds odd to be cummulative here
        hasChanged = false;
        for (var _i = 0, newFragments_1 = newFragments; _i < newFragments_1.length; _i++) {
            var fragment = newFragments_1[_i];
            if (!originalFragments.has(fragment)) {
                originalFragments.add(fragment);
                fragments.push(fragment);
                hasChanged = true;
            }
        }
    } while (hasChanged);
    return fragments;
}
exports.collectUsedFragments = collectUsedFragments;
function buildFragmentMap(definitions) {
    return utils_1.arrayToObject(definitions, function (def) { return def.name.value; });
}
/**
 * Gets a new, semantically equal document where unused fragments are removed
 */
function dropUnusedFragments(document) {
    var _a = utils_1.divideArrayByPredicate(document.definitions, function (def) { return def.kind == 'FragmentDefinition'; }), fragments = _a[0], nonFragmentDefs = _a[1];
    var fragmentMap = buildFragmentMap(fragments);
    var usedFragments = collectUsedFragments(nonFragmentDefs, fragmentMap);
    return __assign({}, document, { definitions: nonFragmentDefs.concat(usedFragments) });
}
exports.dropUnusedFragments = dropUnusedFragments;
/**
 * Gets a new, semantically equal query where unused variables are removed
 */
function dropUnusedVariables(query) {
    var _a = utils_1.divideArrayByPredicate(query.document.definitions, function (def) { return def.kind == 'OperationDefinition'; }), operations = _a[0], nonOperationDefs = _a[1];
    var usedVarNames = collectUsedVariableNames([query.document]);
    if (operations.length == 0) {
        return query;
    }
    if (operations.length > 1) {
        throw new Error("Multiple operations not supported in dropUnusedVariables");
    }
    var operation = operations[0];
    var newOperation = __assign({}, operation, { variableDefinitions: operation.variableDefinitions ? operation.variableDefinitions.filter(function (variable) { return usedVarNames.has(variable.variable.name.value); }) : undefined });
    var variableValues = pickIntoObject(query.variableValues, Array.from(usedVarNames));
    return __assign({}, query, { variableValues: variableValues, document: __assign({}, query.document, { definitions: nonOperationDefs.concat([
                newOperation
            ]) }) });
}
exports.dropUnusedVariables = dropUnusedVariables;
/**
 * Collects the selections of all given field nodes
 * @param fieldNodes the selections
 * @returns {any}
 */
function collectSelections(fieldNodes) {
    return utils_1.flatMap(fieldNodes, function (node) { return node.selectionSet ? node.selectionSet.selections : []; });
}
function pickIntoArray(object, keys) {
    return keys.map(function (key) { return object[key]; });
}
function pickIntoObject(object, keys) {
    var obj = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        obj[key] = object[key];
    }
    return obj;
}
//# sourceMappingURL=field-as-query.js.map