import { ExecutionResult, GraphQLError } from 'graphql';
export declare class FieldErrorValue {
    readonly originalValue: any;
    readonly errors: GraphQLError[];
    constructor(originalValue: any, errors?: GraphQLError[]);
    getError(): Error;
}
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
export declare function moveErrorsToData(result: ExecutionResult, errorMapper?: (error: GraphQLError) => GraphQLError): ExecutionResult;
