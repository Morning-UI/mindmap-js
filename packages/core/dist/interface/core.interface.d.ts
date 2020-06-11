import * as G6 from '@antv/g6';
import { ShapeOptions } from '@antv/g6/lib/interface/shape';
import { IShape, IElement, IGroup } from '@antv/g-base/lib/interfaces';
import { ShapeCfg } from '@antv/g-base/lib/types';
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
    foldable?: boolean;
    minimap?: boolean;
    nodeVGap?: number;
    nodeHGap?: number;
    maxShowTagNum?: number;
    direction?: 'LR';
    minZoom?: number;
    maxZoom?: number;
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
    $zoomSlider: HTMLElement;
}
export interface MindmapDataItem {
    text?: string;
    link?: string;
    note?: string;
    tag?: string[];
    mark?: MarkSet;
    children?: MindmapDataItem[];
    _isFolded?: boolean;
    _foldedChildren?: MindmapDataItem[];
}
export interface MindmapNodeItem extends MindmapDataItem, TreeGraphData, NodeConfig {
    children?: MindmapNodeItem[];
    _foldedChildren?: MindmapNodeItem[];
    _originChildren?: MindmapDataItem[];
    id: string;
    anchorPoints: number[][];
    style?: ShapeStyle;
    type: string;
    _isRoot: boolean;
    _isNode: boolean;
    _isDragging?: boolean;
    _isHolder?: boolean;
}
export declare type MindmapData = MindmapNodeItem | MindmapDataItem;
export declare type MindmapDatas = MindmapData[] | MindmapData;
export declare type MindmapItemGetter<T> = {
    [key in keyof T]: (model: MindmapNodeItem, callback?: Function, getter?: MindmapItemGetter<T>, mindmap?: MindmapCoreL0Type) => Pick<T, key>[key];
};
export interface NodeStyle {
    outlineRadius?: number;
    outlinePadding?: number;
    bgColor?: string;
    bgColorHover?: string;
    radius?: number;
    fontSize?: number;
    fontColor?: string;
    fontWeight?: number | string;
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
export interface MindShapeOptions extends ShapeOptions {
}
export interface InitNodeOptions {
    shapes: MindNodeShapes;
    mindmap: MindmapCoreL0Type;
    cfg: MindmapNodeItem;
    group: GGroup;
    style: NodeStyle;
}
export interface InitFoldBtnOptions {
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
export declare type GenMarkOptions = {
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
export declare type MindmapCoreL3Ctor<T = MindmapCoreL3Type> = new (...args: any[]) => T;
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
    tagAll(nodeIds: NodeIds, tags: string[] | string): this;
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
    menuItemMarkEdit(evt: MouseEvent): void;
    menuItemMarkDelete(): void;
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
    getRootNodeId(): NodeId;
    getAllNodeIds(): NodeId[];
}
export interface FoldFeatures {
    foldToggle(nodeIds: NodeIds, fold: boolean): this;
    fold(nodeIds: NodeIds): this;
    unfold(nodeIds: NodeIds): this;
}
export interface MarkFeatures {
    showEditMark(nodeIds: NodeIds, markType: MindMarkTypes): this;
    hideEditMark(): this;
    getCurrentEditMarkNodeIds(): NodeIds;
    getCurrentEditMarkValue(): MindMarks;
    mark(nodeIds: NodeIds, mark: MindMarks): this;
    unmark(nodeIds: NodeIds, mark: MindMarks): this;
}
export interface ReadDataFeatures {
    readData(data: MindmapDataItem): this;
}
export interface ZoomFeatures {
    zoom(zoom: number): this;
    getZoom(): number;
    fitZoom(): this;
    _updateZoomValue(): this;
}
export interface ExportFeatures {
    exportToObject(nodeId: NodeId): MindmapNodeItem[];
    downloadFile(nodeId: NodeId | DownloadType, type: DownloadType): this;
}
export declare type MindmapCoreL0Type = MindmapCoreBase;
export declare type MindmapCoreL1Type = MindmapCoreL0Type & ZoomFeatures & GetFeatures & FoldFeatures & LinkFeatures & NoteFeatures & TagFeatures & MarkFeatures;
export declare type MindmapCoreL2Type = MindmapCoreL1Type & ContextMenuFeatures & NodeFeatures & ReadDataFeatures;
export declare type MindmapCoreL3Type = MindmapCoreL2Type & ExportFeatures;
export declare type MindmapCoreType = MindmapCoreL3Type;
export declare type toggleNodeVisibilityCallback = (type: 'show' | 'hide', model: MindmapNodeItem) => void;
export declare enum MindMarksTag {
    Red = "red",
    Yellow = "yellow",
    Blue = "blue",
    Purple = "purple",
    Green = "green",
    Cyan = "cyan",
    Gray = "gray"
}
export declare enum MindMarksPriority {
    P1 = "p1",
    P2 = "p2",
    P3 = "p3",
    P4 = "p4",
    P5 = "p5",
    P6 = "p6",
    P7 = "p7"
}
export declare enum MindMarksTask {
    Task0 = "task0",
    Task18 = "task18",
    Task14 = "task14",
    Task38 = "task38",
    Task12 = "task12",
    Task58 = "task58",
    Task34 = "task34",
    Task78 = "task78",
    Task1 = "task1"
}
export declare enum MindMarksStar {
    StarRed = "starRed",
    StarYellow = "starYellow",
    StarBlue = "starBlue",
    StarPurple = "starPurple",
    StarGreen = "starGreen",
    StarCyan = "starCyan",
    StarGray = "starGray"
}
export declare enum MindMarksFlag {
    FlagRed = "flagRed",
    FlagYellow = "flagYellow",
    FlagBlue = "flagBlue",
    FlagPurple = "flagPurple",
    FlagGreen = "flagGreen",
    FlagCyan = "flagCyan",
    FlagGray = "flagGray"
}
export declare enum MindMarksPerson {
    PersonRed = "personRed",
    PersonYellow = "personYellow",
    PersonBlue = "personBlue",
    PersonPurple = "personPurple",
    PersonGreen = "personGreen",
    PersonCyan = "personCyan",
    PersonGray = "personGray"
}
export declare const MindMarks: {
    PersonRed: MindMarksPerson.PersonRed;
    PersonYellow: MindMarksPerson.PersonYellow;
    PersonBlue: MindMarksPerson.PersonBlue;
    PersonPurple: MindMarksPerson.PersonPurple;
    PersonGreen: MindMarksPerson.PersonGreen;
    PersonCyan: MindMarksPerson.PersonCyan;
    PersonGray: MindMarksPerson.PersonGray;
    FlagRed: MindMarksFlag.FlagRed;
    FlagYellow: MindMarksFlag.FlagYellow;
    FlagBlue: MindMarksFlag.FlagBlue;
    FlagPurple: MindMarksFlag.FlagPurple;
    FlagGreen: MindMarksFlag.FlagGreen;
    FlagCyan: MindMarksFlag.FlagCyan;
    FlagGray: MindMarksFlag.FlagGray;
    StarRed: MindMarksStar.StarRed;
    StarYellow: MindMarksStar.StarYellow;
    StarBlue: MindMarksStar.StarBlue;
    StarPurple: MindMarksStar.StarPurple;
    StarGreen: MindMarksStar.StarGreen;
    StarCyan: MindMarksStar.StarCyan;
    StarGray: MindMarksStar.StarGray;
    Task0: MindMarksTask.Task0;
    Task18: MindMarksTask.Task18;
    Task14: MindMarksTask.Task14;
    Task38: MindMarksTask.Task38;
    Task12: MindMarksTask.Task12;
    Task58: MindMarksTask.Task58;
    Task34: MindMarksTask.Task34;
    Task78: MindMarksTask.Task78;
    Task1: MindMarksTask.Task1;
    P1: MindMarksPriority.P1;
    P2: MindMarksPriority.P2;
    P3: MindMarksPriority.P3;
    P4: MindMarksPriority.P4;
    P5: MindMarksPriority.P5;
    P6: MindMarksPriority.P6;
    P7: MindMarksPriority.P7;
    Red: MindMarksTag.Red;
    Yellow: MindMarksTag.Yellow;
    Blue: MindMarksTag.Blue;
    Purple: MindMarksTag.Purple;
    Green: MindMarksTag.Green;
    Cyan: MindMarksTag.Cyan;
    Gray: MindMarksTag.Gray;
};
export declare type MindMarks = MindMarksTag | MindMarksPriority | MindMarksTask | MindMarksStar | MindMarksFlag | MindMarksPerson;
export declare enum MindMarkTypes {
    Tag = "tag",
    Priority = "priority",
    Task = "task",
    Star = "star",
    Flag = "flag",
    Person = "person"
}
export declare type MarkSet = {
    [MindMarkTypes.Tag]?: MindMarksTag;
    [MindMarkTypes.Priority]?: MindMarksPriority;
    [MindMarkTypes.Task]?: MindMarksTask;
    [MindMarkTypes.Star]?: MindMarksStar;
    [MindMarkTypes.Flag]?: MindMarksFlag;
    [MindMarkTypes.Person]?: MindMarksPerson;
};
export declare type MarkBuilder = {
    [type in MindMarkTypes]: Function;
};
export declare type MarkElementBuilder = {
    [type in MindMarkTypes]: (marks: typeof MindMarksTag | typeof MindMarksPriority | typeof MindMarksTask | typeof MindMarksStar | typeof MindMarksFlag | typeof MindMarksPerson, type?: MindMarkTypes) => Node[];
};
export declare type MarkShapeCfg = {
    con?: ShapeCfg;
    iconCon?: ShapeCfg;
    icon?: ShapeCfg;
    text: ShapeCfg;
};
export declare enum DownloadType {
    Png = "png",
    Webp = "webp",
    Bmp = "bmp",
    Jpeg = "jpeg",
    Xmind = "xmind",
    Json = "json"
}
