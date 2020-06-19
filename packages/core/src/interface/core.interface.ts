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

    // 缩放限制
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

export type TraverseItemOptions = {
    type?: string;
    empty?: boolean;
    holder?: boolean;
};

export type MindmapDataItem = {
    text?: string;
    link?: string;
    note?: string;
    tag?: string[];
    mark?: MarkSet;
    children?: MindmapDataItems;
    folded?: boolean;
}

export type MindmapDataItems = MindmapDataItem[];

export type MindmapNodeItem = MindmapDataItem & {
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

export type MindmapNodeItems = MindmapNodeItem[];

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

export type MindmapItemGetter<T> = {
    [key in keyof T]: (
        model: MindmapNodeItem,
        callback?: Function,
        getter?: MindmapItemGetter<T>,
        mindmap?: MindmapCoreL0Type,
    ) => Pick<T, key>[key];
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

export type MindShapeOptions = ShapeOptions

export interface InitNodeOptions {
    shapes: MindNodeShapes;
    mindmap: MindmapCoreL0Type;
    cfg: MindmapNodeItem;
    group: IGroup;
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

export type NodeId = string;
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
    nodes: INode[];
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
export type MindmapCoreL3Ctor<T = MindmapCoreL3Type> = new (...args: any[]) => T;
export interface ContextMenuFeatures {
    // 显示右键菜单
    showContextMenu (options: ShowContextMenuOptions): this;
    // 隐藏右键菜单
    hideContextMenu (): this;
    // 隐藏所有菜单(包含右键和各功能菜单)
    hideAllContextMenu (): this;
    // 获取当前菜单对应的NodeId
    getContextNodeId (): string;
    // 获取当前右键菜单的类型
    getContextType (): ContextMenuTypes;
    // 获取右键菜单附加数据
    getContextData (): any;
    // 菜单项：修改链接
    menuItemLinkEdit (): void;
    // 菜单项：删除链接
    menuItemLinkDelete (): void;
    // 菜单项：修改备注
    menuItemNoteEdit (): void;
    // 菜单项：删除备注
    menuItemNoteDelete (): void;
    // 菜单项：修改标签
    menuItemTagEdit (): void;
    // 菜单项：删除标签
    menuItemTagDelete (): void;
    // 菜单项：选择标记
    menuItemMarkEdit (evt: MouseEvent): void;
    // 菜单项：删除标记
    menuItemMarkDelete (): void;
}

// Features
export type FeatureOptions<FO> = {
    [key in keyof FO]: FO[key];
} & {
    mindmap: MindmapCoreL3Type;
};
export type FeatureFn<FO> = (options: FO) => {
    [key in Exclude<keyof CommandExecRes, 'redoCmd' | 'time'>]: CommandExecRes[key];
};

// Fold Features
export namespace FoldFeatures {

    export namespace FO {
        export type FoldToggle = FeatureOptions<{
        nodeIds: NodeIds;
            fold?: boolean;
        }>;
    }

    export type FoldToggle = FeatureFn<FO.FoldToggle>;

    export enum Commands {
        FoldToggle = 'foldToggle',
    }

    export interface Mixins {
        // 切换节点折叠状态
        foldToggle (nodeIds: NodeIds, fold: boolean): this;
        // 折叠节点
        fold (nodeIds: NodeIds): this;
        // 展开节点
        unfold (nodeIds: NodeIds): this;
    }

}

// Link Features
export namespace LinkFeatures {
    export namespace FO {
        export type Link = FeatureOptions<{
            nodeIds: NodeIds;
            link: string;
        }>;

        export type Unlink = FeatureOptions<{
            nodeIds: NodeIds;
        }>;
    }

    export type Link = FeatureFn<FO.Link>;
    export type Unlink = FeatureFn<FO.Unlink>;

    export enum Commands {
        Link = 'link',
        Unlink = 'unlink',
    }

    export interface Mixins {
        showEditLink (nodeIds: NodeIds): this;
        hideEditLink (): this;
        getCurrentEditLinkNodeIds (): NodeIds;
        link (nodeIds: NodeIds, link: string): this;
        unlink (nodeIds: NodeIds): this;
    }
}

// Mark Features
export namespace MarkFeatures {
    export namespace FO {
        export type Mark = FeatureOptions<{
            nodeIds: NodeIds;
            mark: MindMark|MindMark[];
        }>;

        export type Unmark = FeatureOptions<{
            nodeIds: NodeIds;
            mark?: MindMark|MindMark[];
        }>;
    }

    export type Mark = FeatureFn<FO.Mark>;
    export type Unmark = FeatureFn<FO.Unmark>;

    export enum Commands {
        Mark = 'mark',
        Unmark = 'unmark',
    }

    export interface Mixins {
        showEditMark (nodeIds: NodeIds, markType: MindMarkTypes): this;
        hideEditMark (): this;
        getCurrentEditMarkNodeIds (): NodeIds;
        getCurrentEditMarkValue (): MindMark;
        mark (nodeIds: NodeIds, mark: MindMark): this;
        unmark (nodeIds: NodeIds, mark: MindMark): this;
    }
}

// Note Features
export namespace NoteFeatures {
    export namespace FO {
        export type Note = FeatureOptions<{
            nodeIds: NodeIds;
            note: string;
        }>;

        export type Unote = FeatureOptions<{
            nodeIds: NodeIds;
        }>;
    }

    export type Note = FeatureFn<FO.Note>;
    export type Unnote = FeatureFn<FO.Unote>;

    export enum Commands {
        Note = 'note',
        Unnote = 'unnote',
    }

    export interface Mixins {
        showEditNote (nodeIds: NodeIds): this;
        hideEditNote (): this;
        getCurrentEditNoteNodeIds (): NodeIds;
        note (nodeIds: NodeIds, note: string): this;
        unnote (nodeIds: NodeIds): this;
    }
}

// Tag Features
export namespace TagFeatures {
    export namespace FO {
        export type Tag = FeatureOptions<{
            nodeIds: NodeIds;
            tags: string[]|string;
        }>

        export type TagAll = FeatureOptions<{
            nodeIds: NodeIds;
            tags: string[]|string;
        }>

        export type Untag = FeatureOptions<{
            nodeIds: NodeIds;
            tags?: string[]|string;
        }>
    }

    export type Tag = FeatureFn<FO.Tag>;
    export type TagAll = FeatureFn<FO.TagAll>;
    export type Untag = FeatureFn<FO.Untag>;

    export enum Commands {
        Tag = 'tag',
        TagAll = 'tagAll',
        Untag = 'untag',
    }

    export interface Mixins {
        // 显示标签编辑弹窗
        showEditTag (nodeIds: NodeIds): this;
        // 关闭标签编辑弹窗
        hideEditTag (): this;
        // 获取当前正在编辑标签的NodeId
        getCurrentEditTagNodeIds (): NodeIds;
        // 节点增加标签
        tag (nodeIds: NodeIds, tags: string[]|string): this;
        // 节点标签替换为
        tagAll (nodeIds: NodeIds, tags: string[]|string): this;
        // 节点删除标签(名称匹配)
        untag (nodeIds: NodeIds, untags: string[]|string): this;
    }
}

// Zoom Features
export namespace ZoomFeatures {
    export namespace FO {
        export type Zoom = FeatureOptions<{
            zoom: number;
        }>;

        export type FitZoom = FeatureOptions<{}>;

        export type MoveCanvas = FeatureOptions<{
            x: number;
            y: number;
        }>;
    }

    export type Zoom = FeatureFn<FO.Zoom>;
    export type FitZoom = FeatureFn<FO.FitZoom>;
    export type MoveCanvas = FeatureFn<FO.MoveCanvas>;

    export enum Commands {
        Zoom = 'zoom',
        FitZoom = 'fitZoom',
        MoveCanvas = 'moveCanvas',
    }

    export interface Mixins {
        _updateZoomValue (): this;
        // 缩放画布
        zoom (zoom: number): this;
        // 获取画布缩放值
        getZoom (): number;
        // 调整至适合的缩放
        fitZoom (): this;
        // 移动画布
        moveCanvas (x: number, y: number): this;
        // 获取画布位置
        getCanvasPos (): {
            x: number;
            y: number;
        };
    }
}

// Data Features
export namespace DataFeatures {
    export namespace FO {
        export type ReadData = FeatureOptions<{
            data: MindmapDataItem;
        }>;
    }

    export type ReadData = FeatureFn<FO.ReadData>;

    export enum Commands {
        ReadData = 'readData',
    }

    export interface Mixins {
        readData (data: MindmapDataItem): this;
    }
}

// Get Features
export namespace GetFeatures {
    export interface Mixins {
        // 获取节点数据
        getNodeData (nodeIds: NodeIds): MindmapDataItems|MindmapDataItem;
        // 获取节点信息
        getNode (nodeIds: NodeIds): MindmapNodeItem[]|MindmapNodeItem;
        // 获取所有选中节点的id
        getAllSelectedNodeIds (): NodeId[];
        // 获取第一个选中节点的id
        getSelectedNodeId (): NodeId;
        // 获取最后一个选中节点的id
        getSelectedLastNodeId (): NodeId;
        // 获取所有选中节点的数据
        getAllSelectedNodeDatas (): MindmapDataItems;
        // 获取第一个选中节点的数据
        getSelectedNodeData (): MindmapDataItem;
        // 获取所有选中节点的信息
        getAllSelectedNodes (): MindmapNodeItems;
        // 获取第一个选中节点的信息
        getSelectedNode (): MindmapNodeItem;
        // 获取所有节点id
        getAllNodeIds (): NodeId[];
        // 获取所有节点数据
        getAllNodeDatas (): MindmapDataItems;
        // 获取所有节点信息
        getAllNodes (): MindmapNodeItems;
        // 获取根节点id
        getRootNodeId (): NodeId;
        // 获取根节点数据
        getRootData (): MindmapDataItem;
        // 获取根节点信息
        getRootNode (): MindmapNodeItem;
        // 获取当前编辑状态
        getEdittingState (): boolean;
    }
}

// Node Features
export namespace NodeFeatures {
    export interface Mixins {
        // 聚焦节点内容编辑器
        focusNodeTextEditor (nodeId: NodeId, clean: boolean): this;
        // 失焦节点内容编辑器
        blurNodeTextEditor (nodeId: NodeId): this;
        // 选中节点
        selectNode (nodeIds: NodeIds): this;
        // 取消选中节点
        unselectNode (nodeIds: NodeIds): this;
        // 取消选中所有被选中的节点
        clearAllSelectedNode (): this;
        // 选中上一个节点
        selectMoveUp (): this;
        // 选中下一个节点
        selectMoveDown (): this;
        // 选中前一个节点
        selectMoveBefore (): this;
        // 选中后一个节点
        selectMoveAfter (): this;
        // 移除节点
        removeNode (nodeIds: NodeIds, _refresh: boolean): this;
        // 为节点插入子节点
        insertSubNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems, index: number, _refresh: boolean): NodeIds;
        // 为节点插入同级节点(前)
        insertUpwardNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems): NodeIds;
        // 为节点插入同级节点(后)
        insertDownwardNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems): NodeIds;
        // 为节点插入同级节点(最前)
        insertFirstNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems): NodeIds;
        // 为节点插入同级节点(最后)
        insertLastNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems): NodeIds;
        // TODO 向后插入唯一节点(所有子节点向后平移)
        appendUniqueNode (nodeId: NodeId, datas: MindmapDataItem): NodeId;
        // TODO 向前插入唯一节点(当前节点向后平移)
        prependUniqueNode (nodeId: NodeId, datas: MindmapDataItem): NodeId;
        // 节点向上平移
        nodeMoveUp (nodeId: NodeId): this;
        // 节点向下平移
        nodeMoveDown (nodeId: NodeId): this;
        // TODO 拷贝节点样式
        copyNodeStyle (nodeId: NodeId): this;
        // TODO 粘贴节点样式
        pasteNodeStyle (nodeIds: NodeIds): this;
        // TODO 拷贝节点
        copyNodes (nodeIds: NodeIds): this;
        // TODO 粘贴节点
        pasteNodes (parentNodeId: NodeId, nodeIds: nodeIds): this;
    }
}

// Commander
export type AllCommands
    = FoldFeatures.Commands
    | LinkFeatures.Commands
    | MarkFeatures.Commands
    | NoteFeatures.Commands
    | TagFeatures.Commands
    | ZoomFeatures.Commands
    | DataFeatures.Commands;

export type AllCommandFOMap = {
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
export type CommandExecRes = {
    note: string;
    time: number;
    undoCmd: Command<AllCommands> | Command<AllCommands>[];
    redoCmd: Command<AllCommands> | Command<AllCommands>[];
}
export type Command<CMD extends AllCommands> = {
    cmd: CMD;
    opts?: CommandOptions<CMD>;
    _record: boolean;
}
export type CommandOptions<CMD extends AllCommands> = {
    [key in Exclude<keyof AllCommandFOMap[CMD], 'mindmap'>]: AllCommandFOMap[CMD][key];
}
export type CommandHistory = CommandExecRes;

export interface ExportFeatures {
    _screenshotting (shotting: boolean): void;
    exportToObject (nodeId: NodeId): MindmapNodeItems;
    downloadPng (nodeId: NodeId): this;
    downloadWebp (nodeId: NodeId): this;
    downloadJpeg (nodeId: NodeId): this;
    downloadBmp (nodeId: NodeId): this;
    downloadFile (nodeId: NodeId | DownloadType, type: DownloadType): this;
}
export interface ImportFeatures {

}
export interface ClipboardFeatures {
    copyNodeToClipboard (nodeIds: NodeIds): string;
    copyNode (nodeIds: NodeIds): MindmapNodeItem|MindmapNodeItems;
    getClipboard (): string;
}
export type MindmapCoreL0Type = MindmapCoreBase;
export type MindmapCoreL1Type =
    MindmapCoreL0Type
    & ZoomFeatures.Mixins
    & GetFeatures.Mixins
    & FoldFeatures.Mixins
    & LinkFeatures.Mixins
    & NoteFeatures.Mixins
    & TagFeatures.Mixins
    & MarkFeatures.Mixins;

export type MindmapCoreL2Type =
    MindmapCoreL1Type
    & ContextMenuFeatures
    & ClipboardFeatures
    & NodeFeatures.Mixins
    & DataFeatures.Mixins;

export type MindmapCoreL3Type =
    MindmapCoreL2Type
    & ImportFeatures
    & ExportFeatures;

export type MindmapCoreType = MindmapCoreL3Type;

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
export const MindMark = {
    ...MindMarksTag,
    ...MindMarksPriority,
    ...MindMarksTask,
    ...MindMarksStar,
    ...MindMarksFlag,
    ...MindMarksPerson,
}

export type MindMark =
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
}

export type MarkSet = {
    [MindMarkTypes.Tag]?: MindMarksTag;
    [MindMarkTypes.Priority]?: MindMarksPriority;
    [MindMarkTypes.Task]?: MindMarksTask;
    [MindMarkTypes.Star]?: MindMarksStar;
    [MindMarkTypes.Flag]?: MindMarksFlag;
    [MindMarkTypes.Person]?: MindMarksPerson;
}

export type MarkBuilder = {
    [type in MindMarkTypes]: Function;
}

export type MarkElementBuilder = {
    [type in MindMarkTypes]:
        (
            marks:
                typeof MindMarksTag
                | typeof MindMarksPriority
                | typeof MindMarksTask
                | typeof MindMarksStar
                | typeof MindMarksFlag
                | typeof MindMarksPerson,
            type?: MindMarkTypes,
        ) => Node[];
}

export type MarkShapeCfg = {
    con?: ShapeCfg;
    iconCon?: ShapeCfg;
    icon?: ShapeCfg;
    text: ShapeCfg;
}

export enum DownloadType {
    Png = 'png',
    Webp = 'webp',
    Bmp = 'bmp',
    Jpeg = 'jpeg',
    Xmind = 'xmind',
    Json = 'json',
}

export type ItemCallbackFn = (
    item: MindmapXmindItem,
    cid: string,
) => void

export type childrenWalkerFn = (
    children: MindmapXmindItem[],
    itemCallback: ItemCallbackFn,
    childrenWalker: childrenWalkerFn,
) => void

export type ExportXmindFn = (
    items: MindmapXmindItem[],
    itemCallback: ItemCallbackFn,
    childrenWalker: childrenWalkerFn,
    cid?: string,
) => void

export type XmindItemWalkerFn = (
    item: MindmapXmindItem,
    itemCallback: ItemCallbackFn,
    cid?: string,
) => void

export enum XmindMarkerMethods {
    Tag = 'tag',
    Priority = 'priority',
    Task = 'task',
    Star = 'star',
    Flag = 'flag',
    Person = 'people',
}
