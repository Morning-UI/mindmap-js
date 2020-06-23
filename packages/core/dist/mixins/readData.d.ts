import { MindmapDataItem, MindmapCoreL1Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<import("../interface").MindmapCoreL1Type>>(Base: TBase) => {
    new (...args: any[]): {
        readData(data: MindmapDataItem, first?: boolean): this;
        graph: import("@antv/g6").TreeGraph;
        G6: typeof import("@antv/g6");
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
        commander: import("../commander").Commander;
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
        getNodeData(nodeIds: import("../interface").NodeIds): import("../interface").MindmapDataItems | MindmapDataItem;
        getNode(nodeIds: import("../interface").NodeIds): import("../interface").MindmapNodeItem | import("../interface").MindmapNodeItem[];
        getAllSelectedNodeIds(): string[];
        getSelectedNodeId(): string;
        getSelectedLastNodeId(): string;
        getAllSelectedNodeDatas(): import("../interface").MindmapDataItems;
        getSelectedNodeData(): MindmapDataItem;
        getAllSelectedNodes(): import("../interface").MindmapNodeItems;
        getSelectedNode(): import("../interface").MindmapNodeItem;
        getAllNodeIds(): string[];
        getAllNodeDatas(): import("../interface").MindmapDataItems;
        getAllNodes(): import("../interface").MindmapNodeItems;
        getRootNodeId(): string;
        getRootData(): MindmapDataItem;
        getRootNode(): import("../interface").MindmapNodeItem;
        getEdittingState(): boolean;
        foldToggle(nodeIds: import("../interface").NodeIds, fold?: boolean): any;
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
    };
} & TBase;
export default _default;
