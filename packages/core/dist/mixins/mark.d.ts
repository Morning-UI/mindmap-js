import { TreeGraph } from '@antv/g6';
import { Item } from '@antv/g6/lib/types';
import { NodeIds, MindmapCoreL0Ctor, MindMark, MindMarkTypes } from '../interface';
declare const _default: <TBase extends MindmapCoreL0Ctor<import("..").MindmapCoreBase>>(Base: TBase) => {
    new (...args: any[]): {
        showEditMark(nodeIds: NodeIds, markType: MindMarkTypes): this;
        hideEditMark(): this;
        getCurrentEditMarkNodeIds(): NodeIds;
        getCurrentEditMarkValue(): MindMark;
        mark(nodeIds: NodeIds, mark: MindMark): this;
        unmark(nodeIds: NodeIds, mark: MindMark): this;
        graph: TreeGraph;
        G6: typeof import("@antv/g6");
        data: import("../interface").MindmapNodeItem;
        dragging: boolean;
        editting: boolean;
        editElements: import("../interface").MindNodeElements;
        editNode: Item;
        editContent: string;
        editZoom: number;
        contextNodeId: string;
        contextType: import("../interface").ContextMenuTypes;
        contextData: any;
        currentEditLinkNodeIds: NodeIds;
        currentEditNoteNodeIds: NodeIds;
        currentEditTagNodeIds: NodeIds;
        currentEditMarkNodeIds: NodeIds;
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
    };
} & TBase;
export default _default;
