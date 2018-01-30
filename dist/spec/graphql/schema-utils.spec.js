"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var schema_utils_1 = require("../../src/graphql/schema-utils");
describe('schema-utils', function () {
    describe('walkFields', function () {
        var type = new graphql_1.GraphQLObjectType({
            name: 'Type',
            fields: {
                scalar: {
                    type: graphql_1.GraphQLString
                }
            }
        });
        var type2 = new graphql_1.GraphQLObjectType({
            name: 'Type2',
            fields: {
                inner: {
                    type: type
                }
            }
        });
        it('finds single field', function () {
            var result = schema_utils_1.walkFields(type, ['scalar']);
            expect(result).toBeDefined('field not found');
            expect(result.name).toBe('scalar');
        });
        it('finds nested field', function () {
            var result = schema_utils_1.walkFields(type2, ['inner', 'scalar']);
            expect(result).toBeDefined('field not found');
            expect(result.name).toBe('scalar');
        });
        it('returns undefined when not found', function () {
            var result = schema_utils_1.walkFields(type2, ['inner', 'not-found']);
            expect(result).toBeUndefined('field found but should not exist');
        });
        it('returns undefined when inner type is scalar type', function () {
            var result = schema_utils_1.walkFields(type, ['scalar', 'some-field']);
            expect(result).toBeUndefined('field found but should not exist');
        });
    });
});
//# sourceMappingURL=schema-utils.spec.js.map