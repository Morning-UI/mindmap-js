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
import { DownloadType, } from '../interface';
import { pluckDataFromModels, nodeItemGetter, } from '../utils/dataGetter';
var IMAGE_PADDING = 20;
var exportImage = function (data, mindmap, type) {
    return new Promise(function (resolve) {
        var rootNodeId = String(mindmap.getRootNodeId());
        var rootNodeModel = mindmap.graph.findById(rootNodeId).getModel();
        // TODO：导出后画布恢复原有的位置
        // TODO：显示导出遮罩
        mindmap.readData(data);
        setTimeout(function () {
            mindmap.graph.toFullDataURL(function (res) {
                resolve(res);
                mindmap.readData(rootNodeModel);
            }, type, {
                padding: IMAGE_PADDING,
                backgroundColor: '#fff',
            });
        });
    });
};
var exportProcesser = {
    jsonObj: function (data, mindmap) {
        return pluckDataFromModels(data, nodeItemGetter, mindmap);
    },
    json: function (data, mindmap) {
        var exportData = pluckDataFromModels(data, nodeItemGetter, mindmap);
        return Promise.resolve(JSON.stringify(exportData, null, 4));
    },
    png: function (data, mindmap) { return exportImage(data[0], mindmap, 'image/png'); },
    webp: function (data, mindmap) { return exportImage(data[0], mindmap, 'image/webp'); },
    jpeg: function (data, mindmap) { return exportImage(data[0], mindmap, 'image/jpeg'); },
    bmp: function (data, mindmap) { return exportImage(data[0], mindmap, 'image/bmp'); },
    xmind: function (data, mindmap) {
        // TODO
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
        class_1.prototype.exportToObject = function (nodeId) {
            var _nodeId = nodeId;
            if (_nodeId === undefined) {
                _nodeId = this.getRootNodeId();
            }
            var data = [this.graph.findById(String(_nodeId)).getModel()];
            return exportProcesser.jsonObj(data, this);
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
                    downloadFile(dataResult, _type);
                }
                else if (_type === DownloadType.Xmind) {
                    downloadFile(URL.createObjectURL(dataResult), 'xmind');
                }
                else if (_type === DownloadType.Json) {
                    downloadFile(URL.createObjectURL(new Blob([dataResult])), 'json');
                }
            });
            return this;
        };
        return class_1;
    }(Base));
});
