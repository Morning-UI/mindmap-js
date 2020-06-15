import { NodeIds, MindmapCoreL1Ctor, NodeId, MindmapDataItems, MindmapDataItem } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
        removeNode(nodeIds: NodeIds, _refresh?: boolean): this;
        insertSubNode(nodeId: NodeId, datas: MindmapDataItems | MindmapDataItem, index?: number, _refresh?: boolean): string | string[];
    };
} & TBase;
export default _default;
