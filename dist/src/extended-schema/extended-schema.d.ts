import { GraphQLField, GraphQLObjectType, GraphQLSchema } from 'graphql';
export interface FieldMetadata {
    link?: LinkConfig;
    join?: JoinConfig;
}
export interface LinkConfig {
    /**
     * The field name on the target type that will be used to populate the link.
     *
     * @type {string}
     * @memberof LinkConfig
     */
    field: string;
    /**
     * The argument to use when requesting data from the target field.
     *
     * @type {string}
     * @memberof LinkConfig
     */
    argument: string;
    /**
     * When requesting mutiple items from a target field that supports an argument list set batchMode to "true" to submit all argument values in a single batch.
     *
     * @type {boolean}
     * @memberof LinkConfig
     */
    batchMode: boolean;
    /**
     * When using batchMode, you can set this to a field in the target type which will be compared against the key values to match target objects to the link locations. If omitted, the elements returned by the target fields are assumed to be in the same order as the keys given as argument value.
     *
     * @type {string}
     * @memberof LinkConfig
     */
    keyField?: string;
    /**
     * Disables the processing of this metaData. No links will be produced in the weaved schema.
     *
     * @type {boolean}
     * @memberof LinkConfig
     */
    ignore?: boolean;
    /**
     * Set to "true" to link this field to multiple target objects. The target field should accept one key as an argument and return a list of items. A linkFieldName is required to create a virtual field to contain the linked data. This cannot be combined with batchMode.
     *
     * @type {boolean}
     * @memberof LinkConfig
     */
    oneToMany?: boolean;
    /**
     * If specified, a new field with this name will be added with the target type. If not specified, the annotated field will be replaced with the link field. If creating a one-to-many link, this is required to create a virtual field to contain the linked list of data.
     *
     * @type {string}
     * @memberof LinkConfig
     */
    linkFieldName?: string;
}
export interface JoinConfig {
    linkField: string;
    ignore?: boolean;
}
/**
 * Holds metadata of a GraphQLSchema
 */
export declare class SchemaMetadata {
    readonly fieldMetadata: Map<string, FieldMetadata>;
    constructor(config?: {
        fieldMetadata?: Map<string, FieldMetadata>;
    });
    getFieldMetadata(type: string | GraphQLObjectType, field: string | GraphQLField<any, any>): FieldMetadata | undefined;
    private static getFieldKey(type, field);
}
export declare class ExtendedSchema {
    readonly schema: GraphQLSchema;
    readonly metadata: SchemaMetadata;
    constructor(schema: GraphQLSchema, metadata?: SchemaMetadata);
    getFieldMetadata(type: string | GraphQLObjectType, field: string | GraphQLField<any, any>): FieldMetadata | undefined;
    withSchema(schema: GraphQLSchema): ExtendedSchema;
    withMetadata(metadata: SchemaMetadata): ExtendedSchema;
    withFieldMetadata(fieldMetadata: Map<string, FieldMetadata>): ExtendedSchema;
    readonly fieldMetadata: Map<string, FieldMetadata>;
}
