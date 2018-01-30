"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../src/utils/utils");
describe('utils', function () {
    describe('repeat', function () {
        it('repeats', function () {
            expect(utils_1.repeat(true, 5)).toEqual([true, true, true, true, true]);
        });
        it('repeats zero times', function () {
            expect(utils_1.repeat(true, 0)).toEqual([]);
        });
        it('returns empty array for negative values', function () {
            expect(utils_1.repeat(true, -1)).toEqual([]);
        });
        it('repeats undefined', function () {
            expect(utils_1.repeat(undefined, 2)).toEqual([undefined, undefined]);
        });
    });
    describe('replaceArrayItem', function () {
        it('replaces at normal index', function () {
            expect(utils_1.replaceArrayItem([1, 2, 3], 1, 5)).toEqual([1, 5, 3]);
        });
        it('replaces at end', function () {
            expect(utils_1.replaceArrayItem([1, 2, 3], 2, 5)).toEqual([1, 2, 5]);
        });
        it('appends', function () {
            expect(utils_1.replaceArrayItem([1, 2, 3], 3, 5)).toEqual([1, 2, 3, 5]);
        });
        it('inserts undefined', function () {
            expect(utils_1.replaceArrayItem([1, 2, 3], 4, 5)).toEqual([1, 2, 3, undefined, 5]);
        });
    });
    describe('modifyPropertyAtPath', function () {
        it('works with empty path', function () {
            expect(utils_1.modifyPropertyAtPath("hello", function (val) { return val + " world"; }, []))
                .toEqual("hello world");
        });
        it('works with simple object', function () {
            expect(utils_1.modifyPropertyAtPath({ a: true, b: 123, c: 'test' }, function (val) { return val + 1; }, ['b']))
                .toEqual({ a: true, b: 124, c: 'test' });
        });
        it('works with simple array', function () {
            expect(utils_1.modifyPropertyAtPath([1, 2, 3], function (val) { return val + 4; }, [1]))
                .toEqual([1, 6, 3]);
        });
        it('creates object if required', function () {
            expect(utils_1.modifyPropertyAtPath(undefined, function (val) { return 2; }, ['a']))
                .toEqual({ a: 2 });
        });
        it('creates array if required', function () {
            expect(utils_1.modifyPropertyAtPath(undefined, function (val) { return 2; }, [1]))
                .toEqual([undefined, 2]);
        });
        it('keeps values as objects even if segment is number', function () {
            expect(utils_1.modifyPropertyAtPath({ 0: true, 1: 123, abc: 'test' }, function (val) { return 2; }, [1]))
                .toEqual({ 0: true, 1: 2, abc: 'test' });
        });
        it('throws if non-object is given at number segment', function () {
            expect(function () { return utils_1.modifyPropertyAtPath('Blumenkohl', function (val) { return 2; }, [1]); })
                .toThrowError(/.*array.*string.*/);
        });
        it('throws if non-object is given at string segment', function () {
            expect(function () { return utils_1.modifyPropertyAtPath('Blumenkohl', function (val) { return 2; }, ['abc']); })
                .toThrowError(/.*object.*string.*/);
        });
        it('works recursively', function () {
            expect(utils_1.modifyPropertyAtPath({ abc: true, def: [1, 2, 3] }, function (val) { return 7; }, ['def', 4]))
                .toEqual({ abc: true, def: [1, 2, 3, undefined, 7] });
        });
    });
});
//# sourceMappingURL=utils.spec.js.map