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
import * as G6 from '@antv/g6';
import { EventNames, } from '../interface';
import { getMindNode, } from '../nodes/mindNode';
import { getMindEdge, } from '../edges/mindEdge';
import { getNodeDragBehavior, } from '../behavior/nodeDrag';
import bindNodeEdit from '../events/nodeEdit';
import bindContextMenu from '../events/contextMenu';
import bindNodeDrag from '../events/nodeDrag';
var globalId = 1;
var convertSize = function (type, value, $con) {
    var size;
    if (typeof value === 'string') {
        if ((/px$/u).test(value)) {
            size = Number(value.replace(/px$/u, ''));
        }
        else if ((/%$/u).test(value)) {
            $con.style[type] = value;
            size = type === 'width' ? $con.clientWidth : $con.clientHeight;
        }
    }
    else {
        size = value;
    }
    return size;
};
var _nodeEventShouldEmit = function (evt) {
    if (evt.item && evt.item.destroyed) {
        return true;
    }
    // const model = evt.item.getModel() as MindmapNodeItem;
    // if (model.collapse || model.isDragging) {
    //     return false;
    // }
    return true;
};
var hiddenMenus = function (mindmap, evt) {
    mindmap.hideEditLink();
    mindmap.hideEditNote();
    mindmap.hideEditTag();
    bindContextMenu.hide(evt, {
        mindmap: mindmap,
        graph: mindmap.graph,
    });
};
// ITEM INCLUEDS:
// --------------
// INPUT DATA:
//      text : 文案
//      children : 子节点
//      link : 链接
//      note : 备注
//      tag : 标签
// --------------
// G6 DATA:
//      id : node id
//      anchorPoints : 锚点
//      style : 额外的样式
//      type : 采用的图形
// --------------
// INSIDE PROP:
//      _isRoot : 是否是根节点
//      _isNode : 是节点
// --------------
export var traverseOneItem = function (item) {
    var nodeItem = __assign(__assign({ id: globalId++, 
        // eslint-disable-next-line no-magic-numbers
        anchorPoints: [[0, 0.5], [1, 0.5]], style: {}, 
        // TODO : type diff when node is root
        type: 'mind-node', link: null, note: null, tag: null }, item), { _isRoot: globalId === 1, _isNode: true });
    return nodeItem;
};
// TODO left node props: 
// ITEM INCLUEDS:
//      tag : 标签
//      note : 备注
//      mark : 标记(用户设置)
// PRIVATE >>>
//      _isDragging : 正在拖拽
//      _shapeStyle : 计算完的图形样式
//      _origin : 原始数据
//      _mark : 标记(经过转换后)
//      _collapsed : 子节点折叠状态
//      _collapsedChildren : 用于存放被折叠的子节点
// for TODO :
// shapeStyle : 使用的图形样式（用户设置）；未启用；
export var create = function (mindmap, options) {
    var _options = __assign({ width: '100%', height: '100%', draggable: true, nodeDraggable: true, scalable: true, backgroundGrid: false, minimap: true, 
        // eslint-disable-next-line no-magic-numbers
        nodeHGap: 30, nodeVGap: 6, maxShowTagNum: 4, $editorInput: options.$editor.querySelector('textarea'), $contextMenuLink: options.$con.querySelector('.mindmap-menu-link'), $contextMenuNote: options.$con.querySelector('.mindmap-menu-note'), $contextMenuTag: options.$con.querySelector('.mindmap-menu-tag'), $boxEditLink: options.$con.querySelector('.mindmap-box-edit-link'), $boxEditNote: options.$con.querySelector('.mindmap-box-edit-note'), $boxEditTag: options.$con.querySelector('.mindmap-box-edit-tag') }, options);
    var modes = [];
    var plugins = [];
    _options.width = convertSize('width', _options.width, _options.$con);
    _options.height = convertSize('height', _options.height, _options.$con);
    mindmap._options = _options;
    if (_options.draggable) {
        modes.push('drag-canvas');
    }
    if (_options.scalable) {
        modes.push('zoom-canvas');
    }
    if (_options.nodeDraggable) {
        modes.push('mind-drag-node');
    }
    if (_options.backgroundGrid) {
        plugins.push(new G6.Grid());
    }
    if (_options.minimap) {
        plugins.push(new G6.Minimap({
            type: 'delegate',
        }));
    }
    var graphOptions = {
        container: _options.$canvas,
        width: _options.width,
        height: _options.height,
        // eslint-disable-next-line no-magic-numbers
        minZoom: 0.01,
        // eslint-disable-next-line no-magic-numbers
        maxZoom: 1.5,
        animate: false,
        fitView: true,
        modes: {
            default: modes,
        },
        layout: {
            direction: 'LR',
            type: 'compactBox',
            getHeight: function (cfg) {
                var node = mindmap.graph.findById(cfg.id);
                if (!node
                    || (node && node.destroyed)
                    || (node && node.getModel()._isDragging)) {
                    return 0;
                }
                // TODO : computedRadius
                // const model = node.getModel();
                // if (model.style && model.style.computedRadius) {
                //     node.get('group').getChildByIndex(NODE_SHAPE_INDEX.con)
                //         .attr({
                //             radius : node.getBBox().height * model.style.computedRadius
                //         });
                //     node.get('group').set('radius', node.getBBox().height * model.style.computedRadius);
                // }
                return node.getBBox().height;
            },
            getWidth: function (cfg) {
                var node = mindmap.graph.findById(cfg.id);
                if (!node
                    || (node && node.destroyed)
                    || (node && node.getModel()._isDragging)) {
                    return 0;
                }
                return node.getBBox().width;
            },
            getVGap: function (cfg) {
                // const node = mindmap.graph.findById(cfg.id);
                // if (node && (node.getModel() as MindmapNodeItem)._isDragging) {
                //     return 0;
                // }
                return _options.nodeVGap;
            },
            getHGap: function () { return _options.nodeHGap; },
        },
        plugins: plugins,
        defaultNode: {
            shape: 'mind-node',
        },
        defaultEdge: {
            shape: 'mind-edge',
        },
    };
    return new G6.TreeGraph(graphOptions);
};
export var traverseData = function (data) {
    var nodeData = traverseOneItem(data);
    if (nodeData.children) {
        for (var index in nodeData.children) {
            nodeData.children[index] = traverseData(nodeData.children[index]);
        }
    }
    return nodeData;
};
export var register = function (mindmap) {
    G6.registerNode('mind-node', getMindNode(mindmap), 'single-node');
    // G6.registerNode('mind-root-node', getMindNode(mindmap), 'single-node');
    G6.registerEdge('mind-edge', getMindEdge(mindmap));
    G6.registerBehavior('mind-drag-node', getNodeDragBehavior(mindmap));
};
export var bindEvent = function (mindmap) {
    var graph = mindmap.graph;
    var global = window;
    // eslint-disable-next-line no-magic-numbers
    var modKeycode = [91, 17];
    // graph.on('canvas:click', (evt: IG6GraphEvent): void => {
    //     // bindAppendsClick.stop(evt, {
    //     //     vm,
    //     //     graph
    //     // });
    //     bindNodeSelect.clear(evt, {
    //         mindmap,
    //         graph,
    //     });
    //     hiddenMenus(mindmap, evt);
    // });
    // graph.on('canvas:mousedown', (evt: IG6GraphEvent): void => {
    //     // bindCanvasGrab.mousedown(evt, {
    //     //     vm
    //     // });
    //     bindNodeEdit.cancel(evt, {
    //         mindmap,
    //     });
    //     bindNodeSelect.clear(evt, {
    //         mindmap,
    //         graph,
    //     });
    // });
    // graph.on('canvas:mousemove', (evt: IG6GraphEvent): void => {
    //     bindAppendsHover.stop(evt, {
    //         graph,
    //     });
    //     // bindCollapseBtnHover.stop(evt, {
    //     //     vm,
    //     //     graph
    //     // });
    // });
    // graph.on('node:mouseenter', (evt: IG6GraphEvent): void => {
    //     if (_nodeEventShouldEmit(evt)) {
    //     }
    // });
    // graph.on('node:mouseleave', (evt: IG6GraphEvent): void => {
    //     if (_nodeEventShouldEmit(evt)) {
    //         bindAppendsHover.move(evt, {
    //             graph,
    //             mindmap,
    //         });
    //         bindNodeHover.move(evt, {
    //             graph,
    //             mindmap,
    //         });
    //         bindTagHover.move(evt, {
    //             graph,
    //             mindmap,
    //         });
    //     }
    // });
    // graph.on('node:mousemove', (evt: IG6GraphEvent): void => {
    //     if (_nodeEventShouldEmit(evt)) {
    //         bindAppendsHover.move(evt, {
    //             graph,
    //             mindmap,
    //         });
    //         bindNodeHover.move(evt, {
    //             graph,
    //             mindmap,
    //         });
    //         bindTagHover.move(evt, {
    //             graph,
    //             mindmap,
    //         });
    //         // bindCollapseBtnHover.move(evt, {
    //         //     graph,
    //         //     vm
    //         // });
    //     }
    // });
    // graph.on('node:click', (evt: IG6GraphEvent): void => {
    //     if (_nodeEventShouldEmit(evt)) {
    //         hiddenMenus(mindmap, evt);
    //         bindNodeSelect.select(evt, {
    //             mindmap,
    //             graph,
    //         });
    //         bindAppendsClick.click(evt, {
    //             mindmap,
    //             graph,
    //         });
    //         bindNodeSelect.clear(evt, {
    //             mindmap,
    //             graph,
    //         });
    //         // bindCollapseBtnClick.click(evt, {
    //         //     vm,
    //         //     graph
    //         // });
    //     }
    // });
    // graph.on('node:dblclick', (evt: IG6GraphEvent): void => {
    //     if (_nodeEventShouldEmit(evt)) {
    //         bindNodeEdit.edit(evt, {
    //             mindmap,
    //         });
    //     }
    // });
    // graph.on('node:contextmenu', (evt: IG6GraphEvent): void => {
    //     if (_nodeEventShouldEmit(evt)) {
    //         bindContextMenu.show(evt, {
    //             mindmap,
    //             graph,
    //         });
    //     }
    // });
    graph.on('node:drag', function (evt) {
        if (_nodeEventShouldEmit(evt)) {
            bindNodeDrag.start(evt, {
                graph: graph,
            });
        }
    });
    graph.on('node:dragend', function (evt) {
        if (_nodeEventShouldEmit(evt)) {
            bindNodeDrag.end(evt, {
                graph: graph,
            });
        }
    });
    graph.on('wheelzoom', function (evt) {
        bindNodeEdit.refresh(evt, {
            mindmap: mindmap,
        });
        // bindAppendsClick.stop(evt, {
        //     vm,
        //     graph
        // });
    });
    graph.on('click', function (evt) {
        bindNodeEdit.cancel(evt, {
            mindmap: mindmap,
        });
    });
    global.document.addEventListener('keydown', function (evt) {
        if (modKeycode.includes(evt.keyCode)) {
            mindmap.keydownState.mod = true;
        }
    });
    global.document.addEventListener('keyup', function (evt) {
        if (modKeycode.includes(evt.keyCode)) {
            mindmap.keydownState.mod = false;
        }
    });
    global.document.addEventListener('contextmenu', function (evt) {
        var $target = evt.target;
        if ($target && $target.nodeType && $target.nodeType === 3) {
            return true;
        }
        evt.preventDefault();
        return false;
    });
    mindmap.on(EventNames.ZoomChange, function () {
        bindNodeEdit.zoom(null, {
            mindmap: mindmap,
        });
    });
};
export var manualPaint = function (graph, paintCallback) {
    var autoPaint = graph.get('autoPaint');
    paintCallback();
    graph.paint();
    graph.setAutoPaint(autoPaint);
};
