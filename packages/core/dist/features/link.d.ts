import { MindmapNodeItem, NodeIds, MindmapCoreL0Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL0Ctor<import("..").MindmapCoreBase>>(Base: TBase) => {
    new (...args: any[]): {
        showEditLink(nodeIds: NodeIds): this;
        hideEditLink(): this;
        getCurrentEditLinkNodeIds(): NodeIds;
        link(nodeIds: NodeIds, link: string): this;
        unlink(nodeIds: NodeIds): this;
        graph: import("@antv/g6").TreeGraph;
        G6: typeof import("@antv/g6");
        data: MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
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
        eventList: import("../interface").EventList;
        keydownState: {
            mod: boolean;
        };
        _options: import("../interface").MindmapInsideOptions;
        readData(data: import("../interface").MindmapDataItem): any;
        clearSelectedNode(): any;
        focusNodeTextEditor(nodeId: string, clean?: boolean): any;
        blurNodeTextEditor(): any;
        editorInput(content: string): any;
        on(eventName: import("../interface").EventNames, callback: import("../interface").EventCallbacks): any;
        emit(eventName: import("../interface").EventNames): any;
        showLink(nodeId: string): any;
    };
} & TBase;
export default _default;
