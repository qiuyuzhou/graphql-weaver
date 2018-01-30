"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var LineColumnFinder = require("line-column");
function findNodeAtLocation(location, document) {
    var pos;
    var source;
    var nodeAtLocation = undefined;
    graphql_1.visit(document, {
        enter: function (node) {
            if (!node.loc) {
                return;
            }
            if (pos == undefined) {
                source = node.loc.source;
                pos = getPositionFromLocation(location, source);
                if (pos < 0) {
                    return graphql_1.BREAK; // not found
                }
            }
            else if (node.loc.source != source) {
                // found multiple sources - this is not supported
                return graphql_1.BREAK;
            }
            if (node.loc && node.loc.start >= pos) {
                // only return the node if not already past
                if (pos <= node.loc.end) {
                    nodeAtLocation = node;
                }
                return graphql_1.BREAK;
            }
        }
    });
    return nodeAtLocation;
}
exports.findNodeAtLocation = findNodeAtLocation;
function getPositionFromLocation(location, source) {
    return new LineColumnFinder(source.body).toIndex({
        line: location.line,
        col: location.column
    });
}
//# sourceMappingURL=node-at-location.js.map