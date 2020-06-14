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
    MindmapNodeItems,
}                                               from '../interface';
import {
    pluckDataFromModels,
    nodeItemGetter,
    xmindItemGetter,
}                                               from '../utils/dataGetter';
import {
    getModel,
}                                               from '../utils/G6Ext';

const IMAGE_PADDING = 20;
const IMAGE_BACKGROUND = '#FFF';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const xmindKeeper = {
    Workbook,
    Topic,
    Marker,
};

const exportImage = (
    data: MindmapNodeItem,
    mindmap: MindmapCoreL3Type,
    type:
        'image/png'
        | 'image/jpeg'
        | 'image/webp'
        | 'image/bmp'
): Promise<Blob> =>
    new Promise((resolve) => {

        const rootNodeId = String(mindmap.getRootNodeId());
        const rootNodeModel = getModel(mindmap.graph.findById(rootNodeId));
        const originBBox = (mindmap.graph.get('group') as IGroup).getCanvasBBox();
        const originZoom = mindmap.getZoom();

        mindmap._screenshotting(true);
        mindmap.readData(data);
        setTimeout(() => {

            mindmap.graph.toFullDataURL((res) => {

                resolve(new Blob([res]));
                mindmap.readData(rootNodeModel);
                setTimeout(() => {

                    mindmap.zoom(originZoom);
                    mindmap.graph.moveTo(originBBox.x, originBBox.y);
                    mindmap._screenshotting(false);

                });

            }, type, {
                padding : IMAGE_PADDING,
                backgroundColor : IMAGE_BACKGROUND,
            });

        });

    });

const xmindItemWalker: XmindItemWalkerFn = (item, itemCallback, cid) => {

    itemCallback(item, cid);

};

const exportXmind: ExportXmindFn = (items, itemCallback, childrenWalker, cid) => {

    for (const item of items) {

        xmindItemWalker(item, itemCallback, cid);

        if (item.children) {

            childrenWalker(Object.assign([], item.children), itemCallback, childrenWalker);

        }

    }

};

const exportProcesser: {
    [key in DownloadType]?: (
        data: MindmapNodeItems,
        mindmap: MindmapCoreL3Type
    ) => Promise<Blob>;
} & {
    jsonObj?: (
        data: MindmapNodeItems,
        mindmap: MindmapCoreL3Type,
    ) => MindmapNodeItems;
} = {

    jsonObj : (data, mindmap) =>
        pluckDataFromModels<MindmapNodeItem>(data, nodeItemGetter, mindmap),

    json : (data, mindmap) => {

        const exportData = pluckDataFromModels<MindmapNodeItem>(data, nodeItemGetter, mindmap);

        return Promise.resolve(new Blob([JSON.stringify(exportData, null, 4)]));

    },

    png : (data, mindmap) => exportImage(data[0], mindmap, 'image/png'),
    webp : (data, mindmap) => exportImage(data[0], mindmap, 'image/webp'),
    jpeg : (data, mindmap) => exportImage(data[0], mindmap, 'image/jpeg'),
    bmp : (data, mindmap) => exportImage(data[0], mindmap, 'image/bmp'),

    xmind : (data, mindmap) => {

        const zip = new JSZip();
        const _Workbook = window.Workbook;
        const _Topic = window.Topic;
        const _Dumper = window.Dumper;
        const _Marker = window.Marker;
        const workbook = new _Workbook();
        const xmindData = pluckDataFromModels<MindmapXmindItem>(data, xmindItemGetter, mindmap);

        let topic: Topic;

        exportXmind(xmindData, (item, cid) => {

            const current: MindmapXmindItem = {
                title : item.title,
                href : item.href,
                labels : item.labels,
                branch : item.branch,
            };

            if (topic === undefined) {

                topic = new _Topic({
                    sheet : workbook.createSheet('sheet title', current.title),
                });

            } else if (cid) {

                topic.on(cid).add(current);

            }

            if (item.note) {

                topic.on(topic.cid()).note(item.note);

            }

            const markerMethods = Object.keys(item.marker || {}) as XmindMarkerMethods[];

            if (markerMethods.length > 0) {

                const marker = new _Marker();

                for (const method of markerMethods) {

                    // xmind-sdk not support tag for now.
                    if (method === XmindMarkerMethods.Tag) {

                        topic.on(topic.cid()).current().addMarker({
                            markerId : `tag-${item.marker[method]}`,
                        });

                    } else {

                        topic.on(topic.cid()).marker(marker[method](item.marker[method]));

                    }

                }

            }

        }, (items, itemCallback, childrenWalker) => {

            if (items && items.length > 0) {

                items.unshift(items.pop());
                exportXmind(items, itemCallback, childrenWalker, topic.cid());

            }

        });

        const dumper = new _Dumper({
            workbook,
        });
        const files = dumper.dumping();

        for (const file of files) {

            if (file.filename === 'content.json') {

                file.value = JSON.parse(file.value);
                file.value[0].rootTopic.structureClass = 'org.xmind.ui.logic.right';
                file.value = JSON.stringify(file.value);

            }

            zip.file(file.filename, file.value);

        }

        return zip.generateAsync({
            type : 'blob',
        });

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

        _screenshotting (shotting: boolean): void {

            const $mask = this._options.$con.querySelector('.mindmap-screenshotting-mask') as HTMLDivElement;

            if (shotting) {

                $mask.style.display = 'block';

            } else {

                $mask.style.display = 'none';

            }

        }

        exportToObject (nodeId: NodeId): MindmapNodeItems {

            let _nodeId = nodeId;

            if (_nodeId === undefined) {

                _nodeId = this.getRootNodeId();

            }

            const data = [this.graph.findById(String(_nodeId)).getModel() as MindmapNodeItem];

            return exportProcesser.jsonObj(data, this);

        }

        downloadPng (nodeId: NodeId = this.getRootNodeId()): this {

            return this.downloadFile(nodeId, DownloadType.Png);

        }

        downloadWebp (nodeId: NodeId = this.getRootNodeId()): this {

            return this.downloadFile(nodeId, DownloadType.Webp);

        }

        downloadJpeg (nodeId: NodeId = this.getRootNodeId()): this {

            return this.downloadFile(nodeId, DownloadType.Jpeg);

        }

        downloadBmp (nodeId: NodeId = this.getRootNodeId()): this {

            return this.downloadFile(nodeId, DownloadType.Bmp);

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

                        dataResult.text().then((text) => downloadFile(text, _type));

                    } else if (_type === DownloadType.Xmind) {

                        downloadFile(URL.createObjectURL(dataResult), 'xmind');

                    } else if (_type === DownloadType.Json) {

                        downloadFile(URL.createObjectURL(dataResult), 'json');

                    }

                });

            return this;

        }

    };
