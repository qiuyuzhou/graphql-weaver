"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
function prefixGraphQLErrorPath(error, pathPrefix, removePrefixLength) {
    if (!(error instanceof graphql_1.GraphQLError) || !error.path) {
        return error;
    }
    var newPath = responsePathToArray(pathPrefix).concat(error.path.slice(removePrefixLength));
    return new graphql_1.GraphQLError(error.message, error.nodes, error.source, error.positions, newPath, error.originalError);
}
exports.prefixGraphQLErrorPath = prefixGraphQLErrorPath;
function responsePathToArray(path) {
    if (!path) {
        return [];
    }
    return responsePathToArray(path.prev).concat([
        path.key
    ]);
}
//# sourceMappingURL=error-paths.js.map