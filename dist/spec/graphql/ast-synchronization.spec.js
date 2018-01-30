"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tag_1 = require("graphql-tag");
var graphql_1 = require("graphql");
var ast_synchronization_1 = require("../../src/graphql/ast-synchronization");
describe('findNodeInOtherDocument', function () {
    it('finds the node', function () {
        var ast = (_a = ["\n            {\n                # a comment to throw the lines off\n                someField(arg: { value: \"String\" }) { scalar }\n            }"], _a.raw = ["\n            {\n                # a comment to throw the lines off\n                someField(arg: { value: \"String\" }) { scalar }\n            }"], graphql_tag_1.default(_a));
        var node = ast.definitions[0].selectionSet.selections[0]
            .arguments[0].value.fields[0].value;
        var ast2 = graphql_1.parse(graphql_1.print(ast));
        var node2 = ast_synchronization_1.findNodeInOtherDocument(node, ast, ast2);
        expect(node2).toBeDefined();
        expect(node2.kind).toBe('StringValue');
        expect(node2).not.toBe(node);
        var _a;
    });
});
//# sourceMappingURL=ast-synchronization.spec.js.map