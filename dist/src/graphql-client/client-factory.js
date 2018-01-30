"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_client_1 = require("./http-client");
var local_client_1 = require("./local-client");
var DefaultClientFactory = /** @class */ (function () {
    function DefaultClientFactory() {
    }
    DefaultClientFactory.prototype.getEndpoint = function (config) {
        if (isHttpEndpointConfig(config)) {
            return new http_client_1.HttpGraphQLClient({ url: config.url });
        }
        if (isLocalEndpointConfig(config)) {
            return new local_client_1.LocalGraphQLClient(config.schema);
        }
        if (isCustomEndpointConfig(config)) {
            return config.client;
        }
        throw new Error("Unsupported endpoint config");
    };
    return DefaultClientFactory;
}());
exports.DefaultClientFactory = DefaultClientFactory;
function isLocalEndpointConfig(config) {
    return 'schema' in config;
}
function isHttpEndpointConfig(config) {
    return 'url' in config;
}
function isCustomEndpointConfig(config) {
    return 'client' in config;
}
//# sourceMappingURL=client-factory.js.map