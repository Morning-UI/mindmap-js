import { ShowContextMenuOptions, ContextMenuTypes, MindmapCoreL1Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<import("../interface").MindmapCoreL1Type>>(Base: TBase) => {
    new (...args: any[]): {
        showContextMenu(options: ShowContextMenuOptions): this;
        hideContextMenu(): this;
        hideAllContextMenu(): this;
        getContextNodeId(): string;
        getContextType(): ContextMenuTypes;
        getContextData(): any;
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
        contextType: ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: import("../interface").NodeIds;
        currentEditNoteNodeIds: import("../interface").NodeIds;
        currentEditTagNodeIds: import("../interface").NodeIds;
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
        tagAdd(nodeIds: import("../interface").NodeIds, tags: string | string[]): any;
        untag(nodeIds: import("../interface").NodeIds, untags: string | string[]): any;
        untagByIndex(nodeIds: import("../interface").NodeIds, index: number): any;
    };
} & TBase;
export default _default;
