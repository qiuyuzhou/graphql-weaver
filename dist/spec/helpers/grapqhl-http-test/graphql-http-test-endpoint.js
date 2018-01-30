"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_http_test_schema_1 = require("./graphql-http-test-schema");
var graphql_server_1 = require("../server/graphql-server");
var GraphQLHTTPTestEndpoint = /** @class */ (function () {
    function GraphQLHTTPTestEndpoint() {
    }
    GraphQLHTTPTestEndpoint.prototype.start = function (port, schema) {
        if (!schema) {
            schema = graphql_http_test_schema_1.defaultTestSchema;
        }
        var schemaManager = {
            getSchema: function () { return schema; }
        };
        this.graphqlServer = new graphql_server_1.GraphQLServer({
            schemaProvider: schemaManager,
            port: port
        });
    };
    GraphQLHTTPTestEndpoint.prototype.stop = function () {
        this.graphqlServer.stop();
    };
    return GraphQLHTTPTestEndpoint;
}());
exports.GraphQLHTTPTestEndpoint = GraphQLHTTPTestEndpoint;
//# sourceMappingURL=graphql-http-test-endpoint.js.map