import { WeavingErrorConsumer } from './errors';
export declare enum WeavingErrorHandlingMode {
    /**
     * All errors are directly thrown in weaveSchemas
     */
    THROW = 0,
    /**
     * Errors are ignored. If the endpoint schema cannot be created at all, it will be missing in the result config.
     * If you are using weaveSchemasExt, errors are included in its result.
     */
    CONTINUE = 1,
    /**
     * Like CONTINUE, but errors are additionally displayed to the user via a special _errors field on the root
     * query type.
     */
    CONTINUE_AND_REPORT_IN_SCHEMA = 2,
    /**
     * Like CONTINUE_AND_PROVIDE_IN_SCHEMA, but namespaced endpoints that completely fail are also replaced by an object
     * with a field _error.
     */
    CONTINUE_AND_ADD_PLACEHOLDERS = 3,
}
export declare function shouldAddPlaceholdersOnError(errorHandling?: WeavingErrorHandlingMode): boolean;
export declare function shouldProvideErrorsInSchema(errorHandling?: WeavingErrorHandlingMode): boolean;
export declare function shouldContinueOnError(errorHandling?: WeavingErrorHandlingMode): boolean;
/**
 * Calls a function in a nested error handling context.
 *
 * WeavingErrors thrown within the function caught and reported to the error handler "reportError". Errors reported
 * within the function are prefixed with "errorPrefix: ".
 */
export declare function nestErrorHandling(reportError: WeavingErrorConsumer, errorPrefix: string | undefined, fn: (reportError: WeavingErrorConsumer) => void): void;
