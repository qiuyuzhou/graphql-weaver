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
var fs = require("fs-extra");
var path = require("path");
var test_types_1 = require("../test-types");
var allCountries = getAllCountries();
var allCountriesLargeList = getAllCountriesTimes(10000);
var allPeople = getAllPeople();
function comparator(orderBy) {
    var dir;
    var field;
    if (orderBy.endsWith('_ASC')) {
        field = orderBy.substr(0, orderBy.length - '_ASC'.length);
        dir = 1;
    }
    else if (orderBy.endsWith('_DESC')) {
        field = orderBy.substr(0, orderBy.length - '_DESC'.length);
        dir = -1;
    }
    else {
        return function () { return 0; };
    }
    function compareAsc(lhs, rhs) {
        var lhsValue = lhs[field];
        var rhsValue = rhs[field];
        if (lhsValue == null && rhsValue != null) {
            return -1;
        }
        if (rhsValue == null && lhsValue != null) {
            return 1;
        }
        if (lhsValue < rhsValue) {
            return -1;
        }
        if (lhsValue > rhsValue) {
            return 1;
        }
        return 0;
    }
    return function (lhs, rhs) { return compareAsc(lhs, rhs) * dir; };
}
exports.defaultTestSchema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: {
            allCountries: {
                type: new graphql_1.GraphQLList(test_types_1.testTypes.countryType),
                resolve: function (obj, args) { return __awaiter(_this, void 0, void 0, function () {
                    var countries, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!args.useLargeList) return [3 /*break*/, 2];
                                return [4 /*yield*/, allCountriesLargeList];
                            case 1:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, allCountries];
                            case 3:
                                _a = _b.sent();
                                _b.label = 4;
                            case 4:
                                countries = _a;
                                if (args.filter && args.filter.identCode_in) {
                                    countries = countries.filter(function (country) { return args.filter.identCode_in.includes(country.identCode); });
                                }
                                if (args.filter && args.filter.continent) {
                                    countries = countries.filter(function (country) { return args.filter.continent == country.continent; });
                                }
                                if (args.orderBy) {
                                    countries = countries.slice().sort(comparator(args.orderBy));
                                }
                                if (args.first) {
                                    countries = countries.slice(0, args.first /* exclusive end */);
                                }
                                if (args.last) {
                                    countries = countries.slice(countries.length - args.last);
                                }
                                return [2 /*return*/, countries];
                        }
                    });
                }); },
                args: {
                    filter: { type: test_types_1.testTypes.countryFilterType },
                    orderBy: { type: test_types_1.testTypes.countryOrderType },
                    last: { type: graphql_1.GraphQLInt },
                    first: { type: graphql_1.GraphQLInt },
                    useLargeList: { type: graphql_1.GraphQLBoolean }
                }
            },
            Country: {
                type: test_types_1.testTypes.countryType,
                resolve: function (obj, args) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!args.id) return [3 /*break*/, 3];
                                _a = objectById;
                                _b = [args.id];
                                return [4 /*yield*/, allCountries];
                            case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                            case 2: return [2 /*return*/, _c.sent()];
                            case 3:
                                if (!args.identCode) return [3 /*break*/, 5];
                                return [4 /*yield*/, countryByIdentCode(args.identCode)];
                            case 4: return [2 /*return*/, _c.sent()];
                            case 5: return [2 /*return*/, undefined];
                        }
                    });
                }); },
                args: {
                    identCode: { type: graphql_1.GraphQLString },
                    id: { type: graphql_1.GraphQLString }
                }
            },
            allPeople: {
                type: new graphql_1.GraphQLList(test_types_1.testTypes.personType),
                resolve: function (obj, args) { return __awaiter(_this, void 0, void 0, function () {
                    var people;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, allPeople];
                            case 1:
                                people = _a.sent();
                                if (args.nationality) {
                                    people = people.filter(function (p) { return p.nationality === args.nationality; });
                                }
                                if (args.filter && args.filter.isCool != undefined) {
                                    people = people.filter(function (person) { return args.filter.isCool === person.isCool; });
                                }
                                if (args.orderBy) {
                                    people = people.slice().sort(comparator(args.orderBy));
                                }
                                if (args.first) {
                                    people = people.slice(0, args.first /* exclusive end */);
                                }
                                if (args.last) {
                                    people = people.slice(people.length - args.last);
                                }
                                return [2 /*return*/, people];
                        }
                    });
                }); },
                args: {
                    filter: { type: test_types_1.testTypes.personFilterType },
                    orderBy: { type: test_types_1.testTypes.personOrderType },
                    last: { type: graphql_1.GraphQLInt },
                    first: { type: graphql_1.GraphQLInt },
                    nationality: { type: graphql_1.GraphQLString }
                }
            }
        }
    })
});
function objectById(id, objects) {
    return objects.filter(function (value) { return value.id == id; })[0];
}
function countryByIdentCode(identCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, allCountries];
                case 1: return [2 /*return*/, (_a.sent()).filter(function (value) { return value.identCode === identCode; })[0]];
            }
        });
    });
}
function getAllCountries() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readTestDataFromJson('countries.json')];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getAllCountriesTimes(n) {
    return __awaiter(this, void 0, void 0, function () {
        var countries, single, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    countries = [];
                    return [4 /*yield*/, getAllCountries()];
                case 1:
                    single = _a.sent();
                    for (i = 0; i < n; i++) {
                        countries.push.apply(countries, single);
                    }
                    return [2 /*return*/, countries];
            }
        });
    });
}
// async function allDeliveries() { return await readTestDataFromJson('deliveries.json') }
function getAllPeople() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readTestDataFromJson('people.json')];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function readTestDataFromJson(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFile(path.resolve(__dirname, filename), 'utf-8')];
                case 1:
                    json = _a.sent();
                    return [2 /*return*/, JSON.parse(json).data];
            }
        });
    });
}
//# sourceMappingURL=graphql-http-test-schema.js.map