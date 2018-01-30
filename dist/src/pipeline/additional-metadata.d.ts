import { PipelineModule } from './pipeline-module';
import { ExtendedSchema } from '../extended-schema/extended-schema';
import { EndpointConfig } from '../config/weaving-config';
/**
 * Adds metadata specified within the endpoint configs to the extended schemas
 */
export declare class AdditionalMetadataModule implements PipelineModule {
    private readonly endpointConfig;
    constructor(endpointConfig: EndpointConfig);
    transformExtendedSchema(schema: ExtendedSchema): ExtendedSchema;
}
