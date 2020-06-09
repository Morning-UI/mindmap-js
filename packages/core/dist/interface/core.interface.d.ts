import * as G6 from '@antv/g6';
import { ShapeOptions } from '@antv/g6/lib/interface/shape';
import { IShape, IElement, IGroup } from '@antv/g-base/lib/interfaces';
import GGroup from '@antv/g-canvas/lib/group';
import { ShapeAttrs } from '@antv/g-base';
import { ShapeStyle, TreeGraphData, NodeConfig, G6Event, Item, IG6GraphEvent } from '@antv/g6/lib/types';
import { MindmapCoreBase } from '../index';
export interface MindmapCreateOptions {
    $con: HTMLElement;
    width?: number | string;
    height?: number | string;
    draggable?: boolean;
    nodeDraggable?: boolean;
    scalable?: boolean;
    brushSelectable?: boolean;
    backgroundGrid?: boolean;
    minimap?: boolean;
    nodeVGap?: number;
    nodeHGap?: number;
    maxShowTagNum?: number;
    direction?: 'LR';
}
export interface MindmapInsideOptions extends MindmapCreateOptions {
    $canvas: HTMLElement;
    $editor: HTMLElement;
    $editorInput: HTMLElement;
    $contextMenuLink: HTMLElement;
    $contextMenuNote: HTMLElement;
    $contextMenuTag: HTMLElement;
    $boxEditLink: HTMLElement;
    $boxEditNote: HTMLElement;
    $boxEditTag: HTMLElement;
}
export interface MindmapDataItem {
    text?: string;
    link?: string;
    note?: string;
    tag?: string[];
    children?: MindmapDataItem[];
}
export interface MindmapNodeItem extends MindmapDataItem, TreeGraphData, NodeConfig {
    children?: MindmapNodeItem[];
    _originChildren?: MindmapDataItem[];
    id: string;
    anchorPoints?: number[][];
    style?: ShapeStyle;
    type?: string;
    _isRoot: boolean;
    _isNode: boolean;
    _isDragging: boolean;
    _isHolder: boolean;
}
export declare type MindmapData = MindmapNodeItem | MindmapDataItem;
export declare type MindmapDatas = MindmapData[] | MindmapData;
export declare type MindmapDataItemGetter = {
    [key in keyof MindmapDataItem]: Function;
};
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
export interface MindShapeOptions extends ShapeOptions {
}
export interface InitNodeOptions {
    shapes: MindNodeShapes;
    mindmap: MindmapCoreL0Type;
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
    mindmap: MindmapCoreL0Type;
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
    mindmap?: MindmapCoreL0Type;
}
export interface EventOptions {
    graph?: G6.TreeGraph;
    mindmap?: MindmapCoreType;
}
export declare enum EventNames {
    EditContentChange = 0,
    ZoomChange = 1
}
export declare type EventList = {
    [EventNames.EditContentChange]?: EditContentChangeCallback[];
    [EventNames.ZoomChange]?: ZoomChangeCallback[];
};
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
    Link = 0,
    Note = 1,
    Tag = 2
}
export interface ShowContextMenuOptions {
    type: ContextMenuTypes;
    nodeId: string;
    x: number;
    y: number;
    data?: any;
}
export declare type NodeId = string | number;
export declare type NodeIds = NodeId[] | NodeId;
export declare type NodeDragBehaviorCfg = {
    dragOptions: DragOptions;
};
export declare type BrushSelectBehaviorCfg = {
    includeEdges: boolean;
};
export declare type BehaviorEvents = {
    [key in G6Event]?: string;
};
export declare type DragOptions = {
    originX: number;
    originY: number;
    originPoint: OriginPointType;
    delegateShape: IShape;
    type?: 'unselect-single' | 'select';
    targets?: Item[];
    point?: {
        x: number;
        y: number;
    };
};
export interface UpdateDelegateOptions {
    mindmap: MindmapCoreType;
    evt: IG6GraphEvent;
    dragOptions: DragOptions;
}
export declare type OriginPointType = {
    x: number;
    y: number;
    width: number;
    height: number;
    minX: number;
    minY: number;
};
export declare type DragTarget = {
    nodes: Item[];
    hidden: boolean;
    originNodeStyle: {
        [key: string]: any;
    };
    saveModel: {
        [key: string]: MindmapNodeItem;
    };
};
export declare type MindmapCoreL0Ctor<T = MindmapCoreBase> = new (...args: any[]) => T;
export declare type MindmapCoreL1Ctor<T = MindmapCoreL1Type> = new (...args: any[]) => T;
export declare type MindmapCoreL2Ctor<T = MindmapCoreL2Type> = new (...args: any[]) => T;
export interface LinkFeatures {
    showEditLink(nodeIds: NodeIds): this;
    hideEditLink(): this;
    getCurrentEditLinkNodeIds(): NodeIds;
    link(nodeIds: NodeIds, link: string): this;
    unlink(nodeIds: NodeIds): this;
}
export interface NoteFeatures {
    showEditNote(nodeIds: NodeIds): this;
    hideEditNote(): this;
    getCurrentEditNoteNodeIds(): NodeIds;
    note(nodeIds: NodeIds, note: string): this;
    unnote(nodeIds: NodeIds): this;
}
export interface TagFeatures {
    showEditTag(nodeIds: NodeIds): this;
    hideEditTag(): this;
    getCurrentEditTagNodeIds(): NodeIds;
    tag(nodeIds: NodeIds, tags: string[] | string): this;
    tagAdd(nodeIds: NodeIds, tags: string[] | string): this;
    untag(nodeIds: NodeIds, untags: string[] | string): this;
    untagByIndex(nodeIds: NodeIds, index: number): this;
}
export interface ContextMenuFeatures {
    showContextMenu(options: ShowContextMenuOptions): this;
    hideContextMenu(): this;
    hideAllContextMenu(): this;
    getContextNodeId(): string;
    getContextType(): ContextMenuTypes;
    getContextData(): any;
    menuItemLinkEdit(): void;
    menuItemLinkDelete(): void;
    menuItemNoteEdit(): void;
    menuItemNoteDelete(): void;
    menuItemTagEdit(): void;
    menuItemTagDelete(): void;
}
export interface NodeFeatures {
    removeNode(nodeIds: NodeIds, _refresh: boolean): this;
    insertSubNode(nodeId: NodeId, datas: MindmapDatas, index: number, _refresh: boolean): string | string[];
}
export interface GetFeatures {
    getAllSelectedNodeIds(): NodeId[];
    getAllSelectedNodeDetails(): MindmapDataItem[];
    getSelectedNodeId(): NodeId;
    getSelectedNodeDetail(): MindmapDataItem;
    getNodeDetail(nodeIds: NodeIds): MindmapDataItem | MindmapDataItem[];
}
export declare type MindmapCoreL0Type = MindmapCoreBase;
export declare type MindmapCoreL1Type = MindmapCoreL0Type & GetFeatures & LinkFeatures & NoteFeatures & TagFeatures;
export declare type MindmapCoreL2Type = MindmapCoreL1Type & ContextMenuFeatures & NodeFeatures;
export declare type MindmapCoreType = MindmapCoreL2Type;
export declare type toggleNodeVisibilityCallback = (type: 'show' | 'hide', model: MindmapNodeItem) => void;
