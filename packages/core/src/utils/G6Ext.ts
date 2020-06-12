import {
    TreeGraph,
}                                              from '@antv/g6';
import {
    Item,
    IBBox,
}                                               from '@antv/g6/lib/types';
import {
    INode,
    IGroup,
}                                               from '@antv/g6/lib/interface/item';
import {
    IShape,
}                                               from '@antv/g-base/lib/interfaces';
import {
    MindmapNodeItem,
    NodeId,
}                                               from '../interface';

export const getModel = (source: Item | INode): MindmapNodeItem => {

    return (source as INode).getModel() as MindmapNodeItem;

};

export const getBBox = (source: IShape | IGroup): IBBox => {

    return (source.getBBox()) as IBBox;

};

export const findNodeById = (graph: TreeGraph, id: NodeId): INode => {

    return graph.findById(id) as INode;

};
