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
var util_1 = require("util");
function objectValues(obj) {
    return Object.keys(obj).map(function (i) { return obj[i]; });
}
exports.objectValues = objectValues;
function objectEntries(obj) {
    return Object.keys(obj).map(function (k) { return [k, obj[k]]; });
}
exports.objectEntries = objectEntries;
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalize = capitalize;
function maybeDo(input, fn) {
    if (input == undefined) {
        return undefined;
    }
    return fn(input);
}
exports.maybeDo = maybeDo;
function arrayToObject(array, keyFn) {
    var result = {};
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var item = array_1[_i];
        result[keyFn(item)] = item;
    }
    return result;
}
exports.arrayToObject = arrayToObject;
function objectFromKeys(keys, valueFn) {
    var result = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        result[key] = valueFn(key);
    }
    return result;
}
exports.objectFromKeys = objectFromKeys;
function objectFromKeyValuePairs(pairs) {
    var result = {};
    for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
        var _a = pairs_1[_i], key = _a[0], value = _a[1];
        result[key] = value;
    }
    return result;
}
exports.objectFromKeyValuePairs = objectFromKeyValuePairs;
function objectToMap(object) {
    return new Map(objectEntries(object));
}
exports.objectToMap = objectToMap;
function mapValues(obj, fn) {
    var result = {};
    for (var key in obj) {
        result[key] = fn(obj[key], key);
    }
    return result;
}
exports.mapValues = mapValues;
function filterValues(obj, predicate) {
    var result = {};
    for (var key in obj) {
        var value = obj[key];
        if (predicate(value, key)) {
            result[key] = value;
        }
    }
    return result;
}
exports.filterValues = filterValues;
/**
 * Removes object properties and array values that do not match a predicate
 */
function filterValuesDeep(obj, predicate) {
    if (obj instanceof Array) {
        return obj
            .filter(predicate)
            .map(function (val) { return filterValuesDeep(val, predicate); });
    }
    if (typeof obj === 'object' && obj !== null) {
        var filtered = filterValues(obj, predicate);
        return mapValues(filtered, function (val) { return filterValuesDeep(val, predicate); });
    }
    return obj;
}
exports.filterValuesDeep = filterValuesDeep;
/**
 * Creates a new Map by changing the keys but leaving the values as-is
 * @param map a map
 * @param fn a function that gets an old key and returns the new key
 * @returns the new map
 */
function mapMapKeys(map, fn) {
    var newMap = new Map();
    for (var _i = 0, _a = Array.from(map); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        newMap.set(fn(key), value);
    }
    return newMap;
}
exports.mapMapKeys = mapMapKeys;
/**
 * Creates a new Map by changing the keys but leaving the values as-is
 * @param map a map
 * @param fn a function that gets an old key and returns the new key
 * @returns the new map
 */
function mapMapValues(map, fn) {
    var newMap = new Map();
    for (var _i = 0, _a = Array.from(map); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        newMap.set(key, fn(value, key));
    }
    return newMap;
}
exports.mapMapValues = mapMapValues;
function flatten(input) {
    var arr = [];
    return arr.concat.apply(arr, input);
}
exports.flatten = flatten;
function flatMap(input, fn) {
    return flatten(input.map(fn));
}
exports.flatMap = flatMap;
function compact(arr) {
    return arr.filter(function (a) { return a != undefined; });
}
exports.compact = compact;
function mapAndCompact(input, fn) {
    return input.map(fn).filter(function (a) { return a != undefined; });
}
exports.mapAndCompact = mapAndCompact;
function throwError(arg) {
    if (util_1.isFunction(arg)) {
        throw arg();
    }
    throw new Error(arg);
}
exports.throwError = throwError;
function groupBy(arr, keyFn) {
    var map = new Map();
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var item = arr_1[_i];
        var key = keyFn(item);
        var bucket = map.get(key);
        if (!bucket) {
            bucket = [];
            map.set(key, bucket);
        }
        bucket.push(item);
    }
    return map;
}
exports.groupBy = groupBy;
function intersect(lhs, rhs) {
    var set = new Set(lhs);
    return rhs.filter(function (val) { return set.has(val); });
}
exports.intersect = intersect;
/**
 * Binds a function, to an object, or returns undefined if the function is undefined
 * @param fn the function to bind
 * @param obj the object to bind the function to
 * @returns the bound function, or undefined
 */
function bindNullable(fn, obj) {
    return fn ? fn.bind(obj) : fn;
}
exports.bindNullable = bindNullable;
/**
 * Takes an array and filters those matching a predicate into one new array, those not matching into a second
 * @param {T[]} items
 * @param {(item: T) => boolean} predicate
 * @returns {[T[] , T[]]} a tuple with the matching ones (first) and the non-matching ones (second)
 */
function divideArrayByPredicate(items, predicate) {
    var trues = [];
    var falses = [];
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var def = items_1[_i];
        if (predicate(def)) {
            trues.push(def);
        }
        else {
            falses.push(def);
        }
    }
    return [trues, falses];
}
exports.divideArrayByPredicate = divideArrayByPredicate;
function modifyPropertyAtPath(obj, fn, path) {
    if (!path.length) {
        return fn(obj);
    }
    var segment = path[0], rest = path.slice(1);
    // keep arrays if possible
    if (typeof segment == 'number' && segment >= 0) {
        if (obj == undefined) {
            obj = [];
        }
        if (util_1.isArray(obj)) {
            var oldItem = obj[segment];
            var newItem = modifyPropertyAtPath(oldItem, fn, rest);
            return replaceArrayItem(obj, segment, newItem);
        }
        if (typeof obj != 'object') {
            throw new TypeError("Expected array, but got " + typeof obj + " while trying to replace property path " + path);
        }
    }
    if (obj == undefined) {
        obj = {};
    }
    if (typeof obj != 'object') {
        throw new TypeError("Expected object, but got " + typeof obj + " while trying to replace property path " + path);
    }
    var val = obj[segment];
    return __assign({}, obj, (_a = {}, _a[segment] = modifyPropertyAtPath(val, fn, rest), _a));
    var _a;
}
exports.modifyPropertyAtPath = modifyPropertyAtPath;
function replaceArrayItem(array, index, newValue) {
    var before = array.slice(0, index /* exclusive */);
    var after = array.slice(index + 1);
    var beforeFill = repeat(undefined, index - before.length); // make sure
    return before.concat(beforeFill, [
        newValue
    ], after);
}
exports.replaceArrayItem = replaceArrayItem;
function repeat(value, count) {
    if (count <= 0) {
        return [];
    }
    var arr = new Array(count);
    for (var i = 0; i < count; i++) {
        arr[i] = value;
    }
    return arr;
}
exports.repeat = repeat;
function getOrSetFromMap(map, key, defaultFn) {
    if (map.has(key)) {
        return map.get(key);
    }
    var value = defaultFn();
    map.set(key, value);
    return value;
}
exports.getOrSetFromMap = getOrSetFromMap;
function isPromise(value) {
    return typeof value === 'object' && value !== null && typeof value.then === 'function';
}
exports.isPromise = isPromise;
//# sourceMappingURL=utils.js.map