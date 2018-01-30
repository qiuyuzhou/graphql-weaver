import { ExecutionResult } from 'graphql';
import { WeavingConfig } from '../../src/config/weaving-config';
/**
 * Creates a woven schema for a configuration and executes a query on it.
 * @param proxyConfig
 * @param query
 * @param variableValues
 * @returns {Promise<void>}
 */
export declare function testConfigWithQuery(proxyConfig: WeavingConfig, query: string, variableValues: {
    [name: string]: any;
}): Promise<ExecutionResult>;
