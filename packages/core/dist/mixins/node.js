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
import map from 'lodash.map';
import { fillNodeIds, getNodeElements, } from '../base/utils';
import { traverseData, } from '../utils/traverseData';
import { findNodeById, getModel, } from '../utils/G6Ext';
import { setItemState, } from '../utils/setItemState';
import { refreshTextEditorPosition, } from '../base/editor';
var getUDNodeId = function (mindmap, nodeId, type) {
    var model = mindmap.getNode(nodeId);
    var node = findNodeById(mindmap.graph, nodeId);
    var inEdges = node.getInEdges();
    // 无父节点
    if (!inEdges[0]) {
        return null;
    }
    var parentNode = inEdges[0].getSource();
    var parentModel = getModel(parentNode);
    var parentChildren = parentModel.children;
    var indexOfParentChildren = parentChildren.indexOf(model);
    var UDNodeId;
    if (type === 'up' && indexOfParentChildren > 0) {
        UDNodeId = parentChildren[indexOfParentChildren - 1].id;
    }
    else if (type === 'down' && indexOfParentChildren < parentChildren.length - 1) {
        UDNodeId = parentChildren[indexOfParentChildren + 1].id;
    }
    else if ((type === 'up' && indexOfParentChildren === 0)
        || (type === 'down' && indexOfParentChildren === parentChildren.length - 1)) {
        var parentUDNodeId = getUDNodeId(mindmap, parentModel.id, type);
        // 当前节点父节点没有前同级节点
        if (parentUDNodeId === null) {
            UDNodeId = null;
        }
        else {
            var parentUDNode = findNodeById(mindmap.graph, parentUDNodeId);
            var parentUDModel = getModel(parentUDNode);
            var parentUDChilren = parentUDModel.children;
            if (parentUDChilren && parentUDChilren.length > 0) {
                // 在祖先节点上找到最近的兄弟节点
                if (type === 'up') {
                    UDNodeId = parentUDChilren[parentUDChilren.length - 1].id;
                }
                else if (type === 'down') {
                    UDNodeId = parentUDChilren[0].id;
                }
            }
            else {
                // 无兄弟节点，采用最近的祖先节点
                UDNodeId = parentUDNodeId;
            }
        }
    }
    return UDNodeId;
};
var swapArr = function (children, fromIndex, toIndex) {
    children[toIndex] = children.splice(fromIndex, 1, children[toIndex])[0];
    return children;
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,max-lines-per-function
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.focusNodeTextEditor = function (nodeId, clean) {
            var _this = this;
            if (clean === void 0) { clean = false; }
            var node = findNodeById(this.graph, nodeId);
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
            if (clean) {
                setTimeout(function () {
                    _this.editContent = _this
                        .editContent
                        .split('')
                        .slice(-1)
                        .join('');
                    _this.editorInput(_this.editContent);
                });
            }
            return this;
        };
        class_1.prototype.blurNodeTextEditor = function () {
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
            this.graph.layout();
            setTimeout(function () {
                _this.editting = false;
            });
            return this;
        };
        class_1.prototype.selectNode = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                setItemState(this.graph, id, 'selected', true);
            }
            return this;
        };
        class_1.prototype.unselectNode = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
                var id = ids_2[_i];
                setItemState(this.graph, id, 'selected', false);
            }
            return this;
        };
        class_1.prototype.clearAllSelectedNode = function () {
            var selectedState = 'selected';
            var graph = this.graph;
            var autoPaint = graph.get('autoPaint');
            var nodeItems = graph.findAllByState('node', selectedState);
            var edgeItems = graph.findAllByState('edge', selectedState);
            graph.setAutoPaint(false);
            nodeItems.forEach(function (node) { return setItemState(graph, node.get('id'), selectedState, false); });
            edgeItems.forEach(function (edge) { return setItemState(graph, edge.get('id'), selectedState, false); });
            graph.paint();
            graph.setAutoPaint(autoPaint);
            return this;
        };
        class_1.prototype.selectMoveUp = function () {
            var id = this.getSelectedLastNodeId();
            // 未选中节点
            if (!id) {
                return this;
            }
            var upwardNodeId = getUDNodeId(this, id, 'up');
            if (upwardNodeId !== null) {
                this.clearAllSelectedNode();
                this.selectNode(upwardNodeId);
            }
            return this;
        };
        class_1.prototype.selectMoveDown = function () {
            var id = this.getSelectedLastNodeId();
            // 未选中节点
            if (!id) {
                return this;
            }
            var downwardNodeId = getUDNodeId(this, id, 'down');
            if (downwardNodeId !== null) {
                this.clearAllSelectedNode();
                this.selectNode(downwardNodeId);
            }
            return this;
        };
        class_1.prototype.selectMoveBefore = function () {
            var id = this.getSelectedNodeId();
            // 未选中节点
            if (!id) {
                return this;
            }
            var node = findNodeById(this.graph, id);
            var inEdges = node.getInEdges();
            // 无父节点
            if (!inEdges[0]) {
                return this;
            }
            var parentNode = inEdges[0].getSource();
            var parentModel = getModel(parentNode);
            this.clearAllSelectedNode();
            this.selectNode(parentModel.id);
            return this;
        };
        class_1.prototype.selectMoveAfter = function () {
            var id = this.getSelectedLastNodeId();
            // 未选中节点
            if (!id) {
                return this;
            }
            var node = findNodeById(this.graph, id);
            var outEdges = node.getOutEdges();
            // 无父节点
            if (!outEdges[0]) {
                return this;
            }
            var childNode = outEdges[0].getTarget();
            var childModel = getModel(childNode);
            this.clearAllSelectedNode();
            this.selectNode(childModel.id);
            return this;
        };
        class_1.prototype.removeNode = function (nodeIds, _refresh) {
            if (_refresh === void 0) { _refresh = true; }
            var ids = fillNodeIds(nodeIds);
            for (var _i = 0, ids_3 = ids; _i < ids_3.length; _i++) {
                var id = ids_3[_i];
                var node = findNodeById(this.graph, id);
                if (!node) {
                    return this;
                }
                var model = getModel(node);
                var parent_1 = node.getInEdges()[0].getSource();
                var parentModel = getModel(parent_1);
                var parentChildren = parentModel.folded ? parentModel._foldedChildren : parentModel.children;
                var indexOfParent = parentChildren.indexOf(model);
                parentChildren.splice(indexOfParent, 1);
            }
            if (_refresh) {
                this.graph.changeData();
                this.graph.layout();
            }
            return this;
        };
        class_1.prototype.insertSubNode = function (nodeId, datas, index, _refresh) {
            if (index === void 0) { index = -1; }
            if (_refresh === void 0) { _refresh = true; }
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            // let parent = node.getInEdges()[0].getSource();
            var children = model.folded ? model._foldedChildren : model.children;
            var isSingle = !Array.isArray(datas);
            var _datas = datas;
            if (children === undefined) {
                if (model.folded) {
                    model._foldedChildren = [];
                    children = model._foldedChildren;
                }
                else {
                    model.children = [];
                    children = model.children;
                }
            }
            if (!Array.isArray(_datas)) {
                _datas = [_datas];
            }
            var _nodeItems = [];
            for (var _index in _datas) {
                _nodeItems[_index] = traverseData(_datas[_index]);
            }
            if (index > -1) {
                _nodeItems.reverse();
                for (var _i = 0, _nodeItems_1 = _nodeItems; _i < _nodeItems_1.length; _i++) {
                    var item = _nodeItems_1[_i];
                    children.splice(index, 0, item);
                }
            }
            else {
                for (var _a = 0, _nodeItems_2 = _nodeItems; _a < _nodeItems_2.length; _a++) {
                    var item = _nodeItems_2[_a];
                    children.push(item);
                }
            }
            if (_refresh) {
                // 刷新当前节点的展开按钮
                node.draw();
                this.graph.changeData();
                this.graph.layout();
            }
            if (isSingle) {
                return _nodeItems[0].id;
            }
            return map(_nodeItems, 'id');
        };
        class_1.prototype.insertUpwardNode = function (nodeId, datas) {
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            if (model._isRoot) {
                return null;
            }
            var parentNode = node.getInEdges()[0].getSource();
            var parentModel = getModel(parentNode);
            var indexOfParent = parentModel.children.indexOf(model);
            return this.insertSubNode(parentModel.id, datas, indexOfParent);
        };
        class_1.prototype.insertDownwardNode = function (nodeId, datas) {
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            if (model._isRoot) {
                return null;
            }
            var parentNode = node.getInEdges()[0].getSource();
            var parentModel = getModel(parentNode);
            var indexOfParent = parentModel.children.indexOf(model);
            return this.insertSubNode(parentModel.id, datas, indexOfParent + 1);
        };
        class_1.prototype.insertFirstNode = function (nodeId, datas) {
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            if (model._isRoot) {
                return null;
            }
            var parentNode = node.getInEdges()[0].getSource();
            var parentModel = getModel(parentNode);
            return this.insertSubNode(parentModel.id, datas, 0);
        };
        class_1.prototype.insertLastNode = function (nodeId, datas) {
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            if (model._isRoot) {
                return null;
            }
            var parentNode = node.getInEdges()[0].getSource();
            var parentModel = getModel(parentNode);
            return this.insertSubNode(parentModel.id, datas);
        };
        class_1.prototype.appendUniqueNode = function (nodeId, datas) { };
        class_1.prototype.prependUniqueNode = function (nodeId, datas) { };
        class_1.prototype.nodeMoveUp = function (nodeId) {
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            if (model._isRoot) {
                return null;
            }
            var parentNode = node.getInEdges()[0].getSource();
            var parentModel = getModel(parentNode);
            var indexOfParent = parentModel.children.indexOf(model);
            if (indexOfParent === 0) {
                return this;
            }
            swapArr(parentModel.children, indexOfParent, indexOfParent - 1);
            this.graph.changeData();
            this.graph.refreshLayout();
            return this;
        };
        class_1.prototype.nodeMoveDown = function (nodeId) {
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            if (model._isRoot) {
                return null;
            }
            var parentNode = node.getInEdges()[0].getSource();
            var parentModel = getModel(parentNode);
            var indexOfParent = parentModel.children.indexOf(model);
            if (indexOfParent === parentModel.children.length - 1) {
                return this;
            }
            swapArr(parentModel.children, indexOfParent, indexOfParent + 1);
            this.graph.changeData();
            this.graph.refreshLayout();
            return this;
        };
        return class_1;
    }(Base));
});
