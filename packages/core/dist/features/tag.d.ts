import { NodeIds, Constructor } from '../interface';
declare const _default: <TBase extends Constructor<{
    graph: import("@antv/g6").TreeGraph;
    _options: import("../interface").MindmapInsideOptions;
    contextNodeId: string;
    contextType: import("../interface").ContextMenuTypes;
    contextData: any;
    currentEditLinkNodeIds: NodeIds;
    currentEditNoteNodeIds: NodeIds;
    currentEditTagNodeIds: NodeIds;
    hideEditLink: Function;
    hideEditNote: Function;
}>>(Base: TBase) => TBase;
export default _default;
