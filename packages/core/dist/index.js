import * as G6 from '@antv/g6';
// import * as G6Graph                             from '@antv/g6/lib/interface/graph';
import { EventNames, } from './interface';
import { create, register, bindEvent, manualPaint, } from './base/graph';
import { getNodeElements, traverseData, } from './base/utils';
import { refreshTextEditorPosition, } from './base/editor';
import { mindNodeAdjustPosition, } from './nodes/mindNode';
import mixinLink from './features/link';
import mixinNote from './features/note';
import mixinTag from './features/tag';
import mixinContextMenu from './features/contextMenu';
import mixinNode from './features/node';
var MindmapCoreBase = /** @class */ (function () {
    function MindmapCoreBase(options) {
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
    MindmapCoreBase.prototype.readData = function (data) {
        var _this = this;
        this.data = traverseData(data);
        this.graph.read(this.data);
        setTimeout(function () {
            _this.graph.refreshLayout(true);
            // this.$refs['mor-mindmap-zoomslider'].set(vm.getZoom() * 100);
        });
        return this;
    };
    MindmapCoreBase.prototype.clearSelectedNode = function () {
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
    MindmapCoreBase.prototype.focusNodeTextEditor = function (nodeId, clean) {
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
    MindmapCoreBase.prototype.blurNodeTextEditor = function () {
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
    MindmapCoreBase.prototype.showLink = function (nodeId) {
        var node = this.graph.findById(nodeId);
        var model = node.getModel();
        if (model.link) {
            window.open(model.link);
        }
        return this;
    };
    return MindmapCoreBase;
}());
export { MindmapCoreBase };
/* eslint-disable */
// LO includes : corebase.
// L1(base function) includes : link/note/tag.
// L2(advance function) includes : contextmenu/node, L2 which is public core.
var MindmapCoreL1 = mixinTag(mixinNote(mixinLink(MindmapCoreBase)));
var MindmapCoreL2 = mixinNode(mixinContextMenu(MindmapCoreL1));
/* eslint-enable */
export default MindmapCoreL2;
export var EventNamesEnum = EventNames;
