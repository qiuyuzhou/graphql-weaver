"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Walks a response path as given in GraphQLResolveInfo.path and collects the aliases from root to leaf
 *
 * List types are not supported
 * @param path
 * @returns {string[]}
 */
function collectAliasesInResponsePath(path) {
    var aliases = [];
    var entry = path;
    while (entry) {
        if (typeof entry.key == 'number') {
            throw new Error("List types around proxy fields not supported");
        }
        aliases.unshift(entry.key);
        entry = entry.prev;
    }
    return aliases;
}
exports.collectAliasesInResponsePath = collectAliasesInResponsePath;
//# sourceMappingURL=resolver-utils.js.map