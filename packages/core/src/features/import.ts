import {
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import JSZip                                    from 'jszip';
import {
    Workbook,
    Topic,
    Marker,
}                                               from 'xmind';
import {
    MindmapCoreL2Ctor,
    MindmapNodeItem,
    ExportFeatures,
    NodeId,
    MindmapCoreL3Type,
    DownloadType,
    MindmapXmindItem,
    ExportXmindFn,
    XmindItemWalkerFn,
    XmindMarkerMethods,
    MindMarkTypes,
}                                               from '../interface';
import {
    pluckDataFromModels,
    nodeItemGetter,
    xmindItemGetter,
}                                               from '../utils/dataGetter';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL2Ctor> (Base: TBase) =>
    class extends Base implements ExportFeatures {

        importFromObject (data: MindmapNodeItem[]): this {
            return this;
        }

    };
