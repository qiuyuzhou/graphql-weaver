import { PipelineModule } from './pipeline-module';
import { ExtendedSchema } from '../extended-schema/extended-schema';
/**
 * Adds the extended introspection field with the current extended schema information.
 *
 * If the extended introspection field already exists, it is overridden. Use this field at the very end of the pipeline
 * so that the correct schema is used.
 */
export declare class ExtendedIntrospectionModule implements PipelineModule {
    transformExtendedSchema(schema: ExtendedSchema): ExtendedSchema;
}
