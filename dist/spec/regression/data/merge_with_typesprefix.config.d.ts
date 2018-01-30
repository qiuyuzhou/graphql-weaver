import { GraphQLSchema } from "graphql";
export declare function getConfig(): Promise<{
    endpoints: {
        schema: GraphQLSchema;
        typePrefix: string;
    }[];
}>;
