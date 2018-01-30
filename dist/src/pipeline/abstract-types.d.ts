import { PipelineModule } from './pipeline-module';
import { DocumentNode, GraphQLSchema } from 'graphql';
import { Query } from '../graphql/common';
/**
 * Ensures that resolveType in abstract types works correctly
 */
export declare class AbstractTypesModule implements PipelineModule {
    private schema;
    transformSchema(schema: GraphQLSchema): GraphQLSchema;
    transformQuery(query: Query): {
        document: DocumentNode;
        variableValues: {
            [name: string]: any;
        };
    };
}
