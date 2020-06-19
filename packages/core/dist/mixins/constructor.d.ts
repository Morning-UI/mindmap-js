import * as G6 from '@antv/g6';
import { MindmapCoreL3Ctor } from '../interface';
import { Commander } from '../commander/index';
declare const _default: <TBase extends MindmapCoreL3Ctor<import("../interface").MindmapCoreL3Type>>(Base: TBase) => {
    new (...args: any[]): {
        redo(): number;
        undo(): number;
        graph: G6.TreeGraph;
        G6: typeof G6;
        data: import("../interface").MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: import("../interface").MindNodeElements;
        editNode: import("@antv/g6/lib/types").Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: import("../interface").ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: import("../interface").NodeIds;
        currentEditNoteNodeIds: import("../interface").NodeIds;
        currentEditTagNodeIds: import("../interface").NodeIds;
        currentEditMarkNodeIds: import("../interface").NodeIds;
        currentEditMarkValue: import("../interface").MindMark;
        zoomValue: number;
        isMindmap: boolean;
        eventList: import("../interface").EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: import("../interface").MindmapInsideOptions;
        commander: Commander;
        editorInput(content: string): any;
        on(eventName: import("../interface").EventNames, callback: import("../interface").EventCallbacks): any;
        emit(eventName: import("../interface").EventNames): any;
        showLink(nodeId: string): any;
        getNodeBBox(nodeId: string): object;
        _updateZoomValue(): any;
        zoom(zoom: number): any;
        getZoom(): number;
        fitZoom(): any;
        moveCanvas(x: number, y: number): any;
        getCanvasPos(): {
            x: number;
            y: number;
        };
        getNodeData(nodeIds: import("../interface").NodeIds): import("../interface").MindmapDataItems | import("../interface").MindmapDataItem;
        getNode(nodeIds: import("../interface").NodeIds): import("../interface").MindmapNodeItem | import("../interface").MindmapNodeItem[];
        getAllSelectedNodeIds(): string[];
        getSelectedNodeId(): string;
        getSelectedLastNodeId(): string;
        getAllSelectedNodeDatas(): import("../interface").MindmapDataItems;
        getSelectedNodeData(): import("../interface").MindmapDataItem;
        getAllSelectedNodes(): import("../interface").MindmapNodeItems;
        getSelectedNode(): import("../interface").MindmapNodeItem;
        getAllNodeIds(): string[];
        getAllNodeDatas(): import("../interface").MindmapDataItems;
        getAllNodes(): import("../interface").MindmapNodeItems;
        getRootNodeId(): string;
        getRootData(): import("../interface").MindmapDataItem;
        getRootNode(): import("../interface").MindmapNodeItem;
        getEdittingState(): boolean;
        foldToggle(nodeIds: import("../interface").NodeIds, fold: boolean): any;
        fold(nodeIds: import("../interface").NodeIds): any;
        unfold(nodeIds: import("../interface").NodeIds): any;
        showEditLink(nodeIds: import("../interface").NodeIds): any;
        hideEditLink(): any;
        getCurrentEditLinkNodeIds(): import("../interface").NodeIds;
        link(nodeIds: import("../interface").NodeIds, link: string): any;
        unlink(nodeIds: import("../interface").NodeIds): any;
        showEditNote(nodeIds: import("../interface").NodeIds): any;
        hideEditNote(): any;
        getCurrentEditNoteNodeIds(): import("../interface").NodeIds;
        note(nodeIds: import("../interface").NodeIds, note: string): any;
        unnote(nodeIds: import("../interface").NodeIds): any;
        showEditTag(nodeIds: import("../interface").NodeIds): any;
        hideEditTag(): any;
        getCurrentEditTagNodeIds(): import("../interface").NodeIds;
        tag(nodeIds: import("../interface").NodeIds, tags: string | string[]): any;
        tagAll(nodeIds: import("../interface").NodeIds, tags: string | string[]): any;
        untag(nodeIds: import("../interface").NodeIds, untags: string | string[]): any;
        showEditMark(nodeIds: import("../interface").NodeIds, markType: import("../interface").MindMarkTypes): any;
        hideEditMark(): any;
        getCurrentEditMarkNodeIds(): import("../interface").NodeIds;
        getCurrentEditMarkValue(): import("../interface").MindMark;
        mark(nodeIds: import("../interface").NodeIds, mark: import("../interface").MindMark): any;
        unmark(nodeIds: import("../interface").NodeIds, mark: import("../interface").MindMark): any;
        showContextMenu(options: import("../interface").ShowContextMenuOptions): any;
        hideContextMenu(): any;
        hideAllContextMenu(): any;
        getContextNodeId(): string;
        getContextType(): import("../interface").ContextMenuTypes;
        getContextData(): any;
        menuItemLinkEdit(): void;
        menuItemLinkDelete(): void;
        menuItemNoteEdit(): void;
        menuItemNoteDelete(): void;
        menuItemTagEdit(): void;
        menuItemTagDelete(): void;
        menuItemMarkEdit(evt: MouseEvent): void;
        menuItemMarkDelete(): void;
        copyNodeToClipboard(nodeIds: import("../interface").NodeIds): string;
        copyNode(nodeIds: import("../interface").NodeIds): import("../interface").MindmapNodeItems | import("../interface").MindmapNodeItem;
        getClipboard(): string;
        focusNodeTextEditor(nodeId: string, clean: boolean): any;
        blurNodeTextEditor(nodeId: string): any;
        selectNode(nodeIds: import("../interface").NodeIds): any;
        unselectNode(nodeIds: import("../interface").NodeIds): any;
        clearAllSelectedNode(): any;
        selectMoveUp(): any;
        selectMoveDown(): any;
        selectMoveBefore(): any;
        selectMoveAfter(): any;
        removeNode(nodeIds: import("../interface").NodeIds, _refresh: boolean): any;
        insertSubNode(nodeId: string, datas: import("../interface").MindmapDataItems | import("../interface").MindmapDataItem, index: number, _refresh: boolean): import("../interface").NodeIds;
        insertUpwardNode(nodeId: string, datas: import("../interface").MindmapDataItems | import("../interface").MindmapDataItem): import("../interface").NodeIds;
        insertDownwardNode(nodeId: string, datas: import("../interface").MindmapDataItems | import("../interface").MindmapDataItem): import("../interface").NodeIds;
        insertFirstNode(nodeId: string, datas: import("../interface").MindmapDataItems | import("../interface").MindmapDataItem): import("../interface").NodeIds;
        insertLastNode(nodeId: string, datas: import("../interface").MindmapDataItems | import("../interface").MindmapDataItem): import("../interface").NodeIds;
        appendUniqueNode(nodeId: string, datas: import("../interface").MindmapDataItem): string;
        prependUniqueNode(nodeId: string, datas: import("../interface").MindmapDataItem): string;
        nodeMoveUp(nodeId: string): any;
        nodeMoveDown(nodeId: string): any;
        copyNodeStyle(nodeId: string): any;
        pasteNodeStyle(nodeIds: import("../interface").NodeIds): any;
        copyNodes(nodeIds: import("../interface").NodeIds): any;
        pasteNodes(parentNodeId: string, nodeIds: any): any;
        readData(data: import("../interface").MindmapDataItem): any;
        _screenshotting(shotting: boolean): void;
        exportToObject(nodeId: string): import("../interface").MindmapNodeItems;
        downloadPng(nodeId: string): any;
        downloadWebp(nodeId: string): any;
        downloadJpeg(nodeId: string): any;
        downloadBmp(nodeId: string): any;
        downloadFile(nodeId: string, type: import("../interface").DownloadType): any;
    };
} & TBase;
export default _default;
