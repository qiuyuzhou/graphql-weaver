"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var node_at_location_1 = require("../../src/graphql/node-at-location");
describe('findNodeAtLocation', function () {
    it('finds node', function () {
        // would love to use gql tag, but it somehow manages parse without setting locations
        var ast = graphql_1.parse("\n            {\n                someField(arg: { value: \"String\" }) {\n                    scalar\n                }\n            }");
        var node = ast.definitions[0].selectionSet.selections[0]
            .arguments[0].value.fields[0].value;
        var location = node.loc.startToken;
        var foundNode = node_at_location_1.findNodeAtLocation(location, ast);
        expect(foundNode).toBeDefined();
        expect(foundNode.kind).toBe('StringValue');
    });
});
//# sourceMappingURL=node-at-location.spec.js.map