import { MindmapCoreL0Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL0Ctor<import("..").MindmapCoreBase>>(Base: TBase) => {
    new (...args: any[]): {
        zoom(zoom: number): this;
        getZoom(): number;
        fitZoom(): this;
        moveCanvas(x: number, y: number): this;
        getCanvasPos(): ({
            x: number;
            y: number;
        });
        _updateZoomValue(): this;
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
        openLink(nodeId: string): any;
        getNodeBBox(nodeId: string): object;
    };
} & TBase;
export default _default;
