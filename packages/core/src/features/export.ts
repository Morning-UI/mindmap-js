import {
    MindmapCoreL2Ctor,
    ExportFeatures,
    MindmapNodeItem,
    NodeId,
    MindmapCoreL2Type,
    DownloadType,
}                                               from '../interface';
import {
    pluckDataFromModels,
    nodeItemGetter,
}                                               from '../utils/dataGetter';

const IMAGE_PADDING = 20;

const exportImage = (
    data: MindmapNodeItem,
    mindmap: MindmapCoreL2Type,
    type:
        'image/png'
        | 'image/jpeg'
        | 'image/webp'
        | 'image/bmp'
): Promise<string> =>
    new Promise((resolve) => {

        const rootNodeId = String(mindmap.getRootNodeId());
        const rootNodeModel = mindmap.graph.findById(rootNodeId).getModel() as MindmapNodeItem;

        // TODO：导出后画布恢复原有的位置
        // TODO：显示导出遮罩
        mindmap.readData(data);
        setTimeout(() => {
            mindmap.graph.toFullDataURL((res) => {
                resolve(res);
                mindmap.readData(rootNodeModel);
            }, type, {
                padding : IMAGE_PADDING,
                backgroundColor : '#fff',
            });
        });

    });

const exportProcesser: {
    [key in DownloadType]?: (
        data: MindmapNodeItem[],
        mindmap: MindmapCoreL2Type
    ) => Promise<string>;
} & {
    jsonObj?: (
        data: MindmapNodeItem[],
        mindmap: MindmapCoreL2Type,
    ) => MindmapNodeItem[];
} = {

    jsonObj : (data, mindmap) =>
        pluckDataFromModels<MindmapNodeItem>(data, nodeItemGetter, mindmap),

    json : (data, mindmap) => {

        const exportData = pluckDataFromModels<MindmapNodeItem>(data, nodeItemGetter, mindmap);

        return Promise.resolve(JSON.stringify(exportData, null, 4));

    },

    png : (data, mindmap) => exportImage(data[0], mindmap, 'image/png'),
    webp : (data, mindmap) => exportImage(data[0], mindmap, 'image/webp'),
    jpeg : (data, mindmap) => exportImage(data[0], mindmap, 'image/jpeg'),
    bmp : (data, mindmap) => exportImage(data[0], mindmap, 'image/bmp'),

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

        downloadFile (nodeId: NodeId | DownloadType, type: DownloadType): this {

            let _nodeId: NodeId = nodeId;
            let _type: DownloadType = type;

            if (_type === undefined) {

                _type = _nodeId as DownloadType;
                _nodeId = this.getRootNodeId();

            }

            const data = [this.graph.findById(String(_nodeId)).getModel() as MindmapNodeItem];

            Promise
                .resolve(exportProcesser[_type](data, this))
                .then((dataResult) => {

                    if (
                        _type === DownloadType.Png
                        || _type === DownloadType.Webp
                        || _type === DownloadType.Jpeg
                        || _type === DownloadType.Bmp) {

                        downloadFile(dataResult, _type);

                    } else if (_type === DownloadType.Xmind) {

                        downloadFile(URL.createObjectURL(dataResult), 'xmind');

                    } else if (_type === DownloadType.Json) {

                        downloadFile(URL.createObjectURL(new Blob([dataResult])), 'json');

                    }

                });

            return this;

        }

    };
