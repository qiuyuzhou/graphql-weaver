import { PipelineModule } from './pipeline-module';
import { ExtendedSchema } from '../extended-schema/extended-schema';
import { Query } from '../graphql/common';
import { WeavingErrorConsumer } from '../config/errors';
/**
 * Adds a feature to link fields to types of other endpoints
 */
export declare class LinksModule implements PipelineModule {
    private moduleConfig;
    private unlinkedSchema;
    private linkedSchema;
    private transformationInfo;
    constructor(moduleConfig: {
        reportError: WeavingErrorConsumer;
    });
    transformExtendedSchema(schema: ExtendedSchema): ExtendedSchema;
    /**
     * Replaces linked fields by scalar fields
     *
     * The resolver of the linked field will do the fetch of the linked object, so here we just need the scalar value
     */
    transformQuery(query: Query): Query;
}
