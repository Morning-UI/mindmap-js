import { Item, IBBox } from '@antv/g6/lib/types';
import { INode } from '@antv/g6/lib/interface/item';
import { IShape } from '@antv/g-base/lib/interfaces';
import { MindmapNodeItem } from '../interface';
export declare const getModel: (source: Item | INode) => MindmapNodeItem;
export declare const getBBox: (source: IShape) => IBBox;
