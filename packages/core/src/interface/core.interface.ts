import * as G6                                  from '@antv/g6';
import {
    ShapeOptions,
}                                               from '@antv/g6/lib/interface/shape';
import {
    IShape,
    IElement,
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    ShapeCfg,
}                                               from '@antv/g-base/lib/types';
import GGroup                                   from '@antv/g-canvas/lib/group';
import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
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

    // 画布尺寸
    width?: number | string;
    height?: number | string;

    // 画布是否可拖拽
    draggable?: boolean;

    // 节点是否可拖拽
    nodeDraggable?: boolean;

    // 是否可缩放
    scalable?: boolean;

    // 是否可以批量选择
    brushSelectable?: boolean;

    // 是否显示背景网格
    backgroundGrid?: boolean;

    // 节点是否可以折叠
    foldable?: boolean;

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
    $canvas: HTMLElement;
    $editor: HTMLElement;
    $editorInput: HTMLElement;
    $contextMenuLink: HTMLElement;
    $contextMenuNote: HTMLElement;
    $contextMenuTag: HTMLElement;
    $boxEditLink: HTMLElement;
    $boxEditNote: HTMLElement;
    $boxEditTag: HTMLElement;
    $boxEditMark: HTMLElement;
}

export interface MindmapDataItem {
    text?: string;
    link?: string;
    note?: string;
    tag?: string[];
    mark?: MarkSet;
    children?: MindmapDataItem[];
    _isFolded?: boolean;
    _foldedChildren?: MindmapNodeItem[];
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

export type MindmapData = MindmapNodeItem | MindmapDataItem;
export type MindmapDatas = MindmapData[] | MindmapData;

export type MindmapDataItemGetter = {
    [key in keyof MindmapDataItem]: Function;
};

export interface NodeStyle {
    outlineRadius?: number;
    outlinePadding?: number;
    bgColor?: string;
    bgColorHover?: string;
    radius?: number;
    fontSize?: number;
    fontColor?: string;
    fontWeight?: number|string;
    fontStyle?: ShapeAttrs['fontStyle'];
    fontFamily?: string;
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
    markConPadding?: number;
    markConMarginRight?: number;
    markConGroupMarginRight?: number;
    markConBgColor?: string;
    markConBgColorHover?: string;
    markConBorderColor?: string;
    markConBorderColorHover?: string;
    markConRadius?: number;
    markMarginRight?: number;
    markIconBorder?: number;
    width?: number;
    height?: number;
    text?: string;
    textOffsetY?: number;
    FOLD_BTN_STYLE?: NodeStyle;
}

export interface MindShapeOptions extends ShapeOptions {}

export interface InitNodeOptions {
    shapes: MindNodeShapes;
    mindmap: MindmapCoreL0Type;
    cfg: MindmapNodeItem;
    group: GGroup;
    style: NodeStyle;
}

export interface InitFoldBtnOptions{
    shapes: MindNodeShapes;
    cfg: MindmapNodeItem;
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

export type GenMarkOptions = {
    markName: MindMarks;
    markType: keyof MindMarkTypes;
} & InitNodeTagsOptions;

export interface InitNodeMarksOptions {
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
export type BrushSelectBehaviorCfg = {
    includeEdges: boolean;
}

export type BehaviorEvents = {
    [key in G6Event]?: string;
}

export type DragOptions = {
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
}

export interface UpdateDelegateOptions {
    mindmap: MindmapCoreType;
    evt: IG6GraphEvent;
    dragOptions: DragOptions;
}

export type OriginPointType = {
    x: number;
    y: number;
    width: number;
    height: number;
    minX: number;
    minY: number;
};

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
export type MindmapCoreL2Ctor<T = MindmapCoreL2Type> = new (...args: any[]) => T;
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
    menuItemLinkEdit (): void;
    menuItemLinkDelete (): void;
    menuItemNoteEdit (): void;
    menuItemNoteDelete (): void;
    menuItemTagEdit (): void;
    menuItemTagDelete (): void;
    menuItemMarkChoose (evt: MouseEvent): void;
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
export interface GetFeatures {
    getAllSelectedNodeIds (): NodeId[];
    getAllSelectedNodeDetails (): MindmapDataItem[];
    getSelectedNodeId (): NodeId;
    getSelectedNodeDetail (): MindmapDataItem;
    getNodeDetail (nodeIds: NodeIds): MindmapDataItem|MindmapDataItem[];
}
export interface FoldFeatures {
    fold (nodeIds: NodeIds, fold: boolean): this;
    unfold (nodeIds: NodeIds): this;
}
export interface MarkFeatures {
    showEditMark (nodeIds: NodeIds, markType: MindMarkTypes): this;
    mark (nodeIds: NodeIds, mark: MindMarks): this;
    getCurrentEditMarkNodeIds (): NodeIds;
    hideEditMark (): this;
}
export type MindmapCoreL0Type = MindmapCoreBase;
export type MindmapCoreL1Type =
    MindmapCoreL0Type
    & GetFeatures
    & FoldFeatures
    & LinkFeatures
    & NoteFeatures
    & TagFeatures
    & MarkFeatures;

export type MindmapCoreL2Type =
    MindmapCoreL1Type
    & ContextMenuFeatures
    & NodeFeatures;

export type MindmapCoreType = MindmapCoreL2Type;

export type toggleNodeVisibilityCallback = (type: 'show'|'hide', model: MindmapNodeItem) => void;

export enum MindMarksTag {
    Red = 'red',
    Yellow = 'yellow',
    Blue = 'blue',
    Purple = 'purple',
    Green = 'green',
    Cyan = 'cyan',
    Gray = 'gray',
}
export enum MindMarksPriority {
    P1 = 'p1',
    P2 = 'p2',
    P3 = 'p3',
    P4 = 'p4',
    P5 = 'p5',
    P6 = 'p6',
    P7 = 'p7',
}
export enum MindMarksTask {
    Task0 = 'task0',
    Task18 = 'task18',
    Task14 = 'task14',
    Task38 = 'task38',
    Task12 = 'task12',
    Task58 = 'task58',
    Task34 = 'task34',
    Task78 = 'task78',
    Task1 = 'task1',
}
export enum MindMarksStar {
    StarRed = 'starRed',
    StarYellow = 'starYellow',
    StarBlue = 'starBlue',
    StarPurple = 'starPurple',
    StarGreen = 'starGreen',
    StarCyan = 'starCyan',
    StarGray = 'starGray',
}
export enum MindMarksFlag {
    FlagRed = 'flagRed',
    FlagYellow = 'flagYellow',
    FlagBlue = 'flagBlue',
    FlagPurple = 'flagPurple',
    FlagGreen = 'flagGreen',
    FlagCyan = 'flagCyan',
    FlagGray = 'flagGray',
}
export enum MindMarksPerson {
    PersonRed = 'personRed',
    PersonYellow = 'personYellow',
    PersonBlue = 'personBlue',
    PersonPurple = 'personPurple',
    PersonGreen = 'personGreen',
    PersonCyan = 'personCyan',
    PersonGray = 'personGray',
}
export const MindMarks = {
    ...MindMarksTag,
    ...MindMarksPriority,
    ...MindMarksTask,
    ...MindMarksStar,
    ...MindMarksFlag,
    ...MindMarksPerson,
};

export type MindMarks =
    MindMarksTag
    | MindMarksPriority
    | MindMarksTask
    | MindMarksStar
    | MindMarksFlag
    | MindMarksPerson;

export enum MindMarkTypes {
    Tag = 'tag',
    Priority = 'priority',
    Task = 'task',
    Star = 'star',
    Flag = 'flag',
    Person = 'person',
};

export type MarkSet = {
    [MindMarkTypes.Tag]?: MindMarksTag;
    [MindMarkTypes.Priority]?: MindMarksPriority;
    [MindMarkTypes.Task]?: MindMarksTask;
    [MindMarkTypes.Star]?: MindMarksStar;
    [MindMarkTypes.Flag]?: MindMarksFlag;
    [MindMarkTypes.Person]?: MindMarksPerson;
}

// export enum MindMarkValue {
//     /* eslint-disable prefer-template*/
//     Red = 'tag:' + MindMarksTag.Red,
//     Yellow = 'tag:' + MindMarksTag.Yellow,
//     Blue = 'tag:' + MindMarksTag.Blue,
//     Purple = 'tag:' + MindMarksTag.Purple,
//     Green = 'tag:' + MindMarksTag.Green,
//     Cyan = 'tag:' + MindMarksTag.Cyan,
//     Gray = 'tag:' + MindMarksTag.Gray,
//     /* eslint-enable prefer-template*/
// }

export type MarkBuilder = {
    [type in MindMarkTypes]: Function;
}

export type MarkElementBuilder = {
    [type in MindMarkTypes]:
        (marks:
            typeof MindMarksTag
            | typeof MindMarksPriority
            | typeof MindMarksTask
            | typeof MindMarksStar
            | typeof MindMarksFlag
            | typeof MindMarksPerson
        ) => Node[];
}

export type MarkShapeCfg = {
    con?: ShapeCfg;
    iconCon?: ShapeCfg;
    icon?: ShapeCfg;
    text: ShapeCfg;
};