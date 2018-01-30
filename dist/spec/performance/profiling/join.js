"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var weave_schemas_1 = require("../../../src/weave-schemas");
var graphql_1 = require("graphql");
var graphql_tag_1 = require("graphql-tag");
var graphql_tools_1 = require("graphql-tools");
var execution_result_1 = require("../../../src/graphql/execution-result");
function createSchema(size) {
    var types = (_a = ["\n        type Query {\n            posts: [Post]\n            allUsers(filter: UserFilter): [User]\n        }\n\n        input UserFilter {\n            name_in: [String]\n        }\n\n        type Post {\n            id: ID\n            userName: String\n        }\n\n        type User {\n            name: String\n        }\n    "], _a.raw = ["\n        type Query {\n            posts: [Post]\n            allUsers(filter: UserFilter): [User]\n        }\n\n        input UserFilter {\n            name_in: [String]\n        }\n\n        type Post {\n            id: ID\n            userName: String\n        }\n\n        type User {\n            name: String\n        }\n    "], graphql_tag_1.default(_a));
    var posts = [];
    for (var i = 0; i < size; i++) {
        posts.push({ id: i, userName: 'user' + i });
    }
    var resolvers = {
        Query: {
            posts: function () { return posts; },
            allUsers: function (root, args, context) { return args.filter.name_in.map(function (name) { return ({ name: name }); }); }
        }
    };
    var schema = graphql_tools_1.makeExecutableSchema({ typeDefs: graphql_1.print(types), resolvers: resolvers });
    return weave_schemas_1.weaveSchemas({
        endpoints: [{
                schema: schema,
                fieldMetadata: {
                    'Post.userName': {
                        link: {
                            field: 'allUsers',
                            keyField: 'name',
                            batchMode: true,
                            linkFieldName: 'user',
                            argument: 'filter.name_in'
                        }
                    },
                    'Query.posts': {
                        join: {
                            linkField: 'userName'
                        }
                    }
                }
            }]
    });
    var _a;
}
var query = (_a = ["{ posts { user { name } } }"], _a.raw = ["{ posts { user { name } } }"], graphql_tag_1.default(_a));
function testJoin(size) {
    var schema;
    return {
        name: "join with " + size + " objects",
        fn: function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, graphql_1.graphql(schema, graphql_1.print(query), {}, {}, {})];
                        case 1:
                            result = _a.sent();
                            execution_result_1.assertSuccessfulResult(result);
                            return [2 /*return*/];
                    }
                });
            });
        },
        beforeAll: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createSchema(size)];
                        case 1:
                            schema = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    };
}
exports.JOIN_BENCHMARKS = [
    function () { return testJoin(10); },
    function () { return testJoin(1000); },
    function () { return testJoin(10000); },
];
var _a;
//# sourceMappingURL=join.js.map