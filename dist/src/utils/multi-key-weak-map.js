"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayKeyStrategy = /** @class */ (function () {
    function ArrayKeyStrategy() {
    }
    ArrayKeyStrategy.prototype.getBucketKey = function (key) {
        if (!key.length) {
            return ArrayKeyStrategy.EMPTY_BUCKET;
        }
        return key[0];
    };
    ArrayKeyStrategy.prototype.equals = function (lhs, rhs) {
        var len = lhs.length;
        if (len !== rhs.length) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            if (lhs[i] !== rhs[i]) {
                return false;
            }
        }
        return true;
    };
    ArrayKeyStrategy.EMPTY_BUCKET = {};
    return ArrayKeyStrategy;
}());
/**
 * A weak map with arrays of weakly-referenced objects as key
 *
 * Performance consideration: values are bucketed into the *one element* of the respective key (by default, the first
 * array element). Inside this bucket, a linear search is performed for the correct key. This works fine as long as one
 * element of the key is already very decisive.
 *
 * A key is weakly referenced as soon as there are no entries which contain any element of that key. Again, this is only
 * practical if keys are mostly clustered.
 */
var MultiKeyWeakMap = /** @class */ (function () {
    function MultiKeyWeakMap(strategy) {
        this.strategy = strategy;
        this.map = new WeakMap();
    }
    MultiKeyWeakMap.prototype.delete = function (key) {
        var result = this.find(key);
        if (!result) {
            return false;
        }
        result.bucket.splice(result.index, 1); // remove entry in-place
        return true;
    };
    MultiKeyWeakMap.prototype.get = function (key) {
        var result = this.find(key);
        if (!result) {
            return undefined;
        }
        return result.bucket[result.index].value;
    };
    MultiKeyWeakMap.prototype.has = function (key) {
        var result = this.find(key);
        return !!result;
    };
    MultiKeyWeakMap.prototype.set = function (key, value) {
        var bucketKey = this.strategy.getBucketKey(key);
        var bucket = this.map.get(bucketKey);
        if (!bucket) {
            bucket = [];
            this.map.set(bucketKey, bucket);
        }
        var index = this.findIndex(bucket, key);
        if (index == undefined) {
            bucket.push({ key: key, value: value });
        }
        else {
            bucket[index].value = value;
        }
        return this;
    };
    MultiKeyWeakMap.prototype.find = function (key) {
        var bucket = this.map.get(this.strategy.getBucketKey(key));
        if (!bucket) {
            return undefined;
        }
        var index = this.findIndex(bucket, key);
        if (index == undefined) {
            return undefined;
        }
        return { index: index, bucket: bucket };
    };
    MultiKeyWeakMap.prototype.findIndex = function (bucket, key) {
        var len = bucket.length;
        for (var i = 0; i < len; i++) {
            if (this.strategy.equals(bucket[i].key, key)) {
                return i;
            }
        }
        return undefined;
    };
    return MultiKeyWeakMap;
}());
exports.MultiKeyWeakMap = MultiKeyWeakMap;
var ArrayKeyWeakMap = /** @class */ (function (_super) {
    __extends(ArrayKeyWeakMap, _super);
    function ArrayKeyWeakMap() {
        return _super.call(this, new ArrayKeyStrategy()) || this;
    }
    return ArrayKeyWeakMap;
}(MultiKeyWeakMap));
exports.ArrayKeyWeakMap = ArrayKeyWeakMap;
//# sourceMappingURL=multi-key-weak-map.js.map