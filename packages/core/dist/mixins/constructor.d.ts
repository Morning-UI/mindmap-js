import { MindmapCoreL3Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL3Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
    };
} & TBase;
export default _default;
