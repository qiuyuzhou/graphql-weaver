import { EndpointInfo, PipelineConfig } from './pipeline-module';
import { ExtendedSchema } from '../extended-schema/extended-schema';
import { Query } from '../graphql/common';
import { WeavingErrorConsumer } from '../config/errors';
export declare class Pipeline {
    private readonly endpoints;
    private readonly preMergeModules;
    private readonly postMergeModules;
    private _schema;
    constructor(endpoints: EndpointInfo[], reportError: WeavingErrorConsumer, customConfig?: PipelineConfig);
    readonly schema: ExtendedSchema;
    private createSchema();
    processQuery(query: Query, endpointIdentifier: string): Query;
}
