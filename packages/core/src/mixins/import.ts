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
    ImportFeatures,
    NodeId,
    MindmapCoreL3Type,
    DownloadType,
    MindmapXmindItem,
    ExportXmindFn,
    XmindItemWalkerFn,
    XmindMarkerMethods,
    MindMarkTypes,
    MindmapNodeItems,
}                                               from '../interface';
import {
    pluckDataFromModels,
    nodeItemGetter,
    xmindItemGetter,
}                                               from '../utils/dataGetter';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL2Ctor> (Base: TBase) =>
    class extends Base implements ImportFeatures.Mixins {

        importFromObject (data: MindmapNodeItems): this {

            let _nodeId = nodeId;

            if (_nodeId === undefined) {

                _nodeId = this.getRootNodeId();

            }

            const data = [this.graph.findById(String(_nodeId)).getModel() as MindmapNodeItem];

            return exportProcesser.jsonObj(data, this);

            return this;

        }

    };
