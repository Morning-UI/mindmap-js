import { NodeIds, MindmapCoreL2Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL2Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
        copyNodeToClipboard(nodeIds: NodeIds): this;
        cutNodeToClipboard(nodeIds: NodeIds): this;
        getClipboard(): string;
    };
} & TBase;
export default _default;
