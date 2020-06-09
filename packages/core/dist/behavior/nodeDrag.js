var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import G6 from '@antv/g6';
import throttle from 'lodash.throttle';
import sortBy from 'lodash.sortby';
import { DRAG_NODE_STYLE, } from '../style';
import { toggleNodeVisibility, } from '../base/utils';
import globalData from '../base/globalData';
var dragTarget = null;
var dragHolderParentModel = null;
var dragHolderIndexOfParent = null;
var DRAG_REFRESH_INTERVAL = 160;
var udpateOneDragTarget = function (mindmap, index, dragging, _dragHolderIndexOfParent) {
    var node = dragTarget.nodes[index];
    if (dragging && !dragTarget.hidden) {
        dragTarget.originNodeStyle[index] = {
            height: node.getBBox().height,
        };
        dragTarget.saveModel[index] = node.getModel();
        node.setState('dragging', true);
        node.update({
            _isDragging: true,
            style: G6.Util.deepMix({}, {
                fillOpacity: 0,
            }, node.getModel().style),
        });
        toggleNodeVisibility(node, 'hide', function (type, model) {
            if (type === 'hide') {
                model._isDragging = true;
            }
            else {
                model._isDragging = false;
            }
        });
    }
    else if (!dragging && dragTarget.hidden) {
        var nodeModel = dragTarget.saveModel[index];
        node.setState('dragging', false);
        node.update({
            _isDragging: false,
            style: G6.Util.deepMix({}, {
                fillOpacity: 1,
            }, nodeModel.style),
        });
        toggleNodeVisibility(node, 'show', function (type, model) {
            if (type === 'hide') {
                model._isDragging = true;
            }
            else {
                model._isDragging = false;
            }
        });
        // 如果父节点处于折叠状态，则默认追加到最后
        // TODO
        // if (dragHolderParentModel._collapsed) {
        //     _dragHolderIndexOfParent = -1;
        // }
        mindmap.insertSubNode(dragHolderParentModel.id, nodeModel, _dragHolderIndexOfParent, false);
    }
};
var updateDragTarget = function (mindmap, dragging) {
    if (dragging === void 0) { dragging = false; }
    var targetNodes = dragTarget.nodes;
    var first = true;
    if (!dragging && dragTarget.hidden) {
        var dragNodes = mindmap.graph.findAllByState('node', 'dragging');
        for (var _i = 0, dragNodes_1 = dragNodes; _i < dragNodes_1.length; _i++) {
            var node = dragNodes_1[_i];
            var parentNodeModel = node.getInEdges()[0].getSource().getModel();
            var parentNodeDataChildren = parentNodeModel.children;
            var model = node.getModel();
            var index = parentNodeDataChildren.indexOf(model);
            if (parentNodeModel === dragHolderParentModel
                && index < dragHolderIndexOfParent) {
                dragHolderIndexOfParent--;
            }
            mindmap.removeNode(model.id, false);
        }
    }
    for (var index in targetNodes) {
        if (!first) {
            udpateOneDragTarget(mindmap, Number(index), dragging, dragHolderIndexOfParent + 1);
        }
        else {
            udpateOneDragTarget(mindmap, Number(index), dragging, dragHolderIndexOfParent);
        }
        first = false;
    }
    if (dragging && !dragTarget.hidden) {
        dragTarget.hidden = true;
        mindmap.graph.layout();
    }
    else if (!dragging && dragTarget.hidden) {
        dragTarget.hidden = false;
        dragHolderIndexOfParent += targetNodes.length;
        // 如果父节点处于折叠状态，永远都是0
        // TODO
        // if (dragHolderParentModel._collapsed) {
        //     dragHolderIndexOfParent = 0;
        // }
        mindmap.graph.paint();
        mindmap.graph.changeData();
        mindmap.graph.layout();
    }
};
var fillChildBBox = function (mindmap, bbox, node) {
    var model = node.getModel();
    bbox.conMaxX = bbox.maxX;
    bbox.conMinX = bbox.minX;
    bbox.conMaxY = bbox.maxY;
    bbox.conMinY = bbox.minY;
    // 仅寻找可见的子元素(不考虑折叠的子元素)
    var children = model.children;
    if (!children || children.length === 0) {
        return bbox;
    }
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        var childNode = mindmap.graph.findById(child.id);
        var childBbox = childNode.getBBox();
        if (childBbox.maxX > bbox.conMaxX) {
            bbox.conMaxX = childBbox.maxX;
        }
        if (childBbox.minX < bbox.conMinX) {
            bbox.conMinX = childBbox.minX;
        }
        if (childBbox.maxY > bbox.conMaxY) {
            bbox.conMaxY = childBbox.maxY;
        }
        if (childBbox.minY < bbox.conMinY) {
            bbox.conMinY = childBbox.minY;
        }
    }
    return bbox;
};
var removeOldDragPlaceholder = function (mindmap) {
    // 仅考虑可见的子元素(不考虑折叠的子元素)
    if (dragHolderIndexOfParent > -1 && dragHolderParentModel) {
        var children = dragHolderParentModel.children;
        children.splice(dragHolderIndexOfParent, 1);
    }
    mindmap.graph.changeData();
};
var refreshDragHolder = throttle(function (mindmap, delegateShape, targetNode) {
    // if (!delegateShape) {
    //     return;
    // }
    var nodes = mindmap.graph.getNodes();
    var delegateBbox = delegateShape.getBBox();
    var matchOptions = {};
    var distance;
    var distanceNodes = [];
    delegateBbox.centerX = delegateBbox.x + (delegateBbox.width / 2);
    delegateBbox.centerY = delegateBbox.y + (delegateBbox.height / 2);
    // 按距离对节点排序
    distanceNodes = sortBy(nodes, function (node) {
        var nodeBbox = node.getBBox();
        distance = Math.sqrt(Math.pow(Math.abs(nodeBbox.centerX - delegateBbox.centerX), 2)
            + Math.pow(Math.abs(nodeBbox.centerY - delegateBbox.centerY), 2));
        return distance;
    });
    // 选择最匹配的元素
    // Child[n] : 作为子元素，centerX > Parent.centerX
    for (var _i = 0, distanceNodes_1 = distanceNodes; _i < distanceNodes_1.length; _i++) {
        var node = distanceNodes_1[_i];
        var model = node.getModel();
        if (node === targetNode
            || model._isHolder
            || model._isDragging) {
            // eslint-disable-next-line no-continue
            continue;
        }
        var nodeBbox = fillChildBBox(mindmap, node.getBBox(), node);
        // 如果是root节点无视区域
        if (((mindmap._options.direction === 'LR' && nodeBbox.centerX < delegateBbox.x)
            || model._isRoot)
            && ((nodeBbox.conMaxY > delegateBbox.centerY && delegateBbox.centerY > nodeBbox.conMinY)
                || model._isRoot)) {
            matchOptions.node = node;
            matchOptions.mode = 'childN';
            matchOptions.index = 0;
            matchOptions.hasPlaceholder = false;
            // const model = node.getModel();
            // 仅考虑可见的子元素(不考虑折叠的子元素)
            var children = model.children;
            for (var index in children) {
                var childData = children[index];
                var childBbox = mindmap.graph.findById(childData.id).getBBox();
                if (!childData._isHolder && delegateBbox.centerY > childBbox.centerY) {
                    matchOptions.index = Number(index) + 1;
                }
                if (childData._isHolder) {
                    matchOptions.hasPlaceholder = Number(index);
                }
            }
            break;
        }
    }
    // 清除上一个placeholder
    removeOldDragPlaceholder(mindmap);
    dragHolderParentModel = null;
    dragHolderIndexOfParent = null;
    if (matchOptions.hasPlaceholder < matchOptions.index) {
        matchOptions.index--;
    }
    if (matchOptions.node) {
        // 创建新的placeholder
        var model = matchOptions.node.getModel();
        // 仅寻找可见的子元素(不考虑折叠的子元素)
        if (model.children === undefined) {
            model.children = [];
        }
        dragHolderIndexOfParent = matchOptions.index;
        model.children.splice(matchOptions.index, 0, {
            id: String(globalData.id++),
            type: 'mind-holder-node',
            // eslint-disable-next-line no-magic-numbers
            // TODO 和tag的兼容性
            anchorPoints: [[0, 0.5], [1, 0.5]],
            _isRoot: false,
            _isNode: true,
            _isDragging: false,
            _isHolder: true,
        });
        dragHolderParentModel = model;
        mindmap.graph.paint();
        mindmap.graph.changeData();
        mindmap.graph.layout();
        var node = mindmap.graph.findById(String(globalData.id - 1));
        node.getInEdges()[0].update({
            type: 'mind-holder-edge',
        });
    }
}, DRAG_REFRESH_INTERVAL);
var updateDelegate = function (options) {
    var mindmap = options.mindmap, evt = options.evt, dragOptions = options.dragOptions;
    // 如果还没创建代理元素
    if (dragOptions.delegateShape === null) {
        var parentGroup = mindmap.graph.get('group');
        var delegateShapeAttr = {
            fill: DRAG_NODE_STYLE.bgColor,
            stroke: DRAG_NODE_STYLE.borderColor,
            lineWidth: DRAG_NODE_STYLE.borderWidth,
            lineDash: DRAG_NODE_STYLE.borderDash,
        };
        if (dragOptions.type === 'select') {
            // const {
            //     x,
            //     y,
            //     width,
            //     height,
            //     minX,
            //     minY
            // } = this._calculationGroupPosition();
            // this.originPoint = {
            //     x,
            //     y,
            //     width,
            //     height,
            //     minX,
            //     minY
            // };
            // this.dragOptions.delegateShape = parent.addShape('rect', {
            //     attrs : Object.assign({
            //         width,
            //         height,
            //         x,
            //         y
            //     }, delegateShapeAttr)
            // });
            // dragTarget = {
            //     nodes : this.targets,
            //     hidden : false,
            //     originNodeStyle : {},
            //     saveModel : {}
            // };
        }
        else if (dragOptions.type === 'unselect-single') {
            var keyShape = dragOptions.targets[0].get('keyShape');
            var bbox = keyShape.getBBox();
            var x = evt.x - dragOptions.originX + dragOptions.point.x;
            var y = evt.y - dragOptions.originY + dragOptions.point.y;
            dragOptions.delegateShape = parentGroup.addShape('rect', {
                attrs: __assign({ width: bbox.width, height: bbox.height, x: x + bbox.x, y: y + bbox.y }, delegateShapeAttr),
            });
            dragTarget = {
                nodes: dragOptions.targets,
                hidden: false,
                originNodeStyle: {},
                saveModel: {},
            };
        }
        updateDragTarget(mindmap, true);
        refreshDragHolder(mindmap, dragOptions.delegateShape, evt.item);
        // this.target.set('delegateShape', this.delegateShape);
        // this.dragOptions.delegateShape.set('capture', false);
    }
    else if (dragOptions.type === 'unselect-single') {
        var bbox = evt.item.get('keyShape').getBBox();
        var x = evt.x - dragOptions.originX + dragOptions.point.x;
        var y = evt.y - dragOptions.originY + dragOptions.point.y;
        dragOptions.delegateShape.attr({
            x: x + bbox.x,
            y: y + bbox.y,
        });
        refreshDragHolder(mindmap, dragOptions.delegateShape, null);
    }
    else if (dragOptions.type === 'select') {
        // let clientX = evt.x - this.dragOptions.originX + this.originPoint.minX;
        // let clientY = evt.y - this.dragOptions.originY + this.originPoint.minY;
        // this.dragOptions.delegateShape.attr({
        //     x : clientX,
        //     y : clientY
        // });
        // _refreshDragHolder(vm, this.dragOptions.delegateShape, null);
    }
    mindmap.graph.paint();
};
export var getNodeDragBehavior = function (mindmap) { return ({
    getDefaultCfg: function () {
        return {
            dragOptions: null,
        };
    },
    getEvents: function () {
        return {
            'node:dragstart': 'onDragStart',
            'node:drag': 'onDrag',
            'node:dragend': 'onDragEnd',
        };
    },
    onDragStart: function (evt) {
        if (!evt.item) {
            return;
        }
        var model = evt.item.getModel();
        // root节点不能被拖拽
        if (model._isRoot) {
            return;
        }
        var dragOptions = {
            originX: evt.x,
            originY: evt.y,
            delegateShape: null,
        };
        // 获取所有选中的元素
        var nodes = mindmap.graph.findAllByState('node', 'selected');
        var targetNodeId = evt.item.get('id');
        // 当前拖动的节点是否是选中的节点
        var dragNodes = nodes.filter(function (node) { return targetNodeId === node.get('id'); });
        if (dragNodes.length === 0) {
            // 只拖动当前节点
            var currentModel = evt.item.getModel();
            dragOptions.type = 'unselect-single';
            dragOptions.targets = [evt.item];
            dragOptions.point = {
                x: currentModel.x,
                y: currentModel.y,
            };
        }
        // else if (nodes.length === 1) {
        //     // 拖动选中节点
        //     this.targets.push(evt.item);
        //     this.dragOptions.type = 'select';
        // } else {
        //     let models = [];
        //     let getTopSelectedNodeModel = node => {
        //         let model = node.getModel();
        //         let parentNode = this.graph.findById(model.id).getInEdges()[0].getSource();
        //         if (parentNode.getStates().indexOf('selected') !== -1) {
        //             model = getTopSelectedNodeModel(parentNode);
        //         }
        //         return model;
        //     };
        //     // 拖动多个节点
        //     nodes.forEach(node => {
        //         let model = getTopSelectedNodeModel(node);
        //         // 仅计算top节点
        //         if (models.indexOf(model) === -1) {
        //             models.push(model);
        //             this.targets.push(node);
        //         }
        //     });
        //     this.dragOptions.type = 'select';
        // }
        this.dragOptions = dragOptions;
    },
    onDrag: function (evt) {
        if (!evt.item) {
            return;
        }
        var model = evt.item.getModel();
        var dragOptions = this.dragOptions;
        if (!this.get('shouldUpdate').call(this, evt) || model._isRoot) {
            return;
        }
        // if (dragOptions.type === 'unselect-single') {
        updateDelegate({
            mindmap: mindmap,
            evt: evt,
            dragOptions: dragOptions,
        });
        // } else {
        //     updateDelegate({
        //         mindmap,
        //         evt,
        //         dragOptions,
        //     });
        // }
        mindmap.dragging = true;
    },
    onDragEnd: function (evt) {
        if (!this.get('shouldEnd').call(this, evt)) {
            return;
        }
        var model = evt.item.getModel();
        // root节点不能被拖拽
        if (model._isRoot) {
            return;
        }
        var dragOptions = this.dragOptions;
        if (dragOptions.delegateShape) {
            dragOptions.delegateShape.remove();
            dragOptions.delegateShape = null;
        }
        // 终止时需要判断此时是否在监听画布外的 mouseup 事件，若有则解绑
        var fn = this.fn;
        if (typeof fn === 'function') {
            window.document.body.removeEventListener('mouseup', fn, false);
            this.fn = null;
        }
        updateDragTarget(mindmap, false);
        // 若目标父节点处于折叠状态，则打开
        // 并且不需要_removeOldDragPlaceholder，因为展开时会自动删除当前的children
        // TODO : 支持折叠
        // if (dragHolderParentModel._collapsed) {
        //     this.graph.layout();
        //     vm.collapseChildren(dragHolderParentModel.id, false);
        // } else {
        removeOldDragPlaceholder(mindmap);
        mindmap.graph.layout();
        // }
        dragHolderParentModel = null;
        dragHolderIndexOfParent = null;
        this.dragOptions = null;
        mindmap.dragging = false;
    },
}); };
