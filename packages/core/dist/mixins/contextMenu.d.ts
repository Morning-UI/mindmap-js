import { ShowContextMenuOptions, ContextMenuTypes, MindmapCoreL1Ctor, MindMark } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<import("../interface").MindmapCoreL1Type>>(Base: TBase) => {
    new (...args: any[]): {
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
        currentEditMarkNodeIds: import("../interface").NodeIds;
        currentEditMarkValue: MindMark;
        zoomValue: number;
        isMindmap: boolean;
        eventList: import("../interface").EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: import("../interface").MindmapInsideOptions;
        commander: import("../commander").Commander;
        clearSelectedNode(): any;
        focusNodeTextEditor(nodeId: string, clean?: boolean): any;
        blurNodeTextEditor(): any;
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
        getAllSelectedNodeIds(): string[];
        getAllSelectedNodeDetails(): import("../interface").MindmapDataItem[];
        getSelectedNodeId(): string;
        getSelectedNodeDetail(): import("../interface").MindmapDataItem;
        getNodeDetail(nodeIds: import("../interface").NodeIds): import("../interface").MindmapDataItem | import("../interface").MindmapDataItem[];
        getRootNodeId(): string;
        getAllNodeIds(): string[];
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
        untagByIndex(nodeIds: import("../interface").NodeIds, index: number): any;
        showEditMark(nodeIds: import("../interface").NodeIds, markType: import("../interface").MindMarkTypes): any;
        hideEditMark(): any;
        getCurrentEditMarkNodeIds(): import("../interface").NodeIds;
        getCurrentEditMarkValue(): MindMark;
        mark(nodeIds: import("../interface").NodeIds, mark: MindMark): any;
        unmark(nodeIds: import("../interface").NodeIds, mark: MindMark): any;
    };
} & TBase;
export default _default;
