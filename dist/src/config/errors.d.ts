import { CustomEndpointConfig, HttpEndpointConfig, LocalEndpointConfig } from './weaving-config';
/**
 * An error that occurred while weaving an endpoint
 */
export declare class WeavingError extends Error {
    readonly endpoint: HttpEndpointConfig | LocalEndpointConfig | CustomEndpointConfig | undefined;
    readonly originalError: Error | undefined;
    constructor(message: string, endpoint?: HttpEndpointConfig | LocalEndpointConfig | CustomEndpointConfig | undefined, originalError?: Error | undefined);
    /**
     * A human-readable name of the endpoint, as long one can be found
     * @returns {string}
     */
    readonly endpointName: string | undefined;
}
export declare type WeavingErrorConsumer = (error: WeavingError) => void;
export declare const throwingErrorConsumer: WeavingErrorConsumer;
