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
var graphql_1 = require("graphql");
var error_handling_1 = require("../../../src/config/error-handling");
function getConfig() {
    return __awaiter(this, void 0, void 0, function () {
        function isNiceName(str) {
            return str.match(/^[a-zA-Z]+$/);
        }
        var nameType, wifeType;
        return __generator(this, function (_a) {
            nameType = new graphql_1.GraphQLScalarType({
                name: 'Name',
                parseValue: function (value) {
                    if (typeof value != 'string' || !isNiceName(value)) {
                        throw new TypeError("I don't like this name: " + value);
                    }
                    return value;
                },
                serialize: function (value) {
                    if (typeof value != 'string' || !isNiceName(value)) {
                        throw new TypeError("I don't like this name: " + value);
                    }
                    return value;
                },
                parseLiteral: function (valueNode) {
                    if (valueNode.kind == 'StringValue' && isNiceName(valueNode.value)) {
                        return valueNode.value;
                    }
                    return null;
                }
            });
            wifeType = new graphql_1.GraphQLObjectType({
                name: 'Wife',
                fields: {
                    name: {
                        type: graphql_1.GraphQLString
                    },
                    husband: {
                        type: graphql_1.GraphQLString,
                    }
                }
            });
            return [2 /*return*/, {
                    endpoints: [
                        {
                            namespace: 'ns1',
                            typePrefix: 'Ns1',
                            schema: new graphql_1.GraphQLSchema({
                                query: new graphql_1.GraphQLObjectType({
                                    name: 'Query',
                                    fields: {
                                        horst: {
                                            type: new graphql_1.GraphQLObjectType({
                                                name: 'Person',
                                                fields: {
                                                    name: {
                                                        type: graphql_1.GraphQLString,
                                                        resolve: function () { return 'Horst'; }
                                                    },
                                                    age: {
                                                        type: graphql_1.GraphQLInt,
                                                        resolve: function () { throw new Error('horst age not available'); }
                                                    },
                                                    validateName: {
                                                        type: graphql_1.GraphQLBoolean,
                                                        resolve: function () { return true; },
                                                        args: {
                                                            name: {
                                                                type: nameType
                                                            }
                                                        }
                                                    }
                                                }
                                            }),
                                            args: {
                                                name: {
                                                    type: nameType
                                                }
                                            },
                                            resolve: function () { return ({}); }
                                        },
                                        horstByNameBroken: {
                                            type: new graphql_1.GraphQLList(new graphql_1.GraphQLObjectType({
                                                name: 'HorstByNameBroken',
                                                fields: {
                                                    name: {
                                                        type: graphql_1.GraphQLString,
                                                        resolve: function () { return 'Horst'; }
                                                    },
                                                }
                                            })),
                                            args: {
                                                name: {
                                                    type: new graphql_1.GraphQLList(nameType)
                                                }
                                            },
                                            resolve: function () { throw new Error('No horst by name'); }
                                        },
                                        horstByName: {
                                            type: new graphql_1.GraphQLList(new graphql_1.GraphQLObjectType({
                                                name: 'HorstByName',
                                                fields: {
                                                    name: {
                                                        type: graphql_1.GraphQLString,
                                                        resolve: function () { throw new Error('No name for this horst'); }
                                                    },
                                                }
                                            })),
                                            args: {
                                                name: {
                                                    type: new graphql_1.GraphQLList(nameType)
                                                }
                                            },
                                            resolve: function () { return [{}, {}]; }
                                        },
                                    }
                                })
                            })
                        },
                        {
                            namespace: 'ns2',
                            typePrefix: 'Ns2',
                            schema: new graphql_1.GraphQLSchema({
                                query: new graphql_1.GraphQLObjectType({
                                    name: 'Query',
                                    fields: {
                                        greta: {
                                            type: wifeType,
                                            resolve: function () { return ({ name: 'Greta', husband: 'Horst' }); }
                                        },
                                        lisa: {
                                            type: wifeType,
                                            resolve: function () { return ({ name: 'Lisa', husband: 'Hans-Joachim' }); }
                                        },
                                        gretaLinkBroken: {
                                            type: new graphql_1.GraphQLObjectType({
                                                name: 'GretaLinkBroken',
                                                fields: {
                                                    name: {
                                                        type: graphql_1.GraphQLString // need string here instead of name because we want this resolver *not* to fail when returning the bad names
                                                    },
                                                    husband: {
                                                        type: nameType
                                                    },
                                                }
                                            }),
                                            resolve: function () { return ({ name: 'Greta', husband: 'Horst' }); }
                                        },
                                        gretaKeyBroken: {
                                            type: new graphql_1.GraphQLObjectType({
                                                name: 'GretaKeyBroken',
                                                fields: {
                                                    name: {
                                                        type: graphql_1.GraphQLString
                                                    },
                                                    husband: {
                                                        type: nameType
                                                    },
                                                }
                                            }),
                                            resolve: function () { return ({ name: 'Greta', husband: 'Horst' }); }
                                        }
                                    }
                                })
                            }),
                            fieldMetadata: {
                                'Wife.husband': {
                                    link: {
                                        field: 'ns1.horst',
                                        argument: 'name',
                                        batchMode: false
                                    }
                                },
                                'GretaLinkBroken.husband': {
                                    link: {
                                        field: 'ns1.horstByNameBroken',
                                        argument: 'name',
                                        batchMode: true,
                                        keyField: 'name'
                                    }
                                },
                                'GretaKeyBroken.husband': {
                                    link: {
                                        field: 'ns1.horstByName',
                                        argument: 'name',
                                        batchMode: true,
                                        keyField: 'name'
                                    }
                                }
                            }
                        }
                    ],
                    errorHandling: error_handling_1.WeavingErrorHandlingMode.CONTINUE_AND_REPORT_IN_SCHEMA
                }];
        });
    });
}
exports.getConfig = getConfig;
//# sourceMappingURL=errors-in-link.config.js.map