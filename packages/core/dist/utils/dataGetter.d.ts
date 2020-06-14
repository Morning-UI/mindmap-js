import { MindmapNodeItem, MindmapDataItem, MindmapCoreL0Type, MindmapItemGetter, MindmapXmindItem, MindmapNodeItems } from '../interface';
export declare const dataItemGetter: MindmapItemGetter<MindmapDataItem>;
export declare const nodeItemGetter: MindmapItemGetter<MindmapNodeItem>;
export declare const xmindItemGetter: MindmapItemGetter<MindmapXmindItem>;
export declare const pluckDataFromModels: <T>(models: MindmapNodeItems, getter: MindmapItemGetter<T>, mindmap: MindmapCoreL0Type) => T[];
