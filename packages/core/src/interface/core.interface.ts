import * as G6                                  from '@antv/g6';
import {
    ShapeOptions,
}                                               from '@antv/g6/lib/interface/shape';
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
    G6Event,
    Item,
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    MindmapCoreBase,
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

    // 画布是否可拖拽
    draggable?: boolean;

    // 节点是否可拖拽
    nodeDraggable?: boolean;

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

    // 脑图方向
    direction?: 'LR';

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
    children?: MindmapDataItem[];
}

export interface MindmapNodeItem extends MindmapDataItem, NodeConfig {
    children?: (MindmapDataItem | MindmapNodeItem)[];

    id: string;
    anchorPoints?: number[][];
    style?: ShapeStyle;
    type?: string;
    _isRoot: boolean;
    _isNode: boolean;
    _isDragging: boolean;
    _isHolder: boolean;
}

export type MindmapData = MindmapNodeItem | MindmapDataItem;
export type MindmapDatas = MindmapData[] | MindmapData;

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
    borderDash?: number[];
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
    width?: number;
    height?: number;
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
    draggable?: boolean;
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
    states: string[];
    style: NodeStyle;
    cfg?: MindmapNodeItem;
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

export type EventList = {
    [EventNames.EditContentChange]?: EditContentChangeCallback[];
    [EventNames.ZoomChange]?: ZoomChangeCallback[];
};

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
export type NodeIds = NodeId[] | NodeId;

export type NodeDragBehaviorCfg = {
    dragOptions: DragOptions;
}

export type BehaviorEvents = {
    [key in G6Event]?: string;
}

export type DragOptions = {
    originX: number;
    originY: number;
    delegateShape: IShape;
    type?: 'unselect-single' | 'select';
    targets?: Item[];
    point?: {
        x: number;
        y: number;
    };
}

export interface UpdateDelegateOptions {
    mindmap: MindmapCore;
    evt: IG6GraphEvent;
    dragOptions: DragOptions;
}

export type DragTarget = {
    nodes: Item[];
    hidden: boolean;
    originNodeStyle: {
        [key: string]: any;
    };
    saveModel: {
        [key: string]: MindmapNodeItem;
    };
}

export type MindmapCoreL0Ctor<T = MindmapCoreBase> = new (...args: any[]) => T;
export type MindmapCoreL1Ctor<T = MindmapCoreL1Type> = new (...args: any[]) => T;
export interface LinkFeatures {
    showEditLink (nodeIds: NodeIds): this;
    hideEditLink (): this;
    getCurrentEditLinkNodeIds (): NodeIds;
    link (nodeIds: NodeIds, link: string): this;
    unlink (nodeIds: NodeIds): this;
}
export interface NoteFeatures {
    showEditNote (nodeIds: NodeIds): this;
    hideEditNote (): this;
    getCurrentEditNoteNodeIds (): NodeIds;
    note (nodeIds: NodeIds, note: string): this;
    unnote (nodeIds: NodeIds): this;
}
export interface TagFeatures {
    showEditTag (nodeIds: NodeIds): this;
    hideEditTag (): this;
    getCurrentEditTagNodeIds (): NodeIds;
    tag (nodeIds: NodeIds, tags: string[]|string): this;
    tagAdd (nodeIds: NodeIds, tags: string[]|string): this;
    untag (nodeIds: NodeIds, untags: string[]|string): this;
    untagByIndex (nodeIds: NodeIds, index: number): this;
}
export interface ContextMenuFeatures {
    showContextMenu (options: ShowContextMenuOptions): this;
    hideContextMenu (): this;
    hideAllContextMenu (): this;
    getContextNodeId (): string;
    getContextType (): ContextMenuTypes;
    getContextData (): any;
}
export interface NodeFeatures {
    removeNode (nodeIds: NodeIds, _refresh: boolean): this;
    insertSubNode (
        nodeId: NodeId,
        datas: MindmapDatas,
        index: number,
        _refresh: boolean,
    ): string | string[];
}
export type MindmapCoreL0Type = MindmapCoreBase;
export type MindmapCoreL1Type =
    MindmapCoreL0Type
    & LinkFeatures
    & NoteFeatures
    & TagFeatures;

export type MindmapCoreType =
    MindmapCoreL1Type
    & ContextMenuFeatures
    & NodeFeatures;

export type toggleNodeVisibilityCallback = (type: 'show'|'hide', model: MindmapNodeItem) => void;
