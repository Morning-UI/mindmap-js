import { IG6GraphEvent, Item } from '@antv/g6/lib/types';
import { IElement } from '@antv/g-base/lib/interfaces';
import { MindmapNodeItem, NodeStyle, MindNodeShapes, MindNodeElements, NodeAppendItem, NodeIds } from '../interface';
export declare const genNodeStyles: (styles: NodeStyle, cfg: MindmapNodeItem) => NodeStyle;
export declare const inNodeShape: (mindmap: any, evt: IG6GraphEvent, element: IElement) => boolean;
export declare const getNodeElements: (item: Item) => MindNodeElements;
export declare const getAppends: (cfg: MindmapNodeItem) => NodeAppendItem[];
export declare const appendConGroupAdjustPosition: (shapes: MindNodeShapes, cfg: MindmapNodeItem) => void;
export declare const inAnnex: (mindmap: any, evt: IG6GraphEvent, shapeIndex: number) => boolean;
export declare const fillNodeIds: (nodeIds: NodeIds) => string[];
