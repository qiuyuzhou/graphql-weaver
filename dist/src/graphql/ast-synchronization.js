"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
/**
 * Given two equal documents, finds a node of one schema in the other schema
 * @param {ASTNode} needle
 * @param {DocumentNode} needleDocument the document which needle node
 * @param {DocumentNode} targetDocument the document of which to return the node matching needle
 */
function findNodeInOtherDocument(needle, needleDocument, targetDocument) {
    var numberOfVisitsInDoc1 = 0;
    var foundNeedle = false;
    graphql_1.visit(needleDocument, {
        enter: function (node) {
            if (node == needle) {
                foundNeedle = true;
                return graphql_1.BREAK;
            }
            numberOfVisitsInDoc1++;
        }
    });
    if (!foundNeedle) {
        return undefined;
    }
    var matchingNode = undefined;
    var numberOfVisitsInDoc2 = 0;
    graphql_1.visit(targetDocument, {
        enter: function (node) {
            if (numberOfVisitsInDoc2 == numberOfVisitsInDoc1) {
                matchingNode = node;
                return graphql_1.BREAK;
            }
            numberOfVisitsInDoc2++;
        }
    });
    // sanity check
    // type assertion needed because of https://github.com/Microsoft/TypeScript/issues/9998
    if (matchingNode && matchingNode.kind != needle.kind) {
        return undefined;
    }
    return matchingNode;
}
exports.findNodeInOtherDocument = findNodeInOtherDocument;
//# sourceMappingURL=ast-synchronization.js.map