import {
    MindmapCoreL2Ctor,
    ExportFeatures,
    MindmapNodeItem,
    NodeId,
    MindmapCoreL0Type,
    DownloadType,
}                                               from '../interface';
import {
    pluckDataFromModels,
    nodeItemGetter,
}                                               from '../utils/dataGetter';

const exportProcesser: {
    [key in DownloadType]?: (
        data: MindmapNodeItem[],
        mindmap: MindmapCoreL0Type
    ) => Promise<string>;
} & {
    jsonObj?: (
        data: MindmapNodeItem[],
        mindmap: MindmapCoreL0Type
    ) => MindmapNodeItem[];
} = {

    jsonObj : (data, mindmap) =>
        pluckDataFromModels<MindmapNodeItem>(data, nodeItemGetter, mindmap),

    json : (data, mindmap) => {

        const exportData = pluckDataFromModels<MindmapNodeItem>(data, nodeItemGetter, mindmap);

        return Promise.resolve(JSON.stringify(exportData, null, 4));

    },

    png : (data, mindmap) => {
        // TODO
    },

    xmind : (data, mindmap) => {
        // TODO
    },

};

const downloadFile = (dataUrl: string, suffix: string): void => {

    const downloadLink = document.createElement('a');

    downloadLink.style.display = 'none';
    downloadLink.href = dataUrl;
    downloadLink.download = `mindmap-${Number(new Date())}.${suffix}`;
    window.document.body.appendChild(downloadLink);
    downloadLink.click();
    window.document.body.removeChild(downloadLink);

};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL2Ctor> (Base: TBase) =>
    class extends Base implements ExportFeatures {

        exportToObject (nodeId: NodeId): MindmapNodeItem[] {

            let _nodeId = nodeId;

            if (_nodeId === undefined) {

                _nodeId = this.getRootNodeId();

            }

            const data = [this.graph.findById(String(_nodeId)).getModel() as MindmapNodeItem];

            return exportProcesser.jsonObj(data, this);

        }

        downloadFile (nodeId: NodeId | DownloadType, type: DownloadType): void {

            let _nodeId: NodeId = nodeId;
            let _type: DownloadType = type;

            if (_type === undefined) {

                _type = _nodeId as DownloadType;
                _nodeId = this.getRootNodeId();

            }

            const data = [this.graph.findById(String(_nodeId)).getModel() as MindmapNodeItem];

            Promise
                .resolve(exportProcesser[type](data, this))
                .then((dataResult) => {

                    console.log(type, dataResult);

                    if (type === 'png') {

                        downloadFile(dataResult, 'png');

                    } else if (type === 'xmind') {

                        downloadFile(URL.createObjectURL(dataResult), 'xmind');

                    } else if (type === DownloadType.Json) {

                        downloadFile(URL.createObjectURL(new Blob([dataResult])), 'json');

                    }

                });

            return this;

        }


    };
