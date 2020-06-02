import * as G6                                  from '@antv/g6';
import {
    ShapeOptions,
}                                               from '@antv/g6/lib/interface/shape';
// import {
// }                                               from '@antv/g-canvas/lib/interfaces';
import {
    IShape,
    IElement,
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import GGroup                                   from '@antv/g-canvas/lib/group';
import {
    ShapeAttrs,
}                                               from '@antv/g-base';
import {
    ShapeStyle,
    TreeGraphData,
    NodeConfig,
}                                               from '@antv/g6/lib/types';
import {
    MindmapCore,
}                                               from '../index';

export interface MindmapCreateOptions {
    // 主容器
    $con: HTMLElement;

    // 画布容器
    $canvas: HTMLElement;

    // 文本输入容器
    $editor: HTMLElement;

    // 画布尺寸
    width?: number | string;
    height?: number | string;

    // 是否可拖拽
    draggable?: boolean;

    // 是否可缩放
    scalable?: boolean;

    // 是否显示背景网格
    backgroundGrid?: boolean;

    // 是否显示导航地图
    minimap?: boolean;

    // 节点垂直/水平间距
    nodeVGap?: number;
    nodeHGap?: number;

    // 最大显示的标签数
    maxShowTagNum?: number;

}

export interface MindmapInsideOptions extends MindmapCreateOptions {
    $editorInput: HTMLElement;
    $contextMenuLink: HTMLElement;
    $contextMenuNote: HTMLElement;
    $contextMenuTag: HTMLElement;
    $boxEditLink: HTMLElement;
    $boxEditNote: HTMLElement;
    $boxEditTag: HTMLElement;
}

export interface MindmapDataItem extends TreeGraphData {
    text?: string;
    link?: string;
    note?: string;
    tag?: string[];
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
    tagBgColor?: string;
    tagFontColor?: string;
    tagFontSize?: number;
    tagBorderWidth?: number;
    tagBorderColor?: string;
    tagBorderColorHover?: string;
    tagBorderRadius?: number;
    tagPaddingX?: number;
    tagPaddingY?: number;
    tagMarginLeft?: number;
    tagMarginTop?: number;
}

export interface MindShapeOptions extends ShapeOptions {}

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

export interface InitNodeTagsOptions {
    shapes: MindNodeShapes;
    mindmap: MindmapCore;
    cfg: MindmapNodeItem;
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

export interface StateChangeOptions {
    elements: MindNodeElements;
    cfg: MindmapNodeItem;
    states: string[];
    style: NodeStyle;
    group?: IGroup;
    mindmap?: MindmapCore;
}

export interface EventOptions {
    graph?: G6.TreeGraph;
    mindmap?: MindmapCore;
}

export enum EventNames {
    EditContentChange,
    ZoomChange,
}

export type EditContentChangeCallback = {
    (editContent: string): void;
}

export type ZoomChangeCallback = {
    (zoom: number): void;
}

export type EventCallbacks = EditContentChangeCallback | ZoomChangeCallback;

export type NodeAppendItem = {
    fontFamily?: string;
    fontSize?: number;
    fill?: string;
    textFill?: string;
    genText?: () => string;
}

export enum ContextMenuTypes {
    Link,
    Note,
    Tag,
}

export interface ShowContextMenuOptions {
    type: ContextMenuTypes;
    nodeId: string;
    x: number;
    y: number;
    data?: any;
}

export type NodeId = string | number;
export type NodeIds = NodeId[];

export type Constructor<T = {
    graph: G6.TreeGraph;
    _options: MindmapInsideOptions;
    contextNodeId: string;
    contextType: ContextMenuTypes;
    contextData: any;
    currentEditLinkNodeIds: NodeIds;
    currentEditNoteNodeIds: NodeIds;
    currentEditTagNodeIds: NodeIds;
    hideEditLink: Function;
    hideEditNote: Function;
}> = new (...args: any[]) => T;
