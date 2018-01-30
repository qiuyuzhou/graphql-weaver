"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var utils_1 = require("../../src/utils/utils");
var testTypes;
(function (testTypes) {
    testTypes.carType = new graphql_1.GraphQLObjectType({
        name: 'Car',
        fields: {
            color: { type: graphql_1.GraphQLString },
            doorCount: { type: graphql_1.GraphQLInt }
        }
    });
    testTypes.personType = new graphql_1.GraphQLObjectType({
        name: 'Person',
        fields: {
            name: { type: graphql_1.GraphQLString },
            isCool: { type: graphql_1.GraphQLBoolean },
            nationality: { type: graphql_1.GraphQLString },
        }
    });
    var continents = ['Europe', 'NorthAmerica', 'SouthAmerica', 'Asia', 'Australia', 'Antarctica', 'Africa'];
    testTypes.continentType = new graphql_1.GraphQLEnumType({
        name: 'Continent',
        values: utils_1.objectFromKeys(continents, function (key) { return ({}); })
    });
    testTypes.countryType = new graphql_1.GraphQLObjectType({
        name: 'Country',
        fields: {
            id: { type: graphql_1.GraphQLID },
            identCode: { type: graphql_1.GraphQLString },
            isoCode: { type: graphql_1.GraphQLString },
            description: { type: graphql_1.GraphQLString },
            continent: { type: testTypes.continentType }
        }
    });
    testTypes.countryFilterType = new graphql_1.GraphQLInputObjectType({
        name: 'CountryFilter',
        fields: {
            identCode_in: { type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)) },
            continent: { type: testTypes.continentType }
        },
    });
    testTypes.personFilterType = new graphql_1.GraphQLInputObjectType({
        name: 'PersonFilter',
        fields: {
            isCool: { type: graphql_1.GraphQLBoolean }
        },
    });
    testTypes.personOrderType = createOrderByType('Person', ['name', 'isCool']);
    testTypes.countryOrderType = createOrderByType('Country', ['isoCode', 'description', 'continent']);
})(testTypes = exports.testTypes || (exports.testTypes = {}));
function createOrderByType(typeName, fields) {
    return new graphql_1.GraphQLEnumType({
        name: typeName + "OrderBy",
        values: utils_1.objectFromKeys(utils_1.flatMap(fields, function (field) { return [field + '_ASC', field + '_DESC']; }), function (key) { return ({}); }),
    });
}
//# sourceMappingURL=test-types.js.map