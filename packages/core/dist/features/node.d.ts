import { NodeIds, MindmapCoreL1Ctor, MindmapNodeItem, NodeId, MindmapDatas } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<import("../interface").MindmapCoreL1Type>>(Base: TBase) => {
    new (...args: any[]): {
        removeNode(nodeIds: NodeIds, _refresh?: boolean): this;
        insertSubNode(nodeId: NodeId, datas: MindmapDatas, index?: number, _refresh?: boolean): string | string[];
        graph: import("@antv/g6").TreeGraph;
        G6: typeof import("@antv/g6");
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        screenshotting: boolean;
        editElements: import("../interface").MindNodeElements;
        editNode: import("@antv/g6/lib/types").Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: import("../interface").ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        currentEditMarkNodeIds: NodeIds;
        currentEditMarkValue: import("../interface").MindMarks;
        zoomValue: number;
        isMindmap: boolean;
        eventList: import("../interface").EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: import("../interface").MindmapInsideOptions;
        clearSelectedNode(): any;
        focusNodeTextEditor(nodeId: string, clean?: boolean): any;
        blurNodeTextEditor(): any;
        editorInput(content: string): any;
        on(eventName: import("../interface").EventNames, callback: import("../interface").EventCallbacks): any;
        emit(eventName: import("../interface").EventNames): any;
        showLink(nodeId: string): any;
        getNodeBBox(nodeId: string): object;
        zoom(zoom: number): any;
        getZoom(): number;
        fitZoom(): any;
        _updateZoomValue(): any;
        getAllSelectedNodeIds(): (string | number)[];
        getAllSelectedNodeDetails(): import("../interface").MindmapDataItem[];
        getSelectedNodeId(): string | number;
        getSelectedNodeDetail(): import("../interface").MindmapDataItem;
        getNodeDetail(nodeIds: NodeIds): import("../interface").MindmapDataItem | import("../interface").MindmapDataItem[];
        getRootNodeId(): string | number;
        getAllNodeIds(): (string | number)[];
        foldToggle(nodeIds: NodeIds, fold: boolean): any;
        fold(nodeIds: NodeIds): any;
        unfold(nodeIds: NodeIds): any;
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
        tagAll(nodeIds: NodeIds, tags: string | string[]): any;
        untag(nodeIds: NodeIds, untags: string | string[]): any;
        untagByIndex(nodeIds: NodeIds, index: number): any;
        showEditMark(nodeIds: NodeIds, markType: import("../interface").MindMarkTypes): any;
        hideEditMark(): any;
        getCurrentEditMarkNodeIds(): NodeIds;
        getCurrentEditMarkValue(): import("../interface").MindMarks;
        mark(nodeIds: NodeIds, mark: import("../interface").MindMarks): any;
        unmark(nodeIds: NodeIds, mark: import("../interface").MindMarks): any;
    };
} & TBase;
export default _default;
