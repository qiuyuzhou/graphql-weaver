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
var language_utils_1 = require("../../src/graphql/language-utils");
var graphql_1 = require("graphql");
describe('language-utils', function () {
    describe('createFieldNode', function () {
        it('works without alias', function () {
            var result = language_utils_1.createFieldNode('field');
            expect(result.kind).toBe('Field');
            expect(result.name.kind).toBe('Name');
            expect(result.name.value).toBe('field');
        });
        it('works with alias', function () {
            var result = language_utils_1.createFieldNode('field', 'alias');
            expect(result.kind).toBe('Field');
            expect(result.name.kind).toBe('Name');
            expect(result.name.value).toBe('field');
            expect(result.alias.kind).toBe('Name');
            expect(result.alias.value).toBe('alias');
        });
    });
    describe('createTypeNode', function () {
        it('supports native types', function () {
            var result = language_utils_1.createTypeNode(graphql_1.GraphQLString);
            expect(result.kind).toBe('NamedType');
            expect(result.name.value).toBe('String');
        });
        it('supports object types', function () {
            var type = new graphql_1.GraphQLObjectType({ name: 'TypeName', fields: {} });
            var result = language_utils_1.createTypeNode(type);
            expect(result.kind).toBe('NamedType');
            expect(result.name.value).toBe('TypeName');
        });
        it('supports non-null types', function () {
            var result = language_utils_1.createTypeNode(new graphql_1.GraphQLNonNull(graphql_1.GraphQLString));
            expect(result.kind).toBe('NonNullType');
            var innerType = result.type;
            expect(innerType.kind).toBe('NamedType');
            expect(innerType.name.value).toBe('String');
        });
        it('supports list types', function () {
            var result = language_utils_1.createTypeNode(new graphql_1.GraphQLList(graphql_1.GraphQLString));
            expect(result.kind).toBe('ListType');
            var innerType = result.type;
            expect(innerType.kind).toBe('NamedType');
            expect(innerType.name.value).toBe('String');
        });
    });
    describe('createVariableDefinitionNode', function () {
        it('supports simple types', function () {
            var result = language_utils_1.createVariableDefinitionNode('varName', graphql_1.GraphQLString);
            expect(result.kind).toBe('VariableDefinition');
            expect(result.type.name.value).toBe('String');
            expect(result.variable.name.value).toBe('varName');
        });
    });
    describe('createNestedArgumentWithVariableNode', function () {
        it('works with simple argument', function () {
            var result = language_utils_1.createNestedArgumentWithVariableNode('arg', 'varName');
            expect(result.kind).toBe('Argument');
            expect(result.name.value).toBe('arg');
            expect(result.value.kind).toBe('Variable');
            expect(result.value.name.value).toBe('varName');
        });
        it('works with singly nested argument', function () {
            var result = language_utils_1.createNestedArgumentWithVariableNode('arg.field', 'varName');
            expect(result.kind).toBe('Argument');
            expect(result.name.value).toBe('arg');
            expect(result.value.kind).toBe('ObjectValue');
            var obj = result.value;
            expect(obj.fields.length).toBe(1);
            expect(obj.fields[0].name.value).toBe('field');
            expect(obj.fields[0].value.kind).toBe('Variable');
            expect(obj.fields[0].value.name.value).toBe('varName');
        });
        it('works with doubly nested argument', function () {
            var result = language_utils_1.createNestedArgumentWithVariableNode('arg.field1.field2', 'varName');
            expect(result.kind).toBe('Argument');
            expect(result.name.value).toBe('arg');
            expect(result.value.kind).toBe('ObjectValue');
            var obj1 = result.value;
            expect(obj1.fields.length).toBe(1);
            expect(obj1.fields[0].name.value).toBe('field1');
            expect(obj1.fields[0].value.kind).toBe('ObjectValue');
            var obj2 = obj1.fields[0].value;
            expect(obj2.fields.length).toBe(1);
            expect(obj2.fields[0].name.value).toBe('field2');
            expect(obj2.fields[0].value.kind).toBe('Variable');
            expect(obj2.fields[0].value.name.value).toBe('varName');
        });
    });
    describe('addFieldSelectionSafely', function () {
        it('does nothing when field already exists', function () {
            var inputSelectionSet = {
                kind: 'SelectionSet',
                selections: [
                    language_utils_1.createFieldNode('fieldName')
                ]
            };
            var _a = language_utils_1.addFieldSelectionSafely(inputSelectionSet, 'fieldName'), alias = _a.alias, selectionSet = _a.selectionSet;
            expect(alias).toBe('fieldName');
            expect(selectionSet).toEqual(inputSelectionSet);
        });
        it('does nothing when field already exists, but is aliased', function () {
            var inputSelectionSet = {
                kind: 'SelectionSet',
                selections: [
                    language_utils_1.createFieldNode('otherField', 'fieldName'),
                    language_utils_1.createFieldNode('fieldName', 'aliasedName')
                ]
            };
            var _a = language_utils_1.addFieldSelectionSafely(inputSelectionSet, 'fieldName'), alias = _a.alias, selectionSet = _a.selectionSet;
            expect(alias).toBe('aliasedName');
            expect(selectionSet).toEqual(inputSelectionSet);
        });
        it('adds the field when it does not already exist', function () {
            var inputSelectionSet = {
                kind: 'SelectionSet',
                selections: [
                    language_utils_1.createFieldNode('otherField')
                ]
            };
            var _a = language_utils_1.addFieldSelectionSafely(inputSelectionSet, 'fieldName'), alias = _a.alias, selectionSet = _a.selectionSet;
            expect(alias).toBe('fieldName');
            expect(selectionSet).toEqual(__assign({}, inputSelectionSet, { selections: inputSelectionSet.selections.concat([
                    language_utils_1.createFieldNode('fieldName')
                ]) }));
        });
        it('renames the field when it collides with an existing field', function () {
            var inputSelectionSet = {
                kind: 'SelectionSet',
                selections: [
                    language_utils_1.createFieldNode('otherField', 'fieldName')
                ]
            };
            var _a = language_utils_1.addFieldSelectionSafely(inputSelectionSet, 'fieldName'), alias = _a.alias, selectionSet = _a.selectionSet;
            expect(alias).toBe('fieldName0');
            expect(selectionSet).toEqual(__assign({}, inputSelectionSet, { selections: inputSelectionSet.selections.concat([
                    language_utils_1.createFieldNode('fieldName', 'fieldName0')
                ]) }));
        });
        it('renames the field when it collides with an existing field twice', function () {
            var inputSelectionSet = {
                kind: 'SelectionSet',
                selections: [
                    language_utils_1.createFieldNode('otherField1', 'fieldName'),
                    language_utils_1.createFieldNode('otherField2', 'fieldName0')
                ]
            };
            var _a = language_utils_1.addFieldSelectionSafely(inputSelectionSet, 'fieldName'), alias = _a.alias, selectionSet = _a.selectionSet;
            expect(alias).toBe('fieldName1');
            expect(selectionSet).toEqual(__assign({}, inputSelectionSet, { selections: inputSelectionSet.selections.concat([
                    language_utils_1.createFieldNode('fieldName', 'fieldName1')
                ]) }));
        });
        it('renames the field when it collides with a field of an inline fragment', function () {
            var inputSelectionSet = {
                kind: 'SelectionSet',
                selections: [
                    language_utils_1.createFieldNode('otherField'),
                    {
                        kind: 'InlineFragment',
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                language_utils_1.createFieldNode('otherField', 'fieldName')
                            ]
                        }
                    }
                ]
            };
            var _a = language_utils_1.addFieldSelectionSafely(inputSelectionSet, 'fieldName'), alias = _a.alias, selectionSet = _a.selectionSet;
            expect(alias).toBe('fieldName0');
            expect(selectionSet).toEqual(__assign({}, inputSelectionSet, { selections: inputSelectionSet.selections.concat([
                    language_utils_1.createFieldNode('fieldName', 'fieldName0')
                ]) }));
        });
        it('renames the field when it collides with the same field in an inline fragment', function () {
            // this is because we cannot be sure the type condition holds, so the field may be missing
            var inputSelectionSet = {
                kind: 'SelectionSet',
                selections: [
                    language_utils_1.createFieldNode('otherField'),
                    {
                        kind: 'InlineFragment',
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                language_utils_1.createFieldNode('fieldName')
                            ]
                        }
                    }
                ]
            };
            var _a = language_utils_1.addFieldSelectionSafely(inputSelectionSet, 'fieldName'), alias = _a.alias, selectionSet = _a.selectionSet;
            expect(alias).toBe('fieldName0');
            expect(selectionSet).toEqual(__assign({}, inputSelectionSet, { selections: inputSelectionSet.selections.concat([
                    language_utils_1.createFieldNode('fieldName', 'fieldName0')
                ]) }));
        });
        it('renames the field when it collides with a field of a fragment spread', function () {
            var inputSelectionSet = {
                kind: 'SelectionSet',
                selections: [
                    language_utils_1.createFieldNode('otherField'),
                    {
                        kind: 'FragmentSpread',
                        name: {
                            kind: 'Name',
                            value: 'frag'
                        }
                    }
                ]
            };
            var fragments = {
                frag: {
                    kind: 'FragmentDefinition',
                    name: {
                        kind: 'Name',
                        value: 'frag'
                    },
                    typeCondition: language_utils_1.createTypeNode(graphql_1.GraphQLString),
                    selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                            language_utils_1.createFieldNode('otherField', 'fieldName')
                        ]
                    }
                }
            };
            var _a = language_utils_1.addFieldSelectionSafely(inputSelectionSet, 'fieldName', fragments), alias = _a.alias, selectionSet = _a.selectionSet;
            expect(alias).toBe('fieldName0');
            expect(selectionSet).toEqual(__assign({}, inputSelectionSet, { selections: inputSelectionSet.selections.concat([
                    language_utils_1.createFieldNode('fieldName', 'fieldName0')
                ]) }));
        });
    });
    describe('renameTypes', function () {
        it('renames types in variable definitions', function () {
            var node = {
                kind: 'VariableDefinition',
                variable: {
                    kind: 'Variable',
                    name: {
                        kind: 'Name',
                        value: 'var'
                    }
                },
                type: language_utils_1.createTypeNode(graphql_1.GraphQLString)
            };
            var renamed = language_utils_1.renameTypes(node, function (name) { return 'prefix' + name; });
            expect(renamed.type.name.value).toBe('prefixString');
        });
    });
});
//# sourceMappingURL=language.utils.spec.js.map