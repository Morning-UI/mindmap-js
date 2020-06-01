import * as G6 from '@antv/g6';
// import * as G6Graph                             from '@antv/g6/lib/interface/graph';
import { EventNames, } from './interface';
import { create, traverseData, register, bindEvent, manualPaint, } from './base/graph';
import { getNodeElements, } from './base/utils';
import { refreshTextEditorPosition, } from './base/editor';
import { mindNodeAdjustPosition, } from './nodes/mindNode';
import mixinLink from './features/link';
import mixinContextMenu from './features/contextMenu';
var MindmapCore = /** @class */ (function () {
    function MindmapCore(options) {
        this.dragging = false;
        this.editting = false;
        this.eventList = {};
        this.keydownState = {
            mod: false,
        };
        register(this);
        this.graph = create(this, options);
        this.G6 = G6;
        bindEvent(this);
        // this._options.$editorInput = this._options.$editor.querySelector('textarea');
        return this;
    }
    MindmapCore.prototype.readData = function (data) {
        var _this = this;
        this.data = traverseData(data);
        this.graph.read(this.data);
        setTimeout(function () {
            _this.graph.refreshLayout(true);
            // this.$refs['mor-mindmap-zoomslider'].set(vm.getZoom() * 100);
        });
        return this;
    };
    MindmapCore.prototype.clearSelectedNode = function () {
        var selectedState = 'selected';
        var graph = this.graph;
        var autoPaint = graph.get('autoPaint');
        var nodeItems = graph.findAllByState('node', selectedState);
        var edgeItems = graph.findAllByState('edge', selectedState);
        graph.setAutoPaint(false);
        nodeItems.forEach(function (node) { return graph.setItemState(node, selectedState, false); });
        edgeItems.forEach(function (edge) { return graph.setItemState(edge, selectedState, false); });
        graph.paint();
        graph.setAutoPaint(autoPaint);
        return this;
    };
    MindmapCore.prototype.focusNodeTextEditor = function (nodeId, clean) {
        if (clean === void 0) { clean = false; }
        var node = this.graph.findById(nodeId);
        var elements = getNodeElements(node);
        this.editting = true;
        this.editElements = elements;
        this.editNode = node;
        refreshTextEditorPosition(this);
        elements.text.attr({
            opacity: 0,
        });
        this.editNode.setState('editing', true);
        this.graph.paint();
        this._options.$editorInput.focus();
        // if (clean) {
        //     setTimeout(() => {
        //         this.data.editContent = this
        //             .data
        //             .editContent
        //             .split('')
        //             .slice(-1)
        //             .join('');
        //         editInput(this);
        //     });
        // }
        // TODO : 实现聚焦
        return this;
    };
    MindmapCore.prototype.blurNodeTextEditor = function () {
        var _this = this;
        if (!this.editting) {
            return this;
        }
        var elements = getNodeElements(this.editNode);
        elements.text.attr({
            opacity: 1,
        });
        this.graph.paint();
        this._options.$editor.style.display = 'none';
        this.editContent = '';
        this.editElements = {};
        this.editZoom = 1;
        this.editNode.setState('editing', false);
        this.editNode = null;
        this.graph.refreshLayout();
        setTimeout(function () {
            _this.editting = false;
        });
        return this;
    };
    MindmapCore.prototype.editorInput = function (content) {
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
                mindNodeAdjustPosition(elements_1, _this.editNode.getModel());
                refreshTextEditorPosition(_this);
            });
        }
        return this;
    };
    MindmapCore.prototype.on = function (eventName, callback) {
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
    MindmapCore.prototype.emit = function (eventName) {
        var fns = this.eventList[eventName];
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
    MindmapCore.prototype.showLink = function (nodeId) {
        var node = this.graph.findById(nodeId);
        var model = node.getModel();
        if (model.link) {
            window.open(model.link);
        }
        return this;
    };
    return MindmapCore;
}());
var MindmapClass;
MindmapClass = mixinLink(MindmapCore);
MindmapClass = mixinContextMenu(MindmapClass);
export default MindmapClass;
export var EventNamesEnum = EventNames;
