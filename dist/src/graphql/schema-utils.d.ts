import { GraphQLField, GraphQLInterfaceType, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLType } from 'graphql';
/**
 * Finds a field by traversing a schema from field to field
 * @param type the type where to start
 * @param fieldNames an array of field names to traverse
 * @return the field, or undefined if not found
 */
export declare function walkFields(type: GraphQLObjectType | GraphQLInterfaceType, fieldNames: string[]): GraphQLField<any, any> | undefined;
/**
 * Determines if the type is a List type (or a NonNull wrapper of a list type)
 */
export declare function isListType(type: GraphQLType): boolean;
export declare function getNonNullType<T extends GraphQLType>(type: T | GraphQLNonNull<T>): GraphQLNonNull<T>;
/**
 * Determines whether the given type is one of the operation root types (query, mutation, subscription) of a schema
 */
export declare function isRootType(type: GraphQLType, schema: GraphQLSchema): boolean;
