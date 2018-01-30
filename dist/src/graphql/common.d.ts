import { DocumentNode } from 'graphql';
export declare type Query = {
    document: DocumentNode;
    variableValues: {
        [name: string]: any;
    };
};
