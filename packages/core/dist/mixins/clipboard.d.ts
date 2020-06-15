import { MindmapCoreL1Ctor, NodeIds, MindmapNodeItems } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
        copyNodeToClipboard(nodeIds: NodeIds): string;
        copyNode(nodeIds: NodeIds): MindmapNodeItems;
        getClipboard(): string;
    };
} & TBase;
export default _default;
