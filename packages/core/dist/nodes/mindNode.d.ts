import { MindmapCore } from '../index';
import { MindShapeOptions, MindNodeElements, MindmapNodeItem } from '../interface';
export declare const mindNodeAdjustPosition: (elements: MindNodeElements, cfg: MindmapNodeItem, mindmap: MindmapCore) => void;
export declare const getMindNode: (mindmap: MindmapCore) => MindShapeOptions;
export declare const NODE_SHAPE_INDEX: {
    [index: string]: number;
};
