"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var WeavingErrorHandlingMode;
(function (WeavingErrorHandlingMode) {
    /**
     * All errors are directly thrown in weaveSchemas
     */
    WeavingErrorHandlingMode[WeavingErrorHandlingMode["THROW"] = 0] = "THROW";
    /**
     * Errors are ignored. If the endpoint schema cannot be created at all, it will be missing in the result config.
     * If you are using weaveSchemasExt, errors are included in its result.
     */
    WeavingErrorHandlingMode[WeavingErrorHandlingMode["CONTINUE"] = 1] = "CONTINUE";
    /**
     * Like CONTINUE, but errors are additionally displayed to the user via a special _errors field on the root
     * query type.
     */
    WeavingErrorHandlingMode[WeavingErrorHandlingMode["CONTINUE_AND_REPORT_IN_SCHEMA"] = 2] = "CONTINUE_AND_REPORT_IN_SCHEMA";
    /**
     * Like CONTINUE_AND_PROVIDE_IN_SCHEMA, but namespaced endpoints that completely fail are also replaced by an object
     * with a field _error.
     */
    WeavingErrorHandlingMode[WeavingErrorHandlingMode["CONTINUE_AND_ADD_PLACEHOLDERS"] = 3] = "CONTINUE_AND_ADD_PLACEHOLDERS";
})(WeavingErrorHandlingMode = exports.WeavingErrorHandlingMode || (exports.WeavingErrorHandlingMode = {}));
var DEFAULT_ERROR_HANDLING_MODE = WeavingErrorHandlingMode.THROW;
function shouldAddPlaceholdersOnError(errorHandling) {
    if (errorHandling === void 0) { errorHandling = DEFAULT_ERROR_HANDLING_MODE; }
    return errorHandling == WeavingErrorHandlingMode.CONTINUE_AND_ADD_PLACEHOLDERS;
}
exports.shouldAddPlaceholdersOnError = shouldAddPlaceholdersOnError;
function shouldProvideErrorsInSchema(errorHandling) {
    if (errorHandling === void 0) { errorHandling = DEFAULT_ERROR_HANDLING_MODE; }
    return errorHandling == WeavingErrorHandlingMode.CONTINUE_AND_REPORT_IN_SCHEMA || errorHandling == WeavingErrorHandlingMode.CONTINUE_AND_ADD_PLACEHOLDERS;
}
exports.shouldProvideErrorsInSchema = shouldProvideErrorsInSchema;
function shouldContinueOnError(errorHandling) {
    if (errorHandling === void 0) { errorHandling = DEFAULT_ERROR_HANDLING_MODE; }
    return errorHandling != WeavingErrorHandlingMode.THROW;
}
exports.shouldContinueOnError = shouldContinueOnError;
/**
 * Calls a function in a nested error handling context.
 *
 * WeavingErrors thrown within the function caught and reported to the error handler "reportError". Errors reported
 * within the function are prefixed with "errorPrefix: ".
 */
function nestErrorHandling(reportError, errorPrefix, fn) {
    var resumableErrors = [];
    function reportNestedError(error) {
        var message = errorPrefix ? errorPrefix + ": " + error.message : error.message;
        reportError(new errors_1.WeavingError(message, error.endpoint, error));
    }
    try {
        fn(function (error) { return resumableErrors.push(error); });
    }
    catch (error) {
        if (error instanceof errors_1.WeavingError) {
            reportNestedError(error);
        }
        else {
            throw error;
        }
    }
    resumableErrors.forEach(reportNestedError);
}
exports.nestErrorHandling = nestErrorHandling;
//# sourceMappingURL=error-handling.js.map