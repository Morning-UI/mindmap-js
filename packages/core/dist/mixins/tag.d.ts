import { TreeGraph } from '@antv/g6';
import { Item } from '@antv/g6/lib/types';
import { NodeIds, MindmapCoreL1Ctor, ContextMenuTypes } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<import("../interface").MindmapCoreL1Type>>(Base: TBase) => {
    new (...args: any[]): {
        menuItemTagEdit(): void;
        menuItemTagDelete(): void;
        showEditTag(nodeIds: NodeIds): this;
        hideEditTag(): this;
        tag(nodeIds: NodeIds, tags: string[] | string): this;
        tagAll(nodeIds: NodeIds, tags: string[] | string): this;
        untag(nodeIds: NodeIds, tags: string[] | string): this;
        graph: TreeGraph;
        G6: typeof import("@antv/g6");
        data: import("../interface").MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: import("../interface").MindNodeElements;
        editNode: Item;
        editContent: string;
        editZoom: number;
        $contextEle: HTMLElement;
        contextNodeIds: NodeIds;
        contextType: ContextMenuTypes;
        contextData: any;
        contextHiddenCallback: Function;
        currentEditMarkNodeIds: NodeIds;
        currentEditMarkValue: import("../interface").MindMark;
        zoomValue: number;
        focus: boolean;
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
        openLink(nodeId: string): any;
        getNodeBBox(nodeId: string): object;
        _updateZoomValue(): any;
        zoom(zoom: number): any;
        getZoom(): number;
        fitZoom(): any;
        fitCenter(): any;
        moveCanvas(x: number, y: number): any;
        getCanvasPos(): {
            x: number;
            y: number;
        };
        getNodeData(nodeIds: NodeIds): import("../interface").MindmapDataItems | import("../interface").MindmapDataItem;
        getNode(nodeIds: NodeIds): import("../interface").MindmapNodeItem | import("../interface").MindmapNodeItem[];
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
        showContextMenu(options: import("../interface").ShowContextMenuOptions): any;
        hideContextMenu(): any;
        getContextNodeIds(): NodeIds;
        getContextType(): ContextMenuTypes;
        getContextData(): any;
        menuItemLinkEdit(): void;
        menuItemLinkDelete(): void;
        menuItemNoteEdit(): void;
        menuItemNoteDelete(): void;
        menuItemMarkEdit(evt: MouseEvent): void;
        menuItemMarkDelete(): void;
        foldToggle(nodeIds: NodeIds, fold?: boolean): any;
        fold(nodeIds: NodeIds): any;
        unfold(nodeIds: NodeIds): any;
        showEditNote(nodeIds: NodeIds): any;
        hideEditNote(): any;
        note(nodeIds: NodeIds, note: string): any;
        unnote(nodeIds: NodeIds): any;
        showEditMark(nodeIds: NodeIds, markType: import("../interface").MindMarkTypes): any;
        hideEditMark(): any;
        getCurrentEditMarkNodeIds(): NodeIds;
        mark(nodeIds: NodeIds, mark: import("../interface").MindMark): any;
        unmark(nodeIds: NodeIds, mark: import("../interface").MindMark): any;
    };
} & TBase;
export default _default;
