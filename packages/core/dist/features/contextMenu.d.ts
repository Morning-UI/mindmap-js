import { Constructor, ContextMenuTypes } from '../interface';
declare const _default: <TBase extends Constructor<{
    graph: import("@antv/g6").TreeGraph;
    _options: import("../interface").MindmapInsideOptions;
    contextNodeId: string;
    contextType: ContextMenuTypes;
    contextData: any;
    currentEditLinkNodeIds: import("../interface").NodeIds;
    currentEditNoteNodeIds: import("../interface").NodeIds;
    currentEditTagNodeIds: import("../interface").NodeIds;
    hideEditLink: Function;
    hideEditNote: Function;
}>>(Base: TBase) => TBase;
export default _default;
