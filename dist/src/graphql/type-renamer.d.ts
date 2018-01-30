import { GraphQLSchema } from 'graphql';
import { SchemaTransformer } from 'graphql-transformer';
/**
 * Creates a new schema that equals the given one but with all names of non-native types transformed by a custom callback
 */
export declare function renameTypes(schema: GraphQLSchema, typeNameTransformer: (typeName: string) => string): GraphQLSchema;
/**
 * A schema transform that renames all no-native types according to a simple provided function
 */
export declare class TypeRenamingTransformer implements SchemaTransformer {
    private typeNameTransformer;
    constructor(typeNameTransformer: (typeName: string) => string);
    transformEnumType: <T extends {
        name: string;
    }>(config: T) => T;
    transformInterfaceType: <T extends {
        name: string;
    }>(config: T) => T;
    transformObjectType: <T extends {
        name: string;
    }>(config: T) => T;
    transformScalarType: <T extends {
        name: string;
    }>(config: T) => T;
    transformUnionType: <T extends {
        name: string;
    }>(config: T) => T;
    transformInputObjectType: <T extends {
        name: string;
    }>(config: T) => T;
    transformDirective: <T extends {
        name: string;
    }>(config: T) => T;
    private rename<T>(config);
}
