import * as G6 from '@antv/g6';
import { MindmapCreateOptions, MindmapCoreType } from '../interface';
export declare const create: (mindmap: MindmapCoreType, options: MindmapCreateOptions) => G6.TreeGraph;
export declare const register: (mindmap: MindmapCoreType) => void;
export declare const bindEvent: (mindmap: MindmapCoreType) => void;
export declare const manualPaint: (graph: G6.TreeGraph, paintCallback: Function) => void;
