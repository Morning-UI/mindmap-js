import * as G6 from '@antv/g6';
import { MindmapCoreL2Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL2Ctor<import("../interface").MindmapCoreL2Type>>(Base: TBase) => {
    new (...args: any[]): {
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
        isMindmap: boolean;
        eventList: import("../interface").EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
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
        getNodeBBox(nodeId: string): object;
        getAllSelectedNodeIds(): (string | number)[];
        getAllSelectedNodeDetails(): import("../interface").MindmapDataItem[];
        getSelectedNodeId(): string | number;
        getSelectedNodeDetail(): import("../interface").MindmapDataItem;
        getNodeDetail(nodeIds: import("../interface").NodeIds): import("../interface").MindmapDataItem | import("../interface").MindmapDataItem[];
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
        removeNode(nodeIds: import("../interface").NodeIds, _refresh: boolean): any;
        insertSubNode(nodeId: string | number, datas: import("../interface").MindmapDatas, index: number, _refresh: boolean): string | string[];
    };
} & TBase;
export default _default;
