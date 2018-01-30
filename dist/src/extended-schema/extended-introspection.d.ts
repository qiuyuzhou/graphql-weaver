import { GraphQLObjectType } from 'graphql';
import { FieldMetadata, SchemaMetadata } from './extended-schema';
export declare const EXTENDED_INTROSPECTION_FIELD = "_extIntrospection";
export declare const EXTENDED_INTROSPECTION_TYPE_NAMES: {
    introspection: string;
    type: string;
    field: string;
    fieldMetadata: string;
    fieldLink: string;
    fieldJoin: string;
};
export interface ExtendedIntrospectionData {
    types: {
        name: string;
        fields: {
            name: string;
            metadata: FieldMetadata;
        }[];
    }[];
}
/**
 * Gets an object type to be used as a field called {@link EXTENDED_INTROSPECTION_FIELD} that exposes metadata in the
 * schema. The field value should be {@link ExtendedIntrospectionData}, as created by
 * {@link getExtendedIntrospectionData}
 */
export declare function getExtendedIntrospectionType(): GraphQLObjectType;
/**
 * Constructs the data for {@link getExtendedIntrospectionType()} from a SchemaMetadata
 */
export declare function getExtendedIntrospectionData(metadata: SchemaMetadata): ExtendedIntrospectionData;
/**
 * Builds a {@link SchemaMetadata} instance from the result of an extended introspection query
 * @param data
 */
export declare function buildSchemaMetadata(data: ExtendedIntrospectionData): SchemaMetadata;
