import * as G6 from '@antv/g6';
import { ShapeOptions } from '@antv/g6/lib/interface/shape';
import { IShape, IElement, IGroup } from '@antv/g-base/lib/interfaces';
import { ShapeCfg } from '@antv/g-base/lib/types';
import { INode } from '@antv/g6/lib/interface/item';
import { ShapeAttrs } from '@antv/g-base';
import { ShapeStyle, G6Event, Item, IG6GraphEvent } from '@antv/g6/lib/types';
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
export interface CommanderOptions {
    mindmap: MindmapCoreType;
    maxRecordNums?: number;
}
export declare type TraverseItemOptions = {
    type?: string;
    empty?: boolean;
    holder?: boolean;
};
export declare type MindmapDataItem = {
    text?: string;
    link?: string;
    note?: string;
    tag?: string[];
    mark?: MarkSet;
    children?: MindmapDataItem[];
    folded?: boolean;
};
export declare type MindmapDataItems = MindmapDataItem[];
export declare type MindmapNodeItem = MindmapDataItem & {
    id: string;
    type: string;
    depth: number;
    anchorPoints: number[][];
    children?: MindmapNodeItems;
    style?: ShapeStyle;
    _isRoot?: boolean;
    _isNode?: boolean;
    _isDragging?: boolean;
    _isHolder?: boolean;
    _foldedChildren?: MindmapNodeItems;
    _originChildren?: MindmapDataItems;
};
export declare type MindmapNodeItems = MindmapNodeItem[];
export interface MindmapXmindItem {
    title: string;
    note?: string;
    href?: string;
    labels?: string[] | string;
    branch?: 'folded';
    marker?: {
        [key in XmindMarkerMethods]?: string;
    };
    children?: MindmapXmindItem[];
}
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
    fontWeight?: number | 'normal' | 'bold' | 'bolder' | 'lighter';
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
export declare type MindShapeOptions = ShapeOptions;
export interface InitNodeOptions {
    shapes: MindNodeShapes;
    mindmap: MindmapCoreL0Type;
    cfg: MindmapNodeItem;
    group: IGroup;
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
    markName: MindMark;
    markType: MindMarkTypes;
} & InitNodeTagsOptions;
export interface InitNodeMarksOptions {
    shapes: MindNodeShapes;
    mindmap: MindmapCoreL0Type;
    cfg: MindmapNodeItem;
    style: NodeStyle;
}
export interface AddShapeOptions {
    name: string;
    type: 'rect' | 'text' | 'circle';
    group: IGroup;
    shapes: MindNodeShapes;
    attrs: ShapeAttrs;
    draggable?: boolean;
}
export interface AddGroupOptions {
    group: IGroup;
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
export declare type NodeId = string;
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
    nodes: INode[];
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
export declare type FeatureOptions<FO> = {
    [key in keyof FO]: FO[key];
} & {
    mindmap: MindmapCoreL3Type;
};
export declare type FeatureFn<FO> = (options: FO) => {
    [key in Exclude<keyof CommandExecRes, 'redoCmd' | 'time'>]: CommandExecRes[key];
};
export declare namespace FoldFeatures {
    namespace FO {
        type FoldToggle = FeatureOptions<{
            nodeIds: NodeIds;
            fold?: boolean;
        }>;
    }
    type FoldToggle = FeatureFn<FO.FoldToggle>;
    enum Commands {
        FoldToggle = "foldToggle"
    }
    interface Mixins {
        foldToggle(nodeIds: NodeIds, fold: boolean): this;
        fold(nodeIds: NodeIds): this;
        unfold(nodeIds: NodeIds): this;
    }
}
export declare namespace LinkFeatures {
    namespace FO {
        type Link = FeatureOptions<{
            nodeIds: NodeIds;
            link: string;
        }>;
        type Unlink = FeatureOptions<{
            nodeIds: NodeIds;
        }>;
    }
    type Link = FeatureFn<FO.Link>;
    type Unlink = FeatureFn<FO.Unlink>;
    enum Commands {
        Link = "link",
        Unlink = "unlink"
    }
    interface Mixins {
        showEditLink(nodeIds: NodeIds): this;
        hideEditLink(): this;
        getCurrentEditLinkNodeIds(): NodeIds;
        link(nodeIds: NodeIds, link: string): this;
        unlink(nodeIds: NodeIds): this;
    }
}
export declare namespace MarkFeatures {
    namespace FO {
        type Mark = FeatureOptions<{
            nodeIds: NodeIds;
            mark: MindMark | MindMark[];
        }>;
        type Unmark = FeatureOptions<{
            nodeIds: NodeIds;
            mark?: MindMark | MindMark[];
        }>;
    }
    type Mark = FeatureFn<FO.Mark>;
    type Unmark = FeatureFn<FO.Unmark>;
    enum Commands {
        Mark = "mark",
        Unmark = "unmark"
    }
    interface Mixins {
        showEditMark(nodeIds: NodeIds, markType: MindMarkTypes): this;
        hideEditMark(): this;
        getCurrentEditMarkNodeIds(): NodeIds;
        getCurrentEditMarkValue(): MindMark;
        mark(nodeIds: NodeIds, mark: MindMark): this;
        unmark(nodeIds: NodeIds, mark: MindMark): this;
    }
}
export declare namespace NoteFeatures {
    namespace FO {
        type Note = FeatureOptions<{
            nodeIds: NodeIds;
            note: string;
        }>;
        type Unote = FeatureOptions<{
            nodeIds: NodeIds;
        }>;
    }
    type Note = FeatureFn<FO.Note>;
    type Unnote = FeatureFn<FO.Unote>;
    enum Commands {
        Note = "note",
        Unnote = "unnote"
    }
    interface Mixins {
        showEditNote(nodeIds: NodeIds): this;
        hideEditNote(): this;
        getCurrentEditNoteNodeIds(): NodeIds;
        note(nodeIds: NodeIds, note: string): this;
        unnote(nodeIds: NodeIds): this;
    }
}
export declare namespace TagFeatures {
    namespace FO {
        type Tag = FeatureOptions<{
            nodeIds: NodeIds;
            tags: string[] | string;
        }>;
        type TagAll = FeatureOptions<{
            nodeIds: NodeIds;
            tags: string[] | string;
        }>;
        type Untag = FeatureOptions<{
            nodeIds: NodeIds;
            tags?: string[] | string;
        }>;
    }
    type Tag = FeatureFn<FO.Tag>;
    type TagAll = FeatureFn<FO.TagAll>;
    type Untag = FeatureFn<FO.Untag>;
    enum Commands {
        Tag = "tag",
        TagAll = "tagAll",
        Untag = "untag"
    }
    interface Mixins {
        showEditTag(nodeIds: NodeIds): this;
        hideEditTag(): this;
        getCurrentEditTagNodeIds(): NodeIds;
        tag(nodeIds: NodeIds, tags: string[] | string): this;
        tagAll(nodeIds: NodeIds, tags: string[] | string): this;
        untag(nodeIds: NodeIds, untags: string[] | string): this;
    }
}
export declare namespace ZoomFeatures {
    namespace FO {
        type Zoom = FeatureOptions<{
            zoom: number;
        }>;
        type FitZoom = FeatureOptions<{}>;
        type MoveCanvas = FeatureOptions<{
            x: number;
            y: number;
        }>;
    }
    type Zoom = FeatureFn<FO.Zoom>;
    type FitZoom = FeatureFn<FO.FitZoom>;
    type MoveCanvas = FeatureFn<FO.MoveCanvas>;
    enum Commands {
        Zoom = "zoom",
        FitZoom = "fitZoom",
        MoveCanvas = "moveCanvas"
    }
    interface Mixins {
        _updateZoomValue(): this;
        zoom(zoom: number): this;
        getZoom(): number;
        fitZoom(): this;
        moveCanvas(x: number, y: number): this;
        getCanvasPos(): {
            x: number;
            y: number;
        };
    }
}
export declare namespace DataFeatures {
    namespace FO {
        type ReadData = FeatureOptions<{
            data: MindmapDataItem;
        }>;
    }
    type ReadData = FeatureFn<FO.ReadData>;
    enum Commands {
        ReadData = "readData"
    }
    interface Mixins {
        readData(data: MindmapDataItem): this;
    }
}
export declare namespace GetFeatures {
    interface Mixins {
        getNodeData(nodeIds: NodeIds): MindmapDataItems | MindmapDataItem;
        getNode(nodeIds: NodeIds): MindmapNodeItem[] | MindmapNodeItem;
        getAllSelectedNodeIds(): NodeId[];
        getSelectedNodeId(): NodeId;
        getAllSelectedNodeDatas(): MindmapDataItems;
        getSelectedNodeData(): MindmapDataItem;
        getAllSelectedNodes(): MindmapNodeItems;
        getSelectedNode(): MindmapNodeItem;
        getAllNodeIds(): NodeId[];
        getAllNodeDatas(): MindmapDataItems;
        getAllNodes(): MindmapNodeItems;
        getRootNodeId(): NodeId;
        getRootData(): MindmapDataItem;
        getRootNode(): MindmapNodeItem;
        getEdittingState(): boolean;
    }
}
export declare namespace NodeFeatures {
    interface Mixins {
        focusNodeTextEditor(nodeId: NodeId, clean: boolean): this;
        blurNodeTextEditor(nodeId: NodeId): this;
        selectNode(nodeIds: NodeIds): this;
        unselectNode(nodeIds: NodeIds): this;
        clearAllSelectedNode(): this;
        selectMoveUp(): this;
        selectMoveDown(): this;
        selectMoveBefore(): this;
        selectMoveAfter(): this;
        removeNode(nodeIds: NodeIds, _refresh: boolean): this;
        insertSubNode(nodeId: NodeId, datas: MindmapDataItem | MindmapDataItems, index: number, _refresh: boolean): NodeIds;
        insertUpwardNode(nodeId: NodeId, datas: MindmapDataItem | MindmapDataItems): NodeIds;
        insertDownwardNode(nodeId: NodeId, datas: MindmapDataItem | MindmapDataItems): NodeIds;
        insertNode(nodeId: NodeId, datas: MindmapDataItem | MindmapDataItems): NodeIds;
        appendUniqueNode(nodeId: NodeId, datas: MindmapDataItem): NodeId;
        prependUniqueNode(nodeId: NodeId, datas: MindmapDataItem): NodeId;
        moveUp(nodeId: NodeId): this;
        moveDown(nodeId: NodeId): this;
        copyNodeStyle(nodeId: NodeId): this;
        pasteNodeStyle(nodeIds: NodeIds): this;
    }
}
export declare type AllCommands = FoldFeatures.Commands | LinkFeatures.Commands | MarkFeatures.Commands | NoteFeatures.Commands | TagFeatures.Commands | ZoomFeatures.Commands | DataFeatures.Commands;
export declare type AllCommandFOMap = {
    [FoldFeatures.Commands.FoldToggle]: FoldFeatures.FO.FoldToggle;
    [LinkFeatures.Commands.Link]: LinkFeatures.FO.Link;
    [LinkFeatures.Commands.Unlink]: LinkFeatures.FO.Unlink;
    [MarkFeatures.Commands.Mark]: MarkFeatures.FO.Mark;
    [MarkFeatures.Commands.Unmark]: MarkFeatures.FO.Unmark;
    [NoteFeatures.Commands.Note]: NoteFeatures.FO.Note;
    [NoteFeatures.Commands.Unnote]: NoteFeatures.FO.Unote;
    [TagFeatures.Commands.Tag]: TagFeatures.FO.Tag;
    [TagFeatures.Commands.TagAll]: TagFeatures.FO.TagAll;
    [TagFeatures.Commands.Untag]: TagFeatures.FO.Untag;
    [ZoomFeatures.Commands.Zoom]: ZoomFeatures.FO.Zoom;
    [ZoomFeatures.Commands.FitZoom]: ZoomFeatures.FO.FitZoom;
    [ZoomFeatures.Commands.MoveCanvas]: ZoomFeatures.FO.MoveCanvas;
    [DataFeatures.Commands.ReadData]: DataFeatures.FO.ReadData;
};
export declare type CommandExecRes = {
    note: string;
    time: number;
    undoCmd: Command<AllCommands> | Command<AllCommands>[];
    redoCmd: Command<AllCommands> | Command<AllCommands>[];
};
export declare type Command<CMD extends AllCommands> = {
    cmd: CMD;
    opts?: CommandOptions<CMD>;
    _record: boolean;
};
export declare type CommandOptions<CMD extends AllCommands> = {
    [key in Exclude<keyof AllCommandFOMap[CMD], 'mindmap'>]: AllCommandFOMap[CMD][key];
};
export declare type CommandHistory = CommandExecRes;
export interface ExportFeatures {
    _screenshotting(shotting: boolean): void;
    exportToObject(nodeId: NodeId): MindmapNodeItems;
    downloadPng(nodeId: NodeId): this;
    downloadWebp(nodeId: NodeId): this;
    downloadJpeg(nodeId: NodeId): this;
    downloadBmp(nodeId: NodeId): this;
    downloadFile(nodeId: NodeId | DownloadType, type: DownloadType): this;
}
export interface ImportFeatures {
}
export interface ClipboardFeatures {
    copyNodeToClipboard(nodeIds: NodeIds): string;
    copyNode(nodeIds: NodeIds): MindmapNodeItem | MindmapNodeItems;
    getClipboard(): string;
}
export declare type MindmapCoreL0Type = MindmapCoreBase;
export declare type MindmapCoreL1Type = MindmapCoreL0Type & ZoomFeatures.Mixins & GetFeatures.Mixins & FoldFeatures.Mixins & LinkFeatures.Mixins & NoteFeatures.Mixins & TagFeatures.Mixins & MarkFeatures.Mixins;
export declare type MindmapCoreL2Type = MindmapCoreL1Type & ContextMenuFeatures & ClipboardFeatures & NodeFeatures.Mixins & DataFeatures.Mixins;
export declare type MindmapCoreL3Type = MindmapCoreL2Type & ImportFeatures & ExportFeatures;
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
export declare const MindMark: {
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
export declare type MindMark = MindMarksTag | MindMarksPriority | MindMarksTask | MindMarksStar | MindMarksFlag | MindMarksPerson;
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
export declare type ItemCallbackFn = (item: MindmapXmindItem, cid: string) => void;
export declare type childrenWalkerFn = (children: MindmapXmindItem[], itemCallback: ItemCallbackFn, childrenWalker: childrenWalkerFn) => void;
export declare type ExportXmindFn = (items: MindmapXmindItem[], itemCallback: ItemCallbackFn, childrenWalker: childrenWalkerFn, cid?: string) => void;
export declare type XmindItemWalkerFn = (item: MindmapXmindItem, itemCallback: ItemCallbackFn, cid?: string) => void;
export declare enum XmindMarkerMethods {
    Tag = "tag",
    Priority = "priority",
    Task = "task",
    Star = "star",
    Flag = "flag",
    Person = "people"
}
