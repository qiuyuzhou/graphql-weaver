"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var cors = require("cors");
var graphql_server_express_1 = require("graphql-server-express");
var GraphQLServer = /** @class */ (function () {
    function GraphQLServer(config) {
        var _this = this;
        this.config = config;
        var app = express();
        app.use(cors());
        app.get('/', function (req, res) { res.redirect('/graphiql'); });
        app.use('/graphql', bodyParser.json(), graphql_server_express_1.graphqlExpress(function () { return _this.getGraphQLOptions(); }));
        app.use('/graphiql', graphql_server_express_1.graphiqlExpress({ endpointURL: '/graphql' }));
        this.server = app.listen(config.port, function () {
            console.log("GraphQL server started on http://localhost:" + config.port + ".");
        });
    }
    GraphQLServer.prototype.stop = function () {
        if (this.server) {
            this.server.close();
            console.log('GraphQL server stopped.');
        }
    };
    GraphQLServer.prototype.getGraphQLOptions = function () {
        var schema = this.config.schemaProvider.getSchema();
        if (!schema) {
            throw new Error('Schema is not yet built, see console output for errors in the model');
        }
        return {
            schema: schema,
            context: {} // unique token
        };
    };
    return GraphQLServer;
}());
exports.GraphQLServer = GraphQLServer;
//# sourceMappingURL=graphql-server.js.map