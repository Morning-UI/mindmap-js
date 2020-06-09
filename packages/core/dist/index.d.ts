import * as G6 from '@antv/g6';
import * as G6Types from '@antv/g6/lib/types';
import { MindmapDataItem, MindmapNodeItem, MindNodeElements, MindmapInsideOptions, EventNames, EventList, EventCallbacks, ContextMenuTypes, NodeIds } from './interface';
export declare class MindmapCoreBase {
    graph: G6.TreeGraph;
    G6: typeof G6;
    data: MindmapNodeItem;
    dragging: boolean;
    editting: boolean;
    editElements: MindNodeElements;
    editNode: G6Types.Item;
    editContent: string;
    editZoom: number;
    contextNodeId: string;
    contextType: ContextMenuTypes;
    contextData: any;
    currentEditLinkNodeIds: NodeIds;
    currentEditNoteNodeIds: NodeIds;
    currentEditTagNodeIds: NodeIds;
    isMindmap: boolean;
    eventList: EventList;
    keydownState: {
        mod: boolean;
        shift: boolean;
    };
    _options: MindmapInsideOptions;
    constructor(...args: any[]);
    readData(data: MindmapDataItem): this;
    clearSelectedNode(): this;
    focusNodeTextEditor(nodeId: string, clean?: boolean): this;
    blurNodeTextEditor(): this;
    editorInput(content: string): this;
    on(eventName: EventNames, callback: EventCallbacks): this;
    emit(eventName: EventNames): this;
    showLink(nodeId: string): this;
    getNodeBBox(nodeId: string): object;
}
declare const MindmapCore: {
    new (...args: any[]): {
        graph: G6.TreeGraph;
        G6: typeof G6;
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: MindNodeElements;
        editNode: G6Types.Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        isMindmap: boolean;
        eventList: EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: MindmapInsideOptions;
        readData(data: MindmapDataItem): this;
        clearSelectedNode(): this;
        focusNodeTextEditor(nodeId: string, clean?: boolean): this;
        blurNodeTextEditor(): this;
        editorInput(content: string): this;
        on(eventName: EventNames, callback: EventCallbacks): this;
        emit(eventName: EventNames): this;
        showLink(nodeId: string): this;
        getNodeBBox(nodeId: string): object;
        getAllSelectedNodeIds(): (string | number)[];
        getAllSelectedNodeDetails(): MindmapDataItem[];
        getSelectedNodeId(): string | number;
        getSelectedNodeDetail(): MindmapDataItem;
        getNodeDetail(nodeIds: NodeIds): MindmapDataItem | MindmapDataItem[];
        showEditLink(nodeIds: NodeIds): any;
        hideEditLink(): any;
        getCurrentEditLinkNodeIds(): NodeIds;
        link(nodeIds: NodeIds, link: string): any;
        unlink(nodeIds: NodeIds): any;
        showEditNote(nodeIds: NodeIds): any;
        hideEditNote(): any;
        getCurrentEditNoteNodeIds(): NodeIds;
        note(nodeIds: NodeIds, note: string): any;
        unnote(nodeIds: NodeIds): any;
        showEditTag(nodeIds: NodeIds): any;
        hideEditTag(): any;
        getCurrentEditTagNodeIds(): NodeIds;
        tag(nodeIds: NodeIds, tags: string | string[]): any;
        tagAdd(nodeIds: NodeIds, tags: string | string[]): any;
        untag(nodeIds: NodeIds, untags: string | string[]): any;
        untagByIndex(nodeIds: NodeIds, index: number): any;
        showContextMenu(options: import("./interface").ShowContextMenuOptions): any;
        hideContextMenu(): any;
        hideAllContextMenu(): any;
        getContextNodeId(): string;
        getContextType(): ContextMenuTypes;
        getContextData(): any;
        menuItemLinkEdit(): void;
        menuItemLinkDelete(): void;
        menuItemNoteEdit(): void;
        menuItemNoteDelete(): void;
        menuItemTagEdit(): void;
        menuItemTagDelete(): void;
        removeNode(nodeIds: NodeIds, _refresh: boolean): any;
        insertSubNode(nodeId: string | number, datas: import("./interface").MindmapDatas, index: number, _refresh: boolean): string | string[];
    };
} & {
    new (...args: any[]): {
        removeNode(nodeIds: NodeIds, _refresh?: boolean): any;
        insertSubNode(nodeId: string | number, datas: import("./interface").MindmapDatas, index?: number, _refresh?: boolean): string | string[];
        graph: G6.TreeGraph;
        G6: typeof G6;
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: MindNodeElements;
        editNode: G6Types.Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        isMindmap: boolean;
        eventList: EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: MindmapInsideOptions;
        readData(data: MindmapDataItem): this;
        clearSelectedNode(): this;
        focusNodeTextEditor(nodeId: string, clean?: boolean): this;
        blurNodeTextEditor(): this;
        editorInput(content: string): this;
        on(eventName: EventNames, callback: EventCallbacks): this;
        emit(eventName: EventNames): this;
        showLink(nodeId: string): this;
        getNodeBBox(nodeId: string): object;
        getAllSelectedNodeIds(): (string | number)[];
        getAllSelectedNodeDetails(): MindmapDataItem[];
        getSelectedNodeId(): string | number;
        getSelectedNodeDetail(): MindmapDataItem;
        getNodeDetail(nodeIds: NodeIds): MindmapDataItem | MindmapDataItem[];
        showEditLink(nodeIds: NodeIds): any;
        hideEditLink(): any;
        getCurrentEditLinkNodeIds(): NodeIds;
        link(nodeIds: NodeIds, link: string): any;
        unlink(nodeIds: NodeIds): any;
        showEditNote(nodeIds: NodeIds): any;
        hideEditNote(): any;
        getCurrentEditNoteNodeIds(): NodeIds;
        note(nodeIds: NodeIds, note: string): any;
        unnote(nodeIds: NodeIds): any;
        showEditTag(nodeIds: NodeIds): any;
        hideEditTag(): any;
        getCurrentEditTagNodeIds(): NodeIds;
        tag(nodeIds: NodeIds, tags: string | string[]): any;
        tagAdd(nodeIds: NodeIds, tags: string | string[]): any;
        untag(nodeIds: NodeIds, untags: string | string[]): any;
        untagByIndex(nodeIds: NodeIds, index: number): any;
    };
} & {
    new (...args: any[]): {
        showContextMenu(options: import("./interface").ShowContextMenuOptions): any;
        hideContextMenu(): any;
        hideAllContextMenu(): any;
        getContextNodeId(): string;
        getContextType(): ContextMenuTypes;
        getContextData(): any;
        menuItemLinkEdit(): void;
        menuItemLinkDelete(): void;
        menuItemNoteEdit(): void;
        menuItemNoteDelete(): void;
        menuItemTagEdit(): void;
        menuItemTagDelete(): void;
        graph: G6.TreeGraph;
        G6: typeof G6;
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: MindNodeElements;
        editNode: G6Types.Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        isMindmap: boolean;
        eventList: EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: MindmapInsideOptions;
        readData(data: MindmapDataItem): this;
        clearSelectedNode(): this;
        focusNodeTextEditor(nodeId: string, clean?: boolean): this;
        blurNodeTextEditor(): this;
        editorInput(content: string): this;
        on(eventName: EventNames, callback: EventCallbacks): this;
        emit(eventName: EventNames): this;
        showLink(nodeId: string): this;
        getNodeBBox(nodeId: string): object;
        getAllSelectedNodeIds(): (string | number)[];
        getAllSelectedNodeDetails(): MindmapDataItem[];
        getSelectedNodeId(): string | number;
        getSelectedNodeDetail(): MindmapDataItem;
        getNodeDetail(nodeIds: NodeIds): MindmapDataItem | MindmapDataItem[];
        showEditLink(nodeIds: NodeIds): any;
        hideEditLink(): any;
        getCurrentEditLinkNodeIds(): NodeIds;
        link(nodeIds: NodeIds, link: string): any;
        unlink(nodeIds: NodeIds): any;
        showEditNote(nodeIds: NodeIds): any;
        hideEditNote(): any;
        getCurrentEditNoteNodeIds(): NodeIds;
        note(nodeIds: NodeIds, note: string): any;
        unnote(nodeIds: NodeIds): any;
        showEditTag(nodeIds: NodeIds): any;
        hideEditTag(): any;
        getCurrentEditTagNodeIds(): NodeIds;
        tag(nodeIds: NodeIds, tags: string | string[]): any;
        tagAdd(nodeIds: NodeIds, tags: string | string[]): any;
        untag(nodeIds: NodeIds, untags: string | string[]): any;
        untagByIndex(nodeIds: NodeIds, index: number): any;
    };
} & {
    new (...args: any[]): {
        showEditTag(nodeIds: NodeIds): any;
        hideEditTag(): any;
        getCurrentEditTagNodeIds(): NodeIds;
        tag(nodeIds: NodeIds, tags: string | string[]): any;
        tagAdd(nodeIds: NodeIds, tags: string | string[]): any;
        untag(nodeIds: NodeIds, untags: string | string[]): any;
        untagByIndex(nodeIds: NodeIds, index: number): any;
        graph: G6.TreeGraph;
        G6: typeof G6;
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: MindNodeElements;
        editNode: G6Types.Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        isMindmap: boolean;
        eventList: EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: MindmapInsideOptions;
        readData(data: MindmapDataItem): this;
        clearSelectedNode(): this;
        focusNodeTextEditor(nodeId: string, clean?: boolean): this;
        blurNodeTextEditor(): this;
        editorInput(content: string): this;
        on(eventName: EventNames, callback: EventCallbacks): this;
        emit(eventName: EventNames): this;
        showLink(nodeId: string): this;
        getNodeBBox(nodeId: string): object;
    };
} & {
    new (...args: any[]): {
        showEditNote(nodeIds: NodeIds): any;
        hideEditNote(): any;
        getCurrentEditNoteNodeIds(): NodeIds;
        note(nodeIds: NodeIds, note: string): any;
        unnote(nodeIds: NodeIds): any;
        graph: G6.TreeGraph;
        G6: typeof G6;
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: MindNodeElements;
        editNode: G6Types.Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        isMindmap: boolean;
        eventList: EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: MindmapInsideOptions;
        readData(data: MindmapDataItem): this;
        clearSelectedNode(): this;
        focusNodeTextEditor(nodeId: string, clean?: boolean): this;
        blurNodeTextEditor(): this;
        editorInput(content: string): this;
        on(eventName: EventNames, callback: EventCallbacks): this;
        emit(eventName: EventNames): this;
        showLink(nodeId: string): this;
        getNodeBBox(nodeId: string): object;
    };
} & {
    new (...args: any[]): {
        showEditLink(nodeIds: NodeIds): any;
        hideEditLink(): any;
        getCurrentEditLinkNodeIds(): NodeIds;
        link(nodeIds: NodeIds, link: string): any;
        unlink(nodeIds: NodeIds): any;
        graph: G6.TreeGraph;
        G6: typeof G6;
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: MindNodeElements;
        editNode: G6Types.Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        isMindmap: boolean;
        eventList: EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: MindmapInsideOptions;
        readData(data: MindmapDataItem): this;
        clearSelectedNode(): this;
        focusNodeTextEditor(nodeId: string, clean?: boolean): this;
        blurNodeTextEditor(): this;
        editorInput(content: string): this;
        on(eventName: EventNames, callback: EventCallbacks): this;
        emit(eventName: EventNames): this;
        showLink(nodeId: string): this;
        getNodeBBox(nodeId: string): object;
    };
} & {
    new (...args: any[]): {
        getAllSelectedNodeIds(): (string | number)[];
        getAllSelectedNodeDetails(): MindmapDataItem[];
        getSelectedNodeId(): string | number;
        getSelectedNodeDetail(): MindmapDataItem;
        getNodeDetail(nodeIds: NodeIds): MindmapDataItem | MindmapDataItem[];
        graph: G6.TreeGraph;
        G6: typeof G6;
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: MindNodeElements;
        editNode: G6Types.Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        isMindmap: boolean;
        eventList: EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: MindmapInsideOptions;
        readData(data: MindmapDataItem): this;
        clearSelectedNode(): this;
        focusNodeTextEditor(nodeId: string, clean?: boolean): this;
        blurNodeTextEditor(): this;
        editorInput(content: string): this;
        on(eventName: EventNames, callback: EventCallbacks): this;
        emit(eventName: EventNames): this;
        showLink(nodeId: string): this;
        getNodeBBox(nodeId: string): object;
    };
} & typeof MindmapCoreBase;
export default MindmapCore;
export * from './utils/testData';
export * from './interface';
