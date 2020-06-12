import { TreeGraph } from '@antv/g6';
import { Item, IBBox } from '@antv/g6/lib/types';
import { INode, IGroup } from '@antv/g6/lib/interface/item';
import { IShape } from '@antv/g-base/lib/interfaces';
import { MindmapNodeItem, NodeId } from '../interface';
export declare const getModel: (source: Item | INode) => MindmapNodeItem;
export declare const getBBox: (source: IShape | IGroup) => IBBox;
export declare const findNodeById: (graph: TreeGraph, id: NodeId) => INode;
