import * as G6 from '@antv/g6';
import { ShapeOptions } from '@antv/g6/lib/interface/shape';
import { IShape, IElement, IGroup } from '@antv/g-base/lib/interfaces';
import GGroup from '@antv/g-canvas/lib/group';
import { ShapeAttrs } from '@antv/g-base';
import { ShapeStyle, TreeGraphData, NodeConfig } from '@antv/g6/lib/types';
import { default as MindmapCore } from '../index';
export interface MindmapCreateOptions {
    $con: HTMLElement;
    $canvas: HTMLElement;
    $editor: HTMLElement;
    width?: number | string;
    height?: number | string;
    draggable?: boolean;
    scalable?: boolean;
    backgroundGrid?: boolean;
    minimap?: boolean;
    nodeVGap?: number;
    nodeHGap?: number;
}
export interface MindmapInsideOptions extends MindmapCreateOptions {
    $editorInput: HTMLElement;
    $contextMenuLink: HTMLElement;
}
export interface MindmapDataItem extends TreeGraphData {
    text?: string;
    link?: string;
    children?: Array<MindmapDataItem>;
}
export interface MindmapNodeItem extends MindmapDataItem, NodeConfig {
    children?: (MindmapDataItem | MindmapNodeItem)[];
    id: string;
    anchorPoints?: number[][];
    style?: ShapeStyle;
    type?: string;
    _isRoot: boolean;
    _isNode: true;
}
export interface NodeStyle {
    outlineRadius?: number;
    outlinePadding?: number;
    bgColor?: string;
    radius?: number;
    fontSize?: number;
    fontColor?: string;
    fontWeight?: number;
    fontStyle?: ShapeAttrs['fontStyle'];
    borderColor?: string;
    borderWidth?: number;
    paddingX?: number;
    paddingY?: number;
    outlineColor?: string;
    outlineColorActive?: string;
    appendsPaddingX?: number;
    appendsPaddingY?: number;
    appendsMarginLeft?: number;
}
export interface MindShapeOptions extends ShapeOptions {
}
export interface InitNodeOptions {
    shapes: MindNodeShapes;
    mindmap: MindmapCore;
    cfg: MindmapNodeItem;
    group: GGroup;
    style: NodeStyle;
}
export interface InitNodeAppendsOptions {
    shapes: MindNodeShapes;
    appends: NodeAppendItem[];
    style: NodeStyle;
}
export interface AddShapeOptions {
    name: string;
    type: 'rect' | 'text';
    group: GGroup;
    shapes: MindNodeShapes;
    attrs: ShapeAttrs;
}
export interface AddGroupOptions {
    group: GGroup;
    shapes: MindNodeShapes;
    name: string;
    id: string;
}
export interface MindNodeShapes {
    [name: string]: IShape | IGroup;
}
export interface MindNodeElements {
    [name: string]: IElement;
}
export interface OutlineStateChangeOptions {
    elements: MindNodeElements;
    group: IGroup;
    states: string[];
    style: NodeStyle;
    mindmap: MindmapCore;
}
export interface LinkStateChangeOptions {
    appendElements: MindNodeElements;
    cfg: MindmapNodeItem;
    states: string[];
    style: NodeStyle;
}
export interface EventOptions {
    graph?: G6.TreeGraph;
    mindmap?: MindmapCore;
}
export declare enum EventNames {
    EditContentChange = 0,
    ZoomChange = 1
}
export declare type EditContentChangeCallback = {
    (editContent: string): void;
};
export declare type ZoomChangeCallback = {
    (zoom: number): void;
};
export declare type EventCallbacks = EditContentChangeCallback | ZoomChangeCallback;
export declare type NodeAppendItem = {
    fontFamily?: string;
    fontSize?: number;
    fill?: string;
    textFill?: string;
    genText?: () => string;
};
export declare enum ContextMenuTypes {
    Link = 0
}
export interface ShowContextMenuOptions {
    type: ContextMenuTypes;
    nodeId: string;
    x: number;
    y: number;
}
export declare type NodeIds = string | number | string[] | number[];
export declare type Constructor<T = {}> = new (...args: any[]) => T;
