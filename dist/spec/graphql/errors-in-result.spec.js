"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var errors_in_result_1 = require("../../src/graphql/errors-in-result");
describe('moveErrorsIntoResult', function () {
    it('moves error of direct field', function () {
        var error = new graphql_1.GraphQLError('message', undefined, undefined, undefined, ['erroneous']);
        var result = errors_in_result_1.moveErrorsToData({
            data: { abc: true, erroneous: 'test' },
            errors: [error]
        });
        expect(result.errors).toBeUndefined();
        expect(result.data.abc).toBe(true);
        expect(result.data.erroneous.constructor).toBe(errors_in_result_1.FieldErrorValue);
        expect(result.data.erroneous.originalValue).toBe('test');
        expect(result.data.erroneous.errors).toEqual([error]);
    });
    it('works with two errors on the same field', function () {
        var error1 = new graphql_1.GraphQLError('message', undefined, undefined, undefined, ['erroneous']);
        var error2 = new graphql_1.GraphQLError('message 2', undefined, undefined, undefined, ['erroneous']);
        var result = errors_in_result_1.moveErrorsToData({
            data: { abc: true, erroneous: 'test' },
            errors: [error1, error2]
        });
        expect(result.errors).toBeUndefined();
        expect(result.data.erroneous.constructor).toBe(errors_in_result_1.FieldErrorValue);
        expect(result.data.erroneous.originalValue).toBe('test');
        expect(result.data.erroneous.errors).toEqual([error1, error2]);
    });
    it('moves error of nested field', function () {
        var error = new graphql_1.GraphQLError('message', undefined, undefined, undefined, ['wrap', 'erroneous']);
        var result = errors_in_result_1.moveErrorsToData({
            data: { abc: true, wrap: { erroneous: 'test', working: 'abc' } },
            errors: [error]
        });
        expect(result.errors).toBeUndefined();
        expect(result.data.wrap.working).toBe('abc');
        expect(result.data.wrap.erroneous.constructor.name).toBe(errors_in_result_1.FieldErrorValue.name);
        expect(result.data.wrap.erroneous.originalValue).toBe('test');
        expect(result.data.wrap.erroneous.errors).toEqual([error]);
    });
    it('moves error of array item field', function () {
        var error = new graphql_1.GraphQLError('message', undefined, undefined, undefined, ['array', 2]);
        var result = errors_in_result_1.moveErrorsToData({
            data: { abc: true, array: [1, 2, 3] },
            errors: [error]
        });
        expect(result.errors).toBeUndefined();
        expect(result.data.array[0]).toBe(1);
        expect(result.data.array[2].constructor.name).toBe(errors_in_result_1.FieldErrorValue.name);
        expect(result.data.array[2].originalValue).toBe(3);
        expect(result.data.array[2].errors).toEqual([error]);
    });
    it('creates data property if missing', function () {
        var error = new graphql_1.GraphQLError('message', undefined, undefined, undefined, ['abc']);
        var result = errors_in_result_1.moveErrorsToData({
            data: { abc: true },
            errors: [error]
        });
        expect(result.data).toBeDefined();
        expect(typeof result.data).toBe('object');
        expect(result.data.abc.constructor.name).toBe(errors_in_result_1.FieldErrorValue.name);
    });
    it('creates field skeleton for null values', function () {
        var error = new graphql_1.GraphQLError('message', undefined, undefined, undefined, ['wrap', 'erroneous']);
        var result = errors_in_result_1.moveErrorsToData({
            data: { abc: true },
            errors: [error]
        });
        expect(result.errors).toBeUndefined();
        expect(typeof result.data.wrap).toBe('object');
        expect(result.data.wrap.erroneous.constructor.name).toBe(errors_in_result_1.FieldErrorValue.name);
        expect(result.data.wrap.erroneous.originalValue).toBe(undefined);
        expect(result.data.wrap.erroneous.errors).toEqual([error]);
    });
    it('leaves global errors', function () {
        var error = new graphql_1.GraphQLError('global message');
        var result = errors_in_result_1.moveErrorsToData({
            data: { abc: true },
            errors: [error]
        });
        expect(result).toEqual({ data: { abc: true }, errors: [error] });
    });
});
//# sourceMappingURL=errors-in-result.spec.js.map