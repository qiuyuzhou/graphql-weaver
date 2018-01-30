"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_http_test_endpoint_1 = require("../helpers/grapqhl-http-test/graphql-http-test-endpoint");
// to get through firewall
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
new graphql_http_test_endpoint_1.GraphQLHTTPTestEndpoint().start(1337);
//# sourceMappingURL=start-test-server.js.map