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
import { getMindHolderNode, } from '../nodes/mindHolderNode';
import { getMindEdge, } from '../edges/mindEdge';
import { getMindHolderEdge, } from '../edges/mindHolderEdge';
import { getNodeDragBehavior, } from '../behavior/nodeDrag';
import { getNodeBrushSelectBehavior, } from '../behavior/nodeBrushSelect';
import bindNodeHover from '../events/nodeHover';
import bindNodeSelect from '../events/nodeSelect';
import bindNodeEdit from '../events/nodeEdit';
import bindMarksHover from '../events/marksHover';
import bindAppendsHover from '../events/appendsHover';
import bindAppendsClick from '../events/appendsClick';
import bindContextMenu from '../events/contextMenu';
import bindTagHover from '../events/tagHover';
import bindNodeDrag from '../events/nodeDrag';
import bindFoldBtnHover from '../events/foldBtnHover';
import bindFoldBtnClick from '../events/foldBtnClick';
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
    var model = evt.item.getModel();
    // model.collapse
    if (model._isDragging) {
        return false;
    }
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
export var create = function (mindmap, options) {
    var _options = __assign({ width: '100%', height: '100%', draggable: true, nodeDraggable: true, scalable: true, brushSelectable: true, backgroundGrid: false, foldable: true, minimap: true, 
        // eslint-disable-next-line no-magic-numbers
        nodeHGap: 30, nodeVGap: 6, maxShowTagNum: 4, direction: 'LR', $canvas: options.$con.querySelector('.mindmap-canvas'), $editor: options.$con.querySelector('.mindmap-editor'), $editorInput: options.$con.querySelector('textarea'), $contextMenuLink: options.$con.querySelector('.mindmap-menu-link'), $contextMenuNote: options.$con.querySelector('.mindmap-menu-note'), $contextMenuTag: options.$con.querySelector('.mindmap-menu-tag'), $boxEditLink: options.$con.querySelector('.mindmap-box-edit-link'), $boxEditNote: options.$con.querySelector('.mindmap-box-edit-note'), $boxEditTag: options.$con.querySelector('.mindmap-box-edit-tag') }, options);
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
    if (_options.brushSelectable) {
        modes.push('mind-brush-select');
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
        fitView: false,
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
                var node = mindmap.graph.findById(cfg.id);
                if (!node
                    || (node && node.destroyed)
                    || (node && node.getModel()._isDragging)) {
                    return 0;
                }
                return _options.nodeVGap;
            },
            getHGap: function () { return _options.nodeHGap; },
        },
        plugins: plugins,
        defaultNode: {
            type: 'mind-node',
        },
        defaultEdge: {
            type: 'mind-edge',
        },
    };
    return new G6.TreeGraph(graphOptions);
};
export var register = function (mindmap) {
    G6.registerNode('mind-node', getMindNode(mindmap), 'single-node');
    G6.registerNode('mind-holder-node', getMindHolderNode(), 'single-node');
    // G6.registerNode('mind-root-node', getMindNode(mindmap), 'single-node');
    G6.registerEdge('mind-edge', getMindEdge());
    G6.registerEdge('mind-holder-edge', getMindHolderEdge(), 'mind-edge');
    G6.registerBehavior('mind-drag-node', getNodeDragBehavior(mindmap));
    G6.registerBehavior('mind-brush-select', getNodeBrushSelectBehavior(mindmap));
};
export var bindEvent = function (mindmap) {
    var graph = mindmap.graph;
    var global = window;
    // eslint-disable-next-line no-magic-numbers
    var modKeycode = [91, 17];
    graph.on('canvas:click', function (evt) {
        // bindAppendsClick.stop(evt, {
        //     vm,
        //     graph
        // });
        bindNodeSelect.clear(evt, {
            mindmap: mindmap,
            graph: graph,
        });
        hiddenMenus(mindmap, evt);
    });
    graph.on('canvas:mousedown', function (evt) {
        // bindCanvasGrab.mousedown(evt, {
        //     vm
        // });
        bindNodeEdit.cancel(evt, {
            mindmap: mindmap,
        });
        bindNodeSelect.clear(evt, {
            mindmap: mindmap,
            graph: graph,
        });
    });
    graph.on('canvas:mousemove', function (evt) {
        bindAppendsHover.stop(evt, {
            graph: graph,
        });
        bindFoldBtnHover.stop(evt, {
            graph: graph,
            mindmap: mindmap,
        });
    });
    // graph.on('node:mouseenter', (evt: IG6GraphEvent): void => {
    //     if (_nodeEventShouldEmit(evt)) {
    //     }
    // });
    graph.on('node:mouseleave', function (evt) {
        if (_nodeEventShouldEmit(evt)) {
            bindAppendsHover.move(evt, {
                graph: graph,
                mindmap: mindmap,
            });
            bindNodeHover.move(evt, {
                graph: graph,
                mindmap: mindmap,
            });
            bindTagHover.move(evt, {
                graph: graph,
                mindmap: mindmap,
            });
        }
    });
    graph.on('node:mousemove', function (evt) {
        if (_nodeEventShouldEmit(evt)) {
            bindAppendsHover.move(evt, {
                graph: graph,
                mindmap: mindmap,
            });
            bindNodeHover.move(evt, {
                graph: graph,
                mindmap: mindmap,
            });
            bindTagHover.move(evt, {
                graph: graph,
                mindmap: mindmap,
            });
            bindFoldBtnHover.move(evt, {
                graph: graph,
                mindmap: mindmap,
            });
            bindMarksHover.move(evt, {
                graph: graph,
                mindmap: mindmap,
            });
        }
    });
    graph.on('node:click', function (evt) {
        if (_nodeEventShouldEmit(evt)) {
            hiddenMenus(mindmap, evt);
            bindNodeSelect.select(evt, {
                mindmap: mindmap,
                graph: graph,
            });
            bindAppendsClick.click(evt, {
                mindmap: mindmap,
                graph: graph,
            });
            bindNodeSelect.clear(evt, {
                mindmap: mindmap,
                graph: graph,
            });
            bindFoldBtnClick.click(evt, {
                mindmap: mindmap,
                graph: graph,
            });
        }
    });
    graph.on('node:dblclick', function (evt) {
        if (_nodeEventShouldEmit(evt)) {
            bindNodeEdit.edit(evt, {
                mindmap: mindmap,
            });
        }
    });
    graph.on('node:contextmenu', function (evt) {
        if (_nodeEventShouldEmit(evt)) {
            bindContextMenu.show(evt, {
                mindmap: mindmap,
                graph: graph,
            });
        }
    });
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
