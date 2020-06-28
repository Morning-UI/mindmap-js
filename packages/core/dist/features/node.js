import { NodeFeatures, } from '../interface';
import { fillNodeIds, getNodeElements, } from '../base/utils';
import { traverseData, } from '../utils/traverseData';
import { findNodeById, getModel, } from '../utils/G6Ext';
import { setItemState, } from '../utils/setItemState';
import { pluckDataFromModels, nodeItemGetter, } from '../utils/dataGetter';
import { mindNodeAdjustPosition, } from '../nodes/mindNode';
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
export var selectNode = function (options) {
    var nodeIds = options.nodeIds, mindmap = options.mindmap;
    var ids = fillNodeIds(nodeIds);
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        setItemState(mindmap.graph, id, 'selected', true);
    }
    // return mindmap;
    return {
        note: '选中节点',
        undoCmd: {
            cmd: NodeFeatures.Commands.UnselectNode,
            opts: {
                nodeIds: nodeIds,
            },
        },
    };
};
export var unselectNode = function (options) {
    var nodeIds = options.nodeIds, mindmap = options.mindmap;
    var ids = fillNodeIds(nodeIds);
    for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
        var id = ids_2[_i];
        setItemState(mindmap.graph, id, 'selected', false);
    }
    return {
        note: '取消选中节点',
        undoCmd: {
            cmd: NodeFeatures.Commands.SelectNode,
            opts: {
                nodeIds: nodeIds,
            },
        },
    };
};
export var clearAllSelectedNode = function (options) {
    var mindmap = options.mindmap;
    var selectedState = 'selected';
    var graph = mindmap.graph;
    var autoPaint = graph.get('autoPaint');
    var nodeItems = graph.findAllByState('node', selectedState);
    var edgeItems = graph.findAllByState('edge', selectedState);
    var nodeIds = [];
    graph.setAutoPaint(false);
    nodeItems.forEach(function (node) {
        setItemState(graph, node.get('id'), selectedState, false);
        nodeIds.push(node.get('id'));
    });
    edgeItems.forEach(function (edge) { return setItemState(graph, edge.get('id'), selectedState, false); });
    graph.paint();
    graph.setAutoPaint(autoPaint);
    return {
        note: '取消选中所有节点',
        undoCmd: {
            cmd: NodeFeatures.Commands.SelectNode,
            opts: {
                nodeIds: nodeIds,
            },
        },
    };
};
export var removeNode = function (options) {
    var nodeIds = options.nodeIds, mindmap = options.mindmap, _refresh = options._refresh;
    var ids = fillNodeIds(nodeIds);
    var undoCmds = [];
    for (var _i = 0, ids_3 = ids; _i < ids_3.length; _i++) {
        var id = ids_3[_i];
        var node = findNodeById(mindmap.graph, id);
        if (!node) {
            return null;
        }
        var model = getModel(node);
        var parent_1 = node.getInEdges()[0].getSource();
        var parentModel = getModel(parent_1);
        var parentChildren = parentModel.folded ? parentModel._foldedChildren : parentModel.children;
        var indexOfParent = parentChildren.indexOf(model);
        parentChildren.splice(indexOfParent, 1);
        undoCmds.unshift({
            cmd: NodeFeatures.Commands.InsertSubNode,
            opts: {
                nodeId: parentModel.id,
                models: pluckDataFromModels([model], nodeItemGetter, mindmap),
                index: indexOfParent,
                _refresh: false,
            },
        });
        var elements = getNodeElements(parent_1);
        mindNodeAdjustPosition(elements, parentModel, mindmap);
    }
    if (_refresh) {
        mindmap.graph.changeData();
        mindmap.graph.layout();
    }
    // [性能优化]最后一次undo进行refresh
    undoCmds[undoCmds.length - 1].opts._refresh = true;
    return {
        note: '删除节点',
        undoCmd: undoCmds,
    };
};
export var insertSubNode = function (options) {
    var nodeId = options.nodeId, models = options.models, index = options.index, _refresh = options._refresh, mindmap = options.mindmap;
    var node = findNodeById(mindmap.graph, nodeId);
    var model = getModel(node);
    var children = model.folded ? model._foldedChildren : model.children;
    var undoCmds = [];
    // 如果传入的models没有经过traverseData，则traverseData一次
    for (var _index in models) {
        if (models[_index]._isNode === undefined) {
            models[_index] = traverseData(models[_index]);
        }
    }
    if (index > -1) {
        models.reverse();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var item = models_1[_i];
            children.splice(index, 0, item);
        }
    }
    else {
        for (var _a = 0, models_2 = models; _a < models_2.length; _a++) {
            var item = models_2[_a];
            children.push(item);
        }
    }
    for (var _b = 0, models_3 = models; _b < models_3.length; _b++) {
        var item = models_3[_b];
        undoCmds.push({
            cmd: NodeFeatures.Commands.RemoveNode,
            opts: {
                nodeIds: item.id,
                _refresh: false,
            },
        });
    }
    if (_refresh) {
        // 刷新当前节点的展开按钮
        node.draw();
        mindmap.graph.changeData();
        mindmap.graph.layout();
    }
    // [性能优化]最后一次undo进行refresh
    undoCmds[undoCmds.length - 1].opts._refresh = true;
    return {
        note: '为节点插入子节点',
        undoCmd: undoCmds,
    };
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,max-lines-per-function
// export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
//     class extends Base implements NodeFeatures.Mixins {
//         focusNodeTextEditor (nodeId: NodeId, clean = false): this {
//             const node = findNodeById(this.graph, nodeId);
//             const elements = getNodeElements(node);
//             this.editting = true;
//             this.editElements = elements;
//             this.editNode = node;
//             refreshTextEditorPosition(this);
//             elements.text.attr({
//                 opacity : 0,
//             });
//             this.editNode.setState('editing', true);
//             this.graph.paint();
//             this._options.$editorInput.focus();
//             if (clean) {
//                 setTimeout(() => {
//                     this.editContent = this
//                         .editContent
//                         .split('')
//                         .slice(-1)
//                         .join('');
//                     this.editorInput(this.editContent);
//                 });
//             }
//             return this;
//         }
//         blurNodeTextEditor (): this {
//             if (!this.editting) {
//                 return this;
//             }
//             const elements = getNodeElements(this.editNode);
//             elements.text.attr({
//                 opacity : 1,
//             });
//             this.graph.paint();
//             this._options.$editor.style.display = 'none';
//             this.editContent = '';
//             this.editElements = {};
//             this.editZoom = 1;
//             this.editNode.setState('editing', false);
//             this.editNode = null;
//             this.graph.layout();
//             setTimeout(() => {
//                 this.editting = false;
//             });
//             return this;
//         }
//         nodeMoveUp (nodeId: NodeId): this {
//             const node = findNodeById(this.graph, nodeId);
//             const model = getModel(node);
//             if (model._isRoot) {
//                 return null;
//             }
//             const parentNode = node.getInEdges()[0].getSource();
//             const parentModel = getModel(parentNode);
//             const indexOfParent = parentModel.children.indexOf(model);
//             if (indexOfParent === 0) {
//                 return this;
//             }
//             swapArr(parentModel.children, indexOfParent, indexOfParent - 1);
//             this.graph.changeData();
//             this.graph.refreshLayout();
//             return this;
//         }
//         nodeMoveDown (nodeId: NodeId): this {
//             const node = findNodeById(this.graph, nodeId);
//             const model = getModel(node);
//             if (model._isRoot) {
//                 return null;
//             }
//             const parentNode = node.getInEdges()[0].getSource();
//             const parentModel = getModel(parentNode);
//             const indexOfParent = parentModel.children.indexOf(model);
//             if (indexOfParent === parentModel.children.length - 1) {
//                 return this;
//             }
//             swapArr(parentModel.children, indexOfParent, indexOfParent + 1);
//             this.graph.changeData();
//             this.graph.refreshLayout();
//             return this;
//         }
//         copyNodes (nodeIds: NodeIds): MindmapDataItems {
//             const ids = fillNodeIds(nodeIds);
//             const datas: MindmapDataItems = [];
//             for (const id of ids) {
//                 const model = getModel(findNodeById(this.graph, id));
//                 datas.push(pluckDataFromModels<MindmapDataItem>([model], dataItemGetter, this)[0]);
//             }
//             return datas;
//         }
//         cutNodes (nodeIds: NodeIds): MindmapDataItems {
//             const datas = this.copyNodes(nodeIds);
//             this.removeNode(nodeIds);
//             return datas;
//         }
//         pasteNodes (parentNodeIds: NodeIds, datas: MindmapDataItems): NodeIds {
//             const ids = fillNodeIds(parentNodeIds);
//             let insertIds: NodeIds = [];
//             for (const id of ids) {
//                 const insertId: NodeIds = this.insertSubNode(id, datas, -1);
//                 if (typeof insertId === 'string') {
//                     insertIds.push(insertId);
//                 } else {
//                     insertIds = insertIds.concat(insertId);
//                 }
//             }
//             return insertIds;
//         }
//         hasSelectedNode (): boolean {
//             return !(this.getSelectedNodeId() === null);
//         }
//     };
