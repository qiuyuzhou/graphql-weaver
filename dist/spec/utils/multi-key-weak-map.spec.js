"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multi_key_weak_map_1 = require("../../src/utils/multi-key-weak-map");
describe('MultiKeyWeakMap', function () {
    it('can set and get', function () {
        var map = new multi_key_weak_map_1.ArrayKeyWeakMap();
        var obj1 = {};
        var obj2 = {};
        var obj3 = {};
        map.set([obj1, obj2], '1-2');
        map.set([obj1, obj3], '1-3');
        map.set([obj2, obj3], '2-3');
        expect(map.get([obj1, obj2])).toBe('1-2');
        expect(map.has([obj1, obj2])).toBe(true);
        expect(map.get([obj1, obj3])).toBe('1-3');
        expect(map.has([obj1, obj3])).toBe(true);
        expect(map.get([obj2, obj3])).toBe('2-3');
        expect(map.has([obj2, obj3])).toBe(true);
        expect(map.get([obj3, obj3])).toBe(undefined);
        expect(map.has([obj3, obj3])).toBe(false);
    });
    it('can delete', function () {
        var map = new multi_key_weak_map_1.ArrayKeyWeakMap();
        var obj1 = {};
        var obj2 = {};
        var obj3 = {};
        map.set([obj1, obj2], '1-2');
        map.set([obj1, obj3], '1-3');
        map.delete([obj1, obj3]);
        expect(map.get([obj1, obj2])).toBe('1-2');
        expect(map.has([obj1, obj2])).toBe(true);
        expect(map.get([obj1, obj3])).toBe(undefined);
        expect(map.has([obj1, obj3])).toBe(false);
    });
});
//# sourceMappingURL=multi-key-weak-map.spec.js.map