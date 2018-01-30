import { SchemaProvider } from "./schema-provider";
import { GraphQLSchema } from "graphql";
export declare class SchemaManager implements SchemaProvider {
    private currentSchema?;
    getSchema(): GraphQLSchema | undefined;
    private buildSchema(config);
}
