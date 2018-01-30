import { ASTNode, DocumentNode } from 'graphql';
/**
 * Given two equal documents, finds a node of one schema in the other schema
 * @param {ASTNode} needle
 * @param {DocumentNode} needleDocument the document which needle node
 * @param {DocumentNode} targetDocument the document of which to return the node matching needle
 */
export declare function findNodeInOtherDocument(needle: ASTNode, needleDocument: DocumentNode, targetDocument: DocumentNode): ASTNode | undefined;
