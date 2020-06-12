var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import JSZip from 'jszip';
import { Workbook, Topic, Marker, } from 'xmind';
import { DownloadType, XmindMarkerMethods, } from '../interface';
import { pluckDataFromModels, nodeItemGetter, xmindItemGetter, } from '../utils/dataGetter';
var IMAGE_PADDING = 20;
var IMAGE_BACKGROUND = '#FFF';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var xmindKeeper = {
    Workbook: Workbook,
    Topic: Topic,
    Marker: Marker,
};
var exportImage = function (data, mindmap, type) {
    return new Promise(function (resolve) {
        var rootNodeId = String(mindmap.getRootNodeId());
        var rootNodeModel = mindmap.graph.findById(rootNodeId).getModel();
        var originBBox = mindmap.graph.get('group').getCanvasBBox();
        var originZoom = mindmap.getZoom();
        mindmap._screenshotting(true);
        mindmap.readData(data);
        setTimeout(function () {
            mindmap.graph.toFullDataURL(function (res) {
                resolve(new Blob([res]));
                mindmap.readData(rootNodeModel);
                setTimeout(function () {
                    mindmap.zoom(originZoom);
                    mindmap.graph.moveTo(originBBox.x, originBBox.y);
                    mindmap._screenshotting(false);
                });
            }, type, {
                padding: IMAGE_PADDING,
                backgroundColor: IMAGE_BACKGROUND,
            });
        });
    });
};
var xmindItemWalker = function (item, itemCallback, cid) {
    itemCallback(item, cid);
};
var exportXmind = function (items, itemCallback, childrenWalker, cid) {
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        xmindItemWalker(item, itemCallback, cid);
        if (item.children) {
            childrenWalker(Object.assign([], item.children), itemCallback, childrenWalker);
        }
    }
};
var exportProcesser = {
    jsonObj: function (data, mindmap) {
        return pluckDataFromModels(data, nodeItemGetter, mindmap);
    },
    json: function (data, mindmap) {
        var exportData = pluckDataFromModels(data, nodeItemGetter, mindmap);
        return Promise.resolve(new Blob([JSON.stringify(exportData, null, 4)]));
    },
    png: function (data, mindmap) { return exportImage(data[0], mindmap, 'image/png'); },
    webp: function (data, mindmap) { return exportImage(data[0], mindmap, 'image/webp'); },
    jpeg: function (data, mindmap) { return exportImage(data[0], mindmap, 'image/jpeg'); },
    bmp: function (data, mindmap) { return exportImage(data[0], mindmap, 'image/bmp'); },
    xmind: function (data, mindmap) {
        var zip = new JSZip();
        var _Workbook = window.Workbook;
        var _Topic = window.Topic;
        var _Dumper = window.Dumper;
        var _Marker = window.Marker;
        var workbook = new _Workbook();
        var xmindData = pluckDataFromModels(data, xmindItemGetter, mindmap);
        var topic;
        exportXmind(xmindData, function (item, cid) {
            var current = {
                title: item.title,
                href: item.href,
                labels: item.labels,
                branch: item.branch,
            };
            if (topic === undefined) {
                topic = new _Topic({
                    sheet: workbook.createSheet('sheet title', current.title),
                });
            }
            else if (cid) {
                topic.on(cid).add(current);
            }
            if (item.note) {
                topic.on(topic.cid()).note(item.note);
            }
            var markerMethods = Object.keys(item.marker || {});
            if (markerMethods.length > 0) {
                var marker = new _Marker();
                for (var _i = 0, markerMethods_1 = markerMethods; _i < markerMethods_1.length; _i++) {
                    var method = markerMethods_1[_i];
                    // xmind-sdk not support tag for now.
                    if (method === XmindMarkerMethods.Tag) {
                        topic.on(topic.cid()).current().addMarker({
                            markerId: "tag-" + item.marker[method],
                        });
                    }
                    else {
                        topic.on(topic.cid()).marker(marker[method](item.marker[method]));
                    }
                }
            }
        }, function (items, itemCallback, childrenWalker) {
            if (items && items.length > 0) {
                items.unshift(items.pop());
                exportXmind(items, itemCallback, childrenWalker, topic.cid());
            }
        });
        var dumper = new _Dumper({
            workbook: workbook,
        });
        var files = dumper.dumping();
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (file.filename === 'content.json') {
                file.value = JSON.parse(file.value);
                file.value[0].rootTopic.structureClass = 'org.xmind.ui.logic.right';
                file.value = JSON.stringify(file.value);
            }
            zip.file(file.filename, file.value);
        }
        return zip.generateAsync({
            type: 'blob',
        });
    },
};
var downloadFile = function (dataUrl, suffix) {
    var downloadLink = document.createElement('a');
    downloadLink.style.display = 'none';
    downloadLink.href = dataUrl;
    downloadLink.download = "mindmap-" + Number(new Date()) + "." + suffix;
    window.document.body.appendChild(downloadLink);
    downloadLink.click();
    window.document.body.removeChild(downloadLink);
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype._screenshotting = function (shotting) {
            var $mask = this._options.$con.querySelector('.mindmap-screenshotting-mask');
            if (shotting) {
                $mask.style.display = 'block';
            }
            else {
                $mask.style.display = 'none';
            }
        };
        class_1.prototype.exportToObject = function (nodeId) {
            var _nodeId = nodeId;
            if (_nodeId === undefined) {
                _nodeId = this.getRootNodeId();
            }
            var data = [this.graph.findById(String(_nodeId)).getModel()];
            return exportProcesser.jsonObj(data, this);
        };
        class_1.prototype.downloadPng = function (nodeId) {
            if (nodeId === void 0) { nodeId = this.getRootNodeId(); }
            return this.downloadFile(nodeId, DownloadType.Png);
        };
        class_1.prototype.downloadWebp = function (nodeId) {
            if (nodeId === void 0) { nodeId = this.getRootNodeId(); }
            return this.downloadFile(nodeId, DownloadType.Webp);
        };
        class_1.prototype.downloadJpeg = function (nodeId) {
            if (nodeId === void 0) { nodeId = this.getRootNodeId(); }
            return this.downloadFile(nodeId, DownloadType.Jpeg);
        };
        class_1.prototype.downloadBmp = function (nodeId) {
            if (nodeId === void 0) { nodeId = this.getRootNodeId(); }
            return this.downloadFile(nodeId, DownloadType.Bmp);
        };
        class_1.prototype.downloadFile = function (nodeId, type) {
            var _nodeId = nodeId;
            var _type = type;
            if (_type === undefined) {
                _type = _nodeId;
                _nodeId = this.getRootNodeId();
            }
            var data = [this.graph.findById(String(_nodeId)).getModel()];
            Promise
                .resolve(exportProcesser[_type](data, this))
                .then(function (dataResult) {
                if (_type === DownloadType.Png
                    || _type === DownloadType.Webp
                    || _type === DownloadType.Jpeg
                    || _type === DownloadType.Bmp) {
                    dataResult.text().then(function (text) { return downloadFile(text, _type); });
                }
                else if (_type === DownloadType.Xmind) {
                    downloadFile(URL.createObjectURL(dataResult), 'xmind');
                }
                else if (_type === DownloadType.Json) {
                    downloadFile(URL.createObjectURL(dataResult), 'json');
                }
            });
            return this;
        };
        return class_1;
    }(Base));
});
