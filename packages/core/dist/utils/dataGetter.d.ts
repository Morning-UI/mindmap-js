import { MindmapNodeItem, MindmapDataItem, MindmapCoreL0Type, MindmapItemGetter } from '../interface';
export declare const dataItemGetter: MindmapItemGetter<MindmapDataItem>;
export declare const nodeItemGetter: MindmapItemGetter<MindmapNodeItem>;
export declare const pluckDataFromModels: <T>(models: MindmapNodeItem[], getter: MindmapItemGetter<T>, mindmap: MindmapCoreL0Type) => T[];
