import * as G6                                  from '@antv/g6';
import * as G6Graph                             from '@antv/g6/lib/interface/graph';
import {
    IG6GraphEvent,
    GraphOptions,
    ModeType,
    G6Event,
}                                               from '@antv/g6/lib/types';
import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    MindmapNodeItem,
    MindmapCreateOptions,
    MindmapInsideOptions,
    EventNames,
    MindmapCoreType,
    MindmapCoreL0Type,
}                                               from '../interface';
import {
    getMindNode,
}                                               from '../nodes/mindNode';
import {
    getMindHolderNode,
}                                               from '../nodes/mindHolderNode';
import {
    getMindEdge,
}                                               from '../edges/mindEdge';
import {
    getMindHolderEdge,
}                                               from '../edges/mindHolderEdge';
import {
    getNodeDragBehavior,
}                                               from '../behavior/nodeDrag';
import {
    getNodeBrushSelectBehavior,
}                                               from '../behavior/nodeBrushSelect';
import {
    getModel,
}                                               from '../utils/G6Ext';
import bindNodeHover                            from '../events/nodeHover';
import bindNodeSelect                           from '../events/nodeSelect';
import bindNodeEdit                             from '../events/nodeEdit';
import bindMarksHover                           from '../events/marksHover';
import bindMarksClick                           from '../events/marksClick';
import bindAppendsHover                         from '../events/appendsHover';
import bindAppendsClick                         from '../events/appendsClick';
import bindContextMenu                          from '../events/contextMenu';
import bindTagHover                             from '../events/tagHover';
import bindNodeDrag                             from '../events/nodeDrag';
import bindFoldBtnHover                         from '../events/foldBtnHover';
import bindFoldBtnClick                         from '../events/foldBtnClick';
import bindHotkey                               from '../events/hotkey';
import bindCanvas                               from '../events/canvas';

const convertSize = (type: 'width' | 'height', value: number | string, $con: HTMLElement): number => {

    let size: number;

    if (typeof value === 'string') {

        if ((/px$/u).test(value)) {

            size = Number(value.replace(/px$/u, ''));

        } else if ((/%$/u).test(value)) {

            $con.style[type] = value;
            size = type === 'width' ? $con.clientWidth : $con.clientHeight;

        }

    } else {

        size = value;

    }

    return size;

};

const _nodeEventShouldEmit = (evt: IG6GraphEvent): boolean => {

    if (evt.item && evt.item.destroyed) {

        return true;

    }

    const model = getModel(evt.item);

    // model.collapse
    if (model._isDragging) {

        return false;

    }

    return true;

};

export const create = (mindmap: MindmapCoreType, options: MindmapCreateOptions): G6.TreeGraph => {

    const _options: MindmapInsideOptions = {
        width : '100%',
        height : '100%',
        draggable : true,
        nodeDraggable : true,
        scalable : true,
        brushSelectable : true,
        backgroundGrid : false,
        foldable : true,
        minimap : true,
        // eslint-disable-next-line no-magic-numbers
        nodeHGap : 30,
        nodeVGap : 6,
        maxShowTagNum : 4,
        direction : 'LR',
        // eslint-disable-next-line no-magic-numbers
        minZoom : 0.2,
        // eslint-disable-next-line no-magic-numbers
        maxZoom : 1.5,

        $canvas : options.$con.querySelector('.mindmap-canvas'),
        $editor : options.$con.querySelector('.mindmap-editor'),
        $editorInput : options.$con.querySelector('textarea'),
        $contextMenuLink : options.$con.querySelector('.mindmap-menu-link'),
        $contextMenuNote : options.$con.querySelector('.mindmap-menu-note'),
        $contextMenuTag : options.$con.querySelector('.mindmap-menu-tag'),
        $boxEditLink : options.$con.querySelector('.mindmap-box-edit-link'),
        $boxEditNote : options.$con.querySelector('.mindmap-box-edit-note'),
        $boxEditTag : options.$con.querySelector('.mindmap-box-edit-tag'),
        $boxEditMark : options.$con.querySelector('.mindmap-box-edit-mark'),
        $zoomSlider : options.$con.querySelector('.mindmap-zoom-slider'),

        ...options,
    };
    const plugins = [];
    const modes: ModeType[] = [];

    _options.width = convertSize('width', _options.width, _options.$con);
    _options.height = convertSize('height', _options.height, _options.$con);
    mindmap._options = _options;

    if (_options.draggable) {

        modes.push('drag-canvas');

    }

    if (_options.scalable) {

        modes.push({
            type : 'zoom-canvas',
            sensitivity : 2,
        });

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
            type : 'delegate',
        }));

    }

    const graphOptions: GraphOptions = {
        container : _options.$canvas,
        width : _options.width,
        height : _options.height,
        // eslint-disable-next-line no-magic-numbers
        minZoom : _options.minZoom,
        // eslint-disable-next-line no-magic-numbers
        maxZoom : _options.maxZoom,
        animate : false,
        fitView : false,
        modes : {
            default : modes,
        },
        layout : {
            direction : 'LR',
            type : 'compactBox',
            getHeight : (cfg: MindmapNodeItem): number => {

                const node = mindmap.graph.findById(cfg.id) as INode;

                if (
                    !node
                    || (node && node.destroyed)
                    || (node && getModel(node)._isDragging)
                ) {

                    return 0;

                }

                return node.getBBox().height;

            },
            getWidth : (cfg: MindmapNodeItem): number => {

                const node = mindmap.graph.findById(cfg.id);

                if (
                    !node
                    || (node && node.destroyed)
                    || (node && getModel(node)._isDragging)
                ) {

                    return 0;

                }

                return node.getBBox().width;

            },
            getVGap : (cfg: MindmapNodeItem): number => {

                const node = mindmap.graph.findById(cfg.id) as INode;

                if (
                    !node
                    || (node && node.destroyed)
                    || (node && getModel(node)._isDragging)
                ) {

                    return 0;

                }

                return _options.nodeVGap;

            },
            getHGap : (): number => _options.nodeHGap,
        },
        plugins,
        defaultNode : {
            type : 'mind-node',
        },
        defaultEdge : {
            type : 'mind-edge',
        },
    };

    return new G6.TreeGraph(graphOptions);

};

export const register = (mindmap: MindmapCoreType): void => {

    G6.registerNode('mind-node', getMindNode(mindmap), 'single-node');
    G6.registerNode('mind-holder-node', getMindHolderNode(), 'single-node');
    // G6.registerNode('mind-root-node', getMindNode(mindmap), 'single-node');

    G6.registerEdge('mind-edge', getMindEdge());
    G6.registerEdge('mind-holder-edge', getMindHolderEdge(), 'mind-edge');

    G6.registerBehavior('mind-drag-node', getNodeDragBehavior(mindmap));
    G6.registerBehavior('mind-brush-select', getNodeBrushSelectBehavior(mindmap));

};

// eslint-disable-next-line max-lines-per-function
export const bindEvent = (mindmap: MindmapCoreType): void => {

    const graph = mindmap.graph;
    const global: typeof window = window;
    // eslint-disable-next-line no-magic-numbers
    const modKeycode: number[] = [91, 17];

    graph.on('canvas:click', (evt: IG6GraphEvent): void => {

        // bindAppendsClick.stop(evt, {
        //     vm,
        //     graph
        // });

        bindNodeSelect.clear(evt, {
            mindmap,
            graph,
        });

        mindmap.hideContextMenu();

    });

    graph.on('canvas:drag', (): void => {

        mindmap.hideContextMenu();

    });

    graph.on('canvas:mousedown', (evt: IG6GraphEvent): void => {

        // bindCanvasGrab.mousedown(evt, {
        //     vm
        // });
        bindNodeEdit.cancel(evt, {
            mindmap,
        });
        bindNodeSelect.clear(evt, {
            mindmap,
            graph,
        });

    });

    graph.on('canvas:mousemove', (evt: IG6GraphEvent): void => {

        bindFoldBtnHover.stop(evt, {
            graph,
            mindmap,
        });

    });

    graph.on('canvas:mouseover', (evt: IG6GraphEvent): void => {

        bindCanvas.focus(evt, {
            graph,
            mindmap,
        });

    });

    graph.on('canvas:mouseleave', (evt: IG6GraphEvent): void => {

        bindCanvas.blur(evt, {
            graph,
            mindmap,
        });

    });

    // graph.on('node:mouseenter', (evt: IG6GraphEvent): void => {

    //     if (_nodeEventShouldEmit(evt)) {

    //     }

    // });

    graph.on('node:mouseleave', (evt: IG6GraphEvent): void => {

        if (_nodeEventShouldEmit(evt)) {

            bindAppendsHover.move(evt, {
                graph,
                mindmap,
            });

            bindNodeHover.move(evt, {
                graph,
                mindmap,
            });

            bindTagHover.move(evt, {
                graph,
                mindmap,
            });

        }

    });

    graph.on('node:mousemove', (evt: IG6GraphEvent): void => {

        if (_nodeEventShouldEmit(evt)) {

            bindAppendsHover.move(evt, {
                graph,
                mindmap,
            });

            bindNodeHover.move(evt, {
                graph,
                mindmap,
            });

            bindTagHover.move(evt, {
                graph,
                mindmap,
            });

            bindFoldBtnHover.move(evt, {
                graph,
                mindmap,
            });

            bindMarksHover.move(evt, {
                graph,
                mindmap,
            });

        }

    });

    graph.on('node:click', (evt: IG6GraphEvent): void => {

        if (_nodeEventShouldEmit(evt)) {

            mindmap.hideContextMenu();

            bindNodeSelect.select(evt, {
                mindmap,
                graph,
            });

            bindAppendsClick.click(evt, {
                mindmap,
                graph,
            });

            bindNodeSelect.clear(evt, {
                mindmap,
                graph,
            });

            bindFoldBtnClick.click(evt, {
                mindmap,
                graph,
            });

            bindMarksClick.click(evt, {
                mindmap,
                graph,
            });

        }

    });

    graph.on('node:dblclick', (evt: IG6GraphEvent): void => {

        if (_nodeEventShouldEmit(evt)) {

            bindNodeEdit.edit(evt, {
                mindmap,
            });

        }

    });

    graph.on('node:contextmenu', (evt: IG6GraphEvent): void => {

        if (_nodeEventShouldEmit(evt)) {

            bindContextMenu.show(evt, {
                mindmap,
                graph,
            });

        }

    });

    graph.on('node:drag', (evt: IG6GraphEvent): void => {

        if (_nodeEventShouldEmit(evt)) {

            bindNodeDrag.start(evt, {
                graph,
            });

        }

    });

    graph.on('node:dragend', (evt: IG6GraphEvent): void => {

        if (_nodeEventShouldEmit(evt)) {

            bindNodeDrag.end(evt, {
                graph,
            });

        }

    });

    graph.on('wheel', (evt: IG6GraphEvent): void => {

        bindNodeEdit.refresh(evt, {
            mindmap,
        });

        mindmap._updateZoomValue();

        // bindAppendsClick.stop(evt, {
        //     vm,
        //     graph
        // });

    });

    graph.on('zoom', (evt: IG6GraphEvent): void => {

        // bindAppendsClick.stop(evt, {
        //     vm,
        //     graph
        // });

    });

    graph.on('click', (evt: IG6GraphEvent): void => {

        bindNodeEdit.cancel(evt, {
            mindmap,
        });

    });

    graph.on('keydown', (evt: KeyboardEvent): void => {

        bindHotkey.keydown(evt, {
            mindmap,
            graph,
        });

    });

    global.document.addEventListener('keydown', (evt: KeyboardEvent): void => {

        if (modKeycode.includes(evt.keyCode)) {

            mindmap.keydownState.mod = true;

        }

    });

    global.document.addEventListener('keyup', (evt: KeyboardEvent): void => {

        if (modKeycode.includes(evt.keyCode)) {

            mindmap.keydownState.mod = false;

        }

    });

    global.document.addEventListener('contextmenu', (evt: MouseEvent): boolean => {

        const $target = evt.target as HTMLElement;

        if ($target && $target.nodeType && $target.nodeType === 3) {

            return true;

        }

        evt.preventDefault();
        return false;

    });

    mindmap.on(EventNames.ZoomChange, () => {

        bindNodeEdit.zoom(null, {
            mindmap,
        });

    });

};

export const manualPaint = (graph: G6.TreeGraph, paintCallback: Function): void => {

    const autoPaint = graph.get('autoPaint');

    paintCallback();

    graph.paint();
    graph.setAutoPaint(autoPaint);

};
