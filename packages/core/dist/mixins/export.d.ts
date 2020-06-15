import { MindmapCoreL2Ctor, NodeId, DownloadType, MindmapNodeItems } from '../interface';
declare const _default: <TBase extends MindmapCoreL2Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
        _screenshotting(shotting: boolean): void;
        exportToObject(nodeId: NodeId): MindmapNodeItems;
        downloadPng(nodeId?: NodeId): this;
        downloadWebp(nodeId?: NodeId): this;
        downloadJpeg(nodeId?: NodeId): this;
        downloadBmp(nodeId?: NodeId): this;
        downloadFile(nodeId: NodeId | DownloadType, type: DownloadType): this;
    };
} & TBase;
export default _default;
