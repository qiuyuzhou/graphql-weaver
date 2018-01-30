"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var FieldErrorValue = /** @class */ (function () {
    function FieldErrorValue(originalValue, errors) {
        if (errors === void 0) { errors = []; }
        this.originalValue = originalValue;
        this.errors = errors;
    }
    FieldErrorValue.prototype.getError = function () {
        if (this.errors.length == 1) {
            var error = this.errors[0];
            if (!error.locations) {
                // If we don't have a location here, we should let GraphQL assign a location based on the field
                // (when throwing the error in error-resolver module)
                // this works only if path is *not* set as this property triggers a fast path in locatedError
                // we don't really need the path (it gets set by graphql, too), so just keep the message
                return new Error(this.errors[0].message);
            }
            // error has locations, so better keep the whole thing
            // this happens when the resolver of a link value generates a validation error (with locations)
            return error;
        }
        // don't need to be fancy, this should not happen anyway.
        return new Error(this.errors.map(function (err) { return err.message; }).join('\n\n'));
    };
    return FieldErrorValue;
}());
exports.FieldErrorValue = FieldErrorValue;
/**
 * Moves errors from the 'errors' property into the correct places within the 'data' property, by wrapping them into a
 * FieldErrorValue.
 *
 * Make sure there are no existing FieldErrorValues in the data.
 *
 * Errors reported for properties not present in the return value will generate an empty skeleton of objects and arrays
 * up to the point where the error is located.
 *
 * Errors without path (validation errors) are kept in the 'errors' property.
 */
function moveErrorsToData(result, errorMapper) {
    if (errorMapper === void 0) { errorMapper = function (a) { return a; }; }
    if (!result.errors || !result.errors.length) {
        return result;
    }
    var globalErrors = [];
    var data = result.data;
    var _loop_1 = function (error) {
        if (!error.path) {
            globalErrors.push(errorMapper(error));
            return "continue";
        }
        data = utils_1.modifyPropertyAtPath(data, function (val) {
            if (val instanceof FieldErrorValue) {
                val.errors.push(errorMapper(error));
                return val;
            }
            return new FieldErrorValue(val, [errorMapper(error)]);
        }, error.path);
    };
    for (var _i = 0, _a = result.errors; _i < _a.length; _i++) {
        var error = _a[_i];
        _loop_1(error);
    }
    var newResult = {
        data: data
    };
    if (globalErrors.length) {
        newResult.errors = globalErrors;
    }
    return newResult;
}
exports.moveErrorsToData = moveErrorsToData;
//# sourceMappingURL=errors-in-result.js.map