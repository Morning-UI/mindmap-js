import { MindmapDataItem, MindmapCoreL1Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
        readData(data: MindmapDataItem): this;
    };
} & TBase;
export default _default;
