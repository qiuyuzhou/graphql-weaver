import { GraphQLEnumType, GraphQLInputObjectType, GraphQLObjectType } from 'graphql';
export declare namespace testTypes {
    const carType: GraphQLObjectType;
    const personType: GraphQLObjectType;
    const continentType: GraphQLEnumType;
    const countryType: GraphQLObjectType;
    const countryFilterType: GraphQLInputObjectType;
    const personFilterType: GraphQLInputObjectType;
    const personOrderType: GraphQLEnumType;
    const countryOrderType: GraphQLEnumType;
}
