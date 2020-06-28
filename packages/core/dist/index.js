import { EventNames, } from './interface';
import { manualPaint, } from './base/graph';
import { getNodeElements, } from './base/utils';
import { refreshTextEditorPosition, } from './base/editor';
import { mindNodeAdjustPosition, NODE_SHAPE_INDEX, } from './nodes/mindNode';
import mixinConstructor from './mixins/constructor';
import mixinLink from './mixins/link';
import mixinNote from './mixins/note';
import mixinTag from './mixins/tag';
import mixinMark from './mixins/mark';
import mixinContextMenu from './mixins/contextMenu';
import mixinNode from './mixins/node';
import mixinGet from './mixins/get';
import mixinFold from './mixins/fold';
import mixinZoom from './mixins/zoom';
import mixinExport from './mixins/export';
import mixinReadData from './mixins/readData';
import mixinClipboard from './mixins/clipboard';
import mixinCommand from './mixins/command';
var MindmapCoreBase = /** @class */ (function () {
    function MindmapCoreBase() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.dragging = false;
        this.editting = false;
        this.isMindmap = true;
        this.eventList = {};
        this.keydownState = {
            mod: false,
            shift: false,
        };
        return this;
    }
    MindmapCoreBase.prototype.editorInput = function (content) {
        var _this = this;
        if (this.editting) {
            var elements_1 = getNodeElements(this.editNode);
            manualPaint(this.graph, function () {
                elements_1.text.attr({
                    text: content,
                });
                _this.editNode.update({
                    text: content,
                });
                _this.graph.paint();
                mindNodeAdjustPosition(elements_1, _this.editNode.getModel(), _this);
                refreshTextEditorPosition(_this);
            });
        }
        return this;
    };
    MindmapCoreBase.prototype.on = function (eventName, callback) {
        if (this.eventList[eventName] === undefined) {
            this.eventList[eventName] = [];
        }
        // this.eventList[eventName].push(callback);
        switch (eventName) {
            case EventNames.EditContentChange:
                this.eventList[eventName].push(callback);
                break;
            case EventNames.ZoomChange:
                this.eventList[eventName].push(callback);
                break;
            default:
                break;
        }
        return this;
    };
    MindmapCoreBase.prototype.emit = function (eventName) {
        var fns = this.eventList[eventName];
        if (!fns) {
            return this;
        }
        for (var _i = 0, fns_1 = fns; _i < fns_1.length; _i++) {
            var fn = fns_1[_i];
            switch (eventName) {
                case EventNames.EditContentChange:
                    fn(this.editContent);
                    break;
                case EventNames.ZoomChange:
                    fn(this.graph.getZoom());
                    break;
                default:
                    break;
            }
        }
        return this;
    };
    MindmapCoreBase.prototype.openLink = function (nodeId) {
        var node = this.graph.findById(nodeId);
        var model = node.getModel();
        if (model.link) {
            window.open(model.link);
        }
        return this;
    };
    MindmapCoreBase.prototype.getNodeBBox = function (nodeId) {
        var node = this.graph.findById(nodeId);
        var group = node.getContainer();
        var bbox = {
            _node: node.getBBox(),
        };
        for (var name_1 in NODE_SHAPE_INDEX) {
            bbox[name_1] = group.getChildByIndex(NODE_SHAPE_INDEX[name_1]).getBBox();
        }
        return bbox;
    };
    return MindmapCoreBase;
}());
export { MindmapCoreBase };
/* eslint-disable */
// LO includes : corebase.
// L1(base function) includes : link/note/tag.
// L2(advance function) includes : contextmenu/node, L2 which is public core.
var MindmapCoreL1 = mixinZoom(mixinTag(mixinMark(mixinNote(mixinLink(mixinGet(mixinFold(MindmapCoreBase)))))));
var MindmapCoreL2 = mixinReadData(mixinNode(mixinContextMenu(MindmapCoreL1)));
var MindmapCoreL3 = mixinExport(mixinClipboard(mixinCommand(MindmapCoreL2)));
var MindmapCore = mixinConstructor(MindmapCoreL3);
/* eslint-enable */
export default MindmapCore;
export * from './utils/testData';
export * from './interface';
