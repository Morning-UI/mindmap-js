import * as G6 from '@antv/g6';
import { MindmapDataItem, MindmapNodeItem, MindmapCreateOptions } from '../interface';
export declare const traverseOneItem: (item: MindmapDataItem) => MindmapNodeItem;
export declare const create: (mindmap: any, options: MindmapCreateOptions) => G6.TreeGraph;
export declare const traverseData: (data: MindmapDataItem) => MindmapNodeItem;
export declare const register: (mindmap: any) => void;
export declare const bindEvent: (mindmap: any) => void;
export declare const manualPaint: (graph: G6.TreeGraph, paintCallback: Function) => void;
