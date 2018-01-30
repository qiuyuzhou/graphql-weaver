import { ExtendedSchema, FieldMetadata } from './extended-schema';
/**
 * Merges multiple GraphQL schemas by merging the fields of root types (query, mutation, subscription).
 * Also takes care of extended field metadata
 */
export declare function mergeExtendedSchemas(...schemas: ExtendedSchema[]): ExtendedSchema;
export declare function mergeFieldMetadata(...metadatas: Map<string, FieldMetadata>[]): Map<string, FieldMetadata>;
