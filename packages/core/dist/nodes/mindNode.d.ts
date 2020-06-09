import { MindShapeOptions, MindNodeElements, MindmapNodeItem, MindmapCoreL0Type } from '../interface';
export declare const mindNodeAdjustPosition: (elements: MindNodeElements, cfg: MindmapNodeItem, mindmap: MindmapCoreL0Type) => void;
export declare const getMindNode: (mindmap: MindmapCoreL0Type) => MindShapeOptions;
export declare const NODE_SHAPE_INDEX: {
    [name: string]: number;
};
