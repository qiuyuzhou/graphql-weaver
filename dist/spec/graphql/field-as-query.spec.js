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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var field_as_query_1 = require("../../src/graphql/field-as-query");
describe('getFieldAsQuery', function () {
    var resolveInfo;
    var schema = new graphql_1.GraphQLSchema({
        query: new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: {
                field: {
                    type: new graphql_1.GraphQLObjectType({
                        name: 'Inner',
                        fields: {
                            str: {
                                type: graphql_1.GraphQLString,
                                args: {
                                    arg: {
                                        type: graphql_1.GraphQLString
                                    }
                                }
                            }
                        }
                    }),
                    resolve: function (a, b, c, info) {
                        resolveInfo = info;
                    }
                }
            }
        })
    });
    function query(str, variableValues) {
        if (variableValues === void 0) { variableValues = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var query, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolveInfo = undefined;
                        query = graphql_1.parse(str);
                        return [4 /*yield*/, graphql_1.execute(schema, query, {}, {}, variableValues)];
                    case 1:
                        res = _a.sent();
                        expect(res.errors).not.toBeDefined(JSON.stringify(res.errors));
                        expect(resolveInfo).toBeDefined('resolve was not called');
                        return [2 /*return*/, field_as_query_1.getFieldAsQuery(resolveInfo)];
                }
            });
        });
    }
    it('works with simple query', function () { return __awaiter(_this, void 0, void 0, function () {
        var result, operation, field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, query("{field{str}}")];
                case 1:
                    result = _a.sent();
                    operation = result.document.definitions[0];
                    expect(operation.kind).toBe('OperationDefinition');
                    field = operation.selectionSet.selections[0];
                    expect(field.kind).toBe('Field');
                    expect(field.name.value).toBe('str');
                    return [2 /*return*/];
            }
        });
    }); });
    it('works with fragments', function () { return __awaiter(_this, void 0, void 0, function () {
        var result, operation, field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, query("\n            fragment frag on Query {\n                field{str}\n            }\n            \n            {            \n                ...frag\n            }\n        ")];
                case 1:
                    result = _a.sent();
                    operation = result.document.definitions[0];
                    expect(operation.kind).toBe('OperationDefinition');
                    field = operation.selectionSet.selections[0];
                    expect(field.kind).toBe('Field');
                    expect(field.name.value).toBe('str');
                    return [2 /*return*/];
            }
        });
    }); });
    it('works with nested fragments', function () { return __awaiter(_this, void 0, void 0, function () {
        var result, operation, field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, query("\n            fragment frag1 on Query {\n                ...frag2\n            }\n        \n            fragment frag2 on Query {\n                field{str}\n            }\n\n            {\n                ...frag1\n            }\n        ")];
                case 1:
                    result = _a.sent();
                    operation = result.document.definitions[0];
                    expect(operation.kind).toBe('OperationDefinition');
                    field = operation.selectionSet.selections[0];
                    expect(field.kind).toBe('Field');
                    expect(field.name.value).toBe('str');
                    return [2 /*return*/];
            }
        });
    }); });
    it('passes through arguments and variables', function () { return __awaiter(_this, void 0, void 0, function () {
        var result, operation, field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, query("query($a: String) { field { str(arg: $a) } }", { a: 'abc' })];
                case 1:
                    result = _a.sent();
                    operation = result.document.definitions[0];
                    expect(operation.kind).toBe('OperationDefinition');
                    expect(operation.variableDefinitions[0].variable.name.value).toBe('a');
                    expect(operation.variableDefinitions[0].type.name.value).toEqual('String');
                    field = operation.selectionSet.selections[0];
                    expect(field.kind).toBe('Field');
                    expect(field.name.value).toBe('str');
                    expect(field.arguments[0].value.kind).toBe('Variable');
                    expect(field.arguments[0].value.name.value).toBe('a');
                    expect(result.variableValues.a).toBe('abc');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=field-as-query.spec.js.map