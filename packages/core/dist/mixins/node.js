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
import { NodeFeatures, } from '../interface';
import { fillNodeIds, getNodeElements, } from '../base/utils';
import { traverseData, } from '../utils/traverseData';
import { findNodeById, getModel, } from '../utils/G6Ext';
import { refreshTextEditorPosition, } from '../base/editor';
import { pluckDataFromModels, dataItemGetter, nodeItemGetter, } from '../utils/dataGetter';
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
            this.commander.addExec({
                cmd: NodeFeatures.Commands.SelectNode,
                opts: {
                    nodeIds: nodeIds,
                },
            });
            return this;
        };
        class_1.prototype.unselectNode = function (nodeIds) {
            this.commander.addExec({
                cmd: NodeFeatures.Commands.UnselectNode,
                opts: {
                    nodeIds: nodeIds,
                },
            });
            return this;
        };
        class_1.prototype.clearAllSelectedNode = function () {
            if (!this.hasSelectedNode()) {
                return this;
            }
            this.commander.addExec({
                cmd: NodeFeatures.Commands.ClearAllSelectedNode,
                opts: {},
            });
            return this;
        };
        class_1.prototype.selectMoveUp = function () {
            // 未选中节点
            if (!this.hasSelectedNode()) {
                return this;
            }
            var id = this.getSelectedNodeId();
            var upwardNodeId = getUDNodeId(this, id, 'up');
            this.commander.commandNewGroup();
            if (upwardNodeId !== null) {
                this.clearAllSelectedNode();
                this.selectNode(upwardNodeId);
            }
            this.commander.commandExecGroup();
            return this;
        };
        class_1.prototype.selectMoveDown = function () {
            // 未选中节点
            if (!this.hasSelectedNode()) {
                return this;
            }
            var id = this.getSelectedLastNodeId();
            var downwardNodeId = getUDNodeId(this, id, 'down');
            this.commander.commandNewGroup();
            if (downwardNodeId !== null) {
                this.clearAllSelectedNode();
                this.selectNode(downwardNodeId);
            }
            this.commander.commandExecGroup();
            return this;
        };
        class_1.prototype.selectMoveBefore = function () {
            // 未选中节点
            if (!this.hasSelectedNode()) {
                return this;
            }
            var id = this.getSelectedNodeId();
            var node = findNodeById(this.graph, id);
            var inEdges = node.getInEdges();
            // 无父节点
            if (!inEdges[0]) {
                return this;
            }
            var parentNode = inEdges[0].getSource();
            var parentModel = getModel(parentNode);
            this.commander.commandNewGroup();
            this.clearAllSelectedNode();
            this.selectNode(parentModel.id);
            this.commander.commandExecGroup();
            return this;
        };
        class_1.prototype.selectMoveAfter = function () {
            // 未选中节点
            if (!this.hasSelectedNode()) {
                return this;
            }
            var id = this.getSelectedLastNodeId();
            var node = findNodeById(this.graph, id);
            var outEdges = node.getOutEdges();
            // 无子节点
            if (!outEdges[0]) {
                return this;
            }
            // 移动到中间的节点
            var index = Math.ceil((outEdges.length - 1) / 2);
            var childNode = outEdges[index].getTarget();
            var childModel = getModel(childNode);
            this.commander.commandNewGroup();
            this.clearAllSelectedNode();
            this.selectNode(childModel.id);
            this.commander.commandExecGroup();
            return this;
        };
        class_1.prototype.removeNode = function (nodeIds, _refresh) {
            if (_refresh === void 0) { _refresh = true; }
            this.commander.addExec({
                cmd: NodeFeatures.Commands.RemoveNode,
                opts: {
                    nodeIds: nodeIds,
                    _refresh: _refresh,
                },
            });
            return this;
        };
        class_1.prototype.insertSubNode = function (nodeId, datas, index, _refresh) {
            if (index === void 0) { index = -1; }
            if (_refresh === void 0) { _refresh = true; }
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            var isSingle = !Array.isArray(datas);
            var children = model.folded ? model._foldedChildren : model.children;
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
            var models = [];
            for (var _index in _datas) {
                models[_index] = traverseData(_datas[_index]);
            }
            this.commander.addExec({
                cmd: NodeFeatures.Commands.InsertSubNode,
                opts: {
                    nodeId: nodeId,
                    models: models,
                    index: index,
                    _refresh: _refresh,
                },
            });
            return isSingle ? models[0].id : map(models, 'id');
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
        class_1.prototype.appendUniqueNode = function (nodeId, data) {
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            if (model._isRoot) {
                return null;
            }
            data.children = pluckDataFromModels(model.children, nodeItemGetter, this);
            var appendModel = traverseData(data);
            var childrenIds = map(data.children, 'id');
            this.commander.commandNewGroup();
            this.removeNode(childrenIds);
            var newId = this.insertSubNode(nodeId, appendModel, 0);
            this.commander.commandExecGroup();
            return newId;
        };
        class_1.prototype.prependParentNode = function (nodeIds, data) {
            var ids = fillNodeIds(nodeIds);
            var nodes = [];
            var models = [];
            var parentNodes = [];
            var parentModels = [];
            var hasSameParent = true;
            var hasRoot = false;
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                var node = findNodeById(this.graph, id);
                var model = getModel(node);
                if (model._isRoot) {
                    hasRoot = true;
                    break;
                }
                var parentNode = node.getInEdges()[0].getSource();
                var parentModel = getModel(parentNode);
                if (parentNodes.length > 0 && parentNodes.indexOf(parentNode) === -1) {
                    hasSameParent = false;
                }
                nodes.push(node);
                models.push(model);
                parentNodes.push(parentNode);
                parentModels.push(parentModel);
            }
            if (hasRoot || !hasSameParent) {
                return null;
            }
            data.children = pluckDataFromModels(models, dataItemGetter, this);
            var indexOfParent = parentModels[0].children.indexOf(models[0]);
            var appendModel = traverseData(data);
            this.commander.commandNewGroup();
            this.removeNode(nodeIds);
            var newId = this.insertSubNode(parentModels[0].id, appendModel, indexOfParent);
            this.commander.commandExecGroup();
            return newId;
        };
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
            this.commander.commandNewGroup();
            this.removeNode(nodeId);
            this.insertSubNode(parentModel.id, model, indexOfParent - 1);
            this.commander.commandExecGroup();
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
            this.commander.commandNewGroup();
            this.removeNode(nodeId);
            this.insertSubNode(parentModel.id, model, indexOfParent + 1);
            this.commander.commandExecGroup();
            return this;
        };
        class_1.prototype.copyNodes = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var datas = [];
            for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
                var id = ids_2[_i];
                var model = getModel(findNodeById(this.graph, id));
                datas.push(pluckDataFromModels([model], dataItemGetter, this)[0]);
            }
            return datas;
        };
        class_1.prototype.cutNodes = function (nodeIds) {
            var datas = this.copyNodes(nodeIds);
            this.removeNode(nodeIds);
            return datas;
        };
        class_1.prototype.pasteNodes = function (parentNodeIds, datas) {
            var ids = fillNodeIds(parentNodeIds);
            var insertIds = [];
            this.commander.commandNewGroup();
            for (var _i = 0, ids_3 = ids; _i < ids_3.length; _i++) {
                var id = ids_3[_i];
                var insertId = this.insertSubNode(id, datas, -1);
                if (typeof insertId === 'string') {
                    insertIds.push(insertId);
                }
                else {
                    insertIds = insertIds.concat(insertId);
                }
            }
            this.commander.commandExecGroup();
            return insertIds;
        };
        class_1.prototype.hasSelectedNode = function () {
            return !(this.getSelectedNodeId() === null);
        };
        return class_1;
    }(Base));
});
