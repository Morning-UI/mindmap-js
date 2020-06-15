import { MindmapCoreL2Ctor, MindmapNodeItems } from '../interface';
declare const _default: <TBase extends MindmapCoreL2Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
        importFromObject(data: MindmapNodeItems): this;
    };
} & TBase;
export default _default;
