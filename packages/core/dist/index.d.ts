import * as G6 from '@antv/g6';
import * as G6Types from '@antv/g6/lib/types';
import { MindmapCreateOptions, MindmapDataItem, MindmapNodeItem, MindNodeElements, MindmapInsideOptions, EventNames, EditContentChangeCallback, ZoomChangeCallback, EventCallbacks, ContextMenuTypes, NodeIds } from './interface';
export declare class MindmapCore {
    graph: G6.TreeGraph;
    G6: typeof G6;
    data: MindmapNodeItem;
    dragging: boolean;
    editting: boolean;
    editElements: MindNodeElements;
    editNode: G6Types.Item;
    editContent: string;
    editZoom: number;
    contextNodeId: string;
    contextType: ContextMenuTypes;
    contextData: any;
    currentEditLinkNodeIds: NodeIds;
    currentEditNoteNodeIds: NodeIds;
    currentEditTagNodeIds: NodeIds;
    eventList: {
        [EventNames.EditContentChange]?: EditContentChangeCallback[];
        [EventNames.ZoomChange]?: ZoomChangeCallback[];
    };
    keydownState: {
        mod: boolean;
    };
    _options: MindmapInsideOptions;
    constructor(options: MindmapCreateOptions);
    readData(data: MindmapDataItem): this;
    clearSelectedNode(): this;
    focusNodeTextEditor(nodeId: string, clean?: boolean): this;
    blurNodeTextEditor(): this;
    editorInput(content: string): this;
    on(eventName: EventNames, callback: EventCallbacks): this;
    emit(eventName: EventNames): this;
    showLink(nodeId: string): this;
}
declare let MindmapClass: any;
export default MindmapClass;
export declare const EventNamesEnum: typeof EventNames;
