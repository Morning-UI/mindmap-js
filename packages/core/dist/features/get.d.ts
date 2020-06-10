import { TreeGraph } from '@antv/g6';
import { Item } from '@antv/g6/lib/types';
import { NodeIds, MindmapNodeItem, MindmapCoreL0Ctor, NodeId, MindmapDataItem } from '../interface';
declare const _default: <TBase extends MindmapCoreL0Ctor<import("..").MindmapCoreBase>>(Base: TBase) => {
    new (...args: any[]): {
        getAllSelectedNodeIds(): NodeId[];
        getAllSelectedNodeDetails(): MindmapDataItem[];
        getSelectedNodeId(): NodeId;
        getSelectedNodeDetail(): MindmapDataItem;
        getNodeDetail(nodeIds: NodeIds): MindmapDataItem | MindmapDataItem[];
        graph: TreeGraph;
        G6: typeof import("@antv/g6");
        data: MindmapNodeItem;
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
        isMindmap: boolean;
        eventList: import("../interface").EventList;
        keydownState: {
            mod: boolean;
            shift: boolean;
        };
        _options: import("../interface").MindmapInsideOptions;
        readData(data: MindmapDataItem): any;
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
