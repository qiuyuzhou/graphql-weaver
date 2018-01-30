import { PipelineModule } from './pipeline-module';
import { GraphQLNamedFieldConfig, SchemaTransformer } from 'graphql-transformer';
/**
 * Throws GraphQL errors if FieldErrorValues are encountered.
 *
 * This complements moveErrorsIntoData().
 */
export declare class ErrorResolversModule implements PipelineModule {
    getSchemaTransformer(): ErrorResolversTransformer;
}
export declare class ErrorResolversTransformer implements SchemaTransformer {
    transformField(config: GraphQLNamedFieldConfig<any, any>): GraphQLNamedFieldConfig<any, any>;
}
