import { MindmapCoreL2Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL2Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
        redo(): number;
        undo(): number;
        commandNewGroup(): this;
        commandExecGroup(): this;
    };
} & TBase;
export default _default;
