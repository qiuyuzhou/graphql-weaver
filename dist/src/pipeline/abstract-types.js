"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var graphql_1 = require("graphql");
var graphql_transformer_1 = require("graphql-transformer");
var language_utils_1 = require("../graphql/language-utils");
/**
 * Ensures that resolveType in abstract types works correctly
 */
var AbstractTypesModule = /** @class */ (function () {
    function AbstractTypesModule() {
    }
    AbstractTypesModule.prototype.transformSchema = function (schema) {
        var newSchema = graphql_transformer_1.transformSchema(schema, new TypeResolversTransformer());
        this.schema = schema;
        return newSchema;
    };
    AbstractTypesModule.prototype.transformQuery = function (query) {
        var typeInfo = new graphql_1.TypeInfo(this.schema);
        // To determine the concrete type of an abstract type, we need to fetch the __typename field.
        // This is necessary even if it was not originally requested, e.g. for fragment support.
        // In addition, it seems graphqljs calls resolveType() even if none of these conditions are met, just to complete values properly
        // If __typename was not requested, graphql will drop it (more precisely, it will just not select it for the result)
        var document = graphql_1.visit(query.document, graphql_1.visitWithTypeInfo(typeInfo, {
            SelectionSet: function (node) {
                var type = typeInfo.getType();
                if (!type) {
                    throw new Error("Failed to determine type of SelectionSet node");
                }
                if (!graphql_1.isAbstractType(graphql_1.getNamedType(type))) {
                    // only need __typename for abstract types
                    return undefined;
                }
                // this does not check if __typename is aliased in a fragment spread. That would cause a GraphQL error.
                // but seriously... nobody would do that. This saves the performance impact of traversing all fragment spreads
                var typenameRequest = node.selections.filter(function (sel) { return sel.kind == 'Field' && language_utils_1.getAliasOrName(sel) == '__typename'; })[0];
                if (typenameRequest) {
                    // make sure nothing else is requested as __typename
                    if (typenameRequest.name.value != '__typename') {
                        throw new Error("Fields must not be aliased to __typename because this is a reserved field.");
                    }
                    // __typename is requested, so no change needed
                    return undefined;
                }
                return __assign({}, node, { selections: node.selections.concat([
                        {
                            kind: 'Field',
                            name: {
                                kind: 'Name',
                                value: '__typename'
                            }
                        }
                    ]) });
            }
        }));
        return __assign({}, query, { document: document });
    };
    return AbstractTypesModule;
}());
exports.AbstractTypesModule = AbstractTypesModule;
/**
 * A transformer that adds type resolvers to abstract types. They will assume the __typename field is fetched and use
 * that to locate the concrete type.
 */
var TypeResolversTransformer = /** @class */ (function () {
    function TypeResolversTransformer() {
    }
    TypeResolversTransformer.prototype.transformObjectType = function (config) {
        return __assign({}, config, { isTypeOf: undefined });
    };
    // this could be one type declaration with a generic type, but waiting for object spread on generic types
    // https://github.com/Microsoft/TypeScript/issues/10727
    TypeResolversTransformer.prototype.transformInterfaceType = function (config, context) {
        return __assign({}, config, { resolveType: this.getResolver(config.name, context) });
    };
    ;
    TypeResolversTransformer.prototype.transformUnionType = function (config, context) {
        return __assign({}, config, { resolveType: this.getResolver(config.name, context) });
    };
    ;
    TypeResolversTransformer.prototype.getResolver = function (abstractTypeName, context) {
        var _this = this;
        return function (obj) { return __awaiter(_this, void 0, void 0, function () {
            var name, type;
            return __generator(this, function (_a) {
                if (!('__typename' in obj)) {
                    throw new Error("__typename does not exist on fetched object of abstract type " + abstractTypeName);
                }
                name = obj.__typename;
                type = context.findType(name);
                if (!type) {
                    throw new Error("__typename of abstract type " + abstractTypeName + " is set to " + JSON.stringify(name) + ", " +
                        "but there is no type with that name");
                }
                if (!(type instanceof graphql_1.GraphQLObjectType)) {
                    throw new Error("__typename of abstract type " + abstractTypeName + " is set to " + JSON.stringify(name) + ", " +
                        ("but that is a " + type.constructor.name + " and not a GraphQLObjectType."));
                }
                return [2 /*return*/, type];
            });
        }); };
    };
    return TypeResolversTransformer;
}());
//# sourceMappingURL=abstract-types.js.map