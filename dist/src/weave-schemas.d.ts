import { WeavingConfig } from './config/weaving-config';
import { GraphQLSchema } from 'graphql';
import { Pipeline } from './pipeline/pipeline';
import { WeavingErrorConsumer } from './config/errors';
import { WeavingResult } from './weaving-result';
export declare function weaveSchemas(config: WeavingConfig): Promise<GraphQLSchema>;
/**
 * Weaves schemas according to a config. If only recoverable errors occurred, these are reported in the result.
 */
export declare function weaveSchemasExt(config: WeavingConfig): Promise<WeavingResult>;
export declare function createPipeline(config: WeavingConfig, errorConsumer?: WeavingErrorConsumer): Promise<Pipeline>;
