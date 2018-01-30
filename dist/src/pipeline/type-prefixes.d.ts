import { PipelineModule } from './pipeline-module';
import { TypeRenamingTransformer } from '../graphql/type-renamer';
import { Query } from '../graphql/common';
/**
 * Adds endpoint-specific prefixes to all type names to avoid name collisions
 */
export declare class TypePrefixesModule implements PipelineModule {
    private readonly prefix;
    constructor(prefix: string);
    getSchemaTransformer(): TypeRenamingTransformer;
    transformQuery(query: Query): Query;
    private removeTypePrefix(name);
}
