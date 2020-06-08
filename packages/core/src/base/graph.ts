import * as G6                                  from '@antv/g6';
import * as G6Graph                             from '@antv/g6/lib/interface/graph';
import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    MindmapNodeItem,
    MindmapCreateOptions,
    MindmapInsideOptions,
    EventNames,
    MindmapCoreType,
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
import bindNodeHover                            from '../events/nodeHover';
import bindNodeSelect                           from '../events/nodeSelect';
import bindNodeEdit                             from '../events/nodeEdit';
import bindAppendsHover                         from '../events/appendsHover';
import bindAppendsClick                         from '../events/appendsClick';
import bindContextMenu                          from '../events/contextMenu';
import bindTagHover                             from '../events/tagHover';
import bindNodeDrag                             from '../events/nodeDrag';

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

    // const model = evt.item.getModel() as MindmapNodeItem;

    // if (model.collapse || model.isDragging) {

    //     return false;

    // }

    return true;

};

const hiddenMenus = (mindmap: MindmapCore, evt: IG6GraphEvent): void => {

    mindmap.hideEditLink();
    mindmap.hideEditNote();
    mindmap.hideEditTag();
    bindContextMenu.hide(evt, {
        mindmap,
        graph : mindmap.graph,
    });

};

// TODO left node props: 
// ITEM INCLUEDS:
//      tag : 标签
//      note : 备注
//      mark : 标记(用户设置)
// PRIVATE >>>
//      
//      _shapeStyle : 计算完的图形样式
//      _origin : 原始数据
//      _mark : 标记(经过转换后)
//      _collapsed : 子节点折叠状态
//      _collapsedChildren : 用于存放被折叠的子节点
// for TODO :
// shapeStyle : 使用的图形样式（用户设置）；未启用；

export const create = (mindmap: MindmapCore, options: MindmapCreateOptions): G6.TreeGraph => {

    const _options: MindmapInsideOptions = {
        width : '100%',
        height : '100%',
        draggable : true,
        nodeDraggable : true,
        scalable : true,
        backgroundGrid : false,
        minimap : true,
        // eslint-disable-next-line no-magic-numbers
        nodeHGap : 30,
        nodeVGap : 6,
        maxShowTagNum : 4,
        direction : 'LR',

        $editorInput : options.$editor.querySelector('textarea'),
        $contextMenuLink : options.$con.querySelector('.mindmap-menu-link'),
        $contextMenuNote : options.$con.querySelector('.mindmap-menu-note'),
        $contextMenuTag : options.$con.querySelector('.mindmap-menu-tag'),
        $boxEditLink : options.$con.querySelector('.mindmap-box-edit-link'),
        $boxEditNote : options.$con.querySelector('.mindmap-box-edit-note'),
        $boxEditTag : options.$con.querySelector('.mindmap-box-edit-tag'),

        ...options,
    };
    const modes: string[] = [];
    const plugins = [];

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
            type : 'delegate',
        }));

    }

    const graphOptions: G6Graph.GraphOptions = {
        container : _options.$canvas,
        width : _options.width,
        height : _options.height,
        // eslint-disable-next-line no-magic-numbers
        minZoom : 0.01,
        // eslint-disable-next-line no-magic-numbers
        maxZoom : 1.5,
        animate : false,
        fitView : false,
        modes : {
            default : modes,
        },
        layout : {
            direction : 'LR',
            type : 'compactBox',
            getHeight : (cfg: MindmapNodeItem): number => {

                const node = mindmap.graph.findById(cfg.id);

                if (
                    !node
                    || (node && node.destroyed)
                    || (node && node.getModel()._isDragging)
                ) {

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
            getWidth : (cfg: MindmapNodeItem): number => {

                const node = mindmap.graph.findById(cfg.id);

                if (
                    !node
                    || (node && node.destroyed)
                    || (node && node.getModel()._isDragging)
                ) {

                    return 0;

                }

                return node.getBBox().width;

            },
            getVGap : (cfg: MindmapNodeItem): number => {

                const node = mindmap.graph.findById(cfg.id);

                if (node && (node.getModel() as MindmapNodeItem)._isDragging) {

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

};

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

        hiddenMenus(mindmap, evt);

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

        bindAppendsHover.stop(evt, {
            graph,
        });

        // bindCollapseBtnHover.stop(evt, {
        //     vm,
        //     graph
        // });

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

            // bindCollapseBtnHover.move(evt, {
            //     graph,
            //     vm
            // });

        }

    });

    graph.on('node:click', (evt: IG6GraphEvent): void => {

        if (_nodeEventShouldEmit(evt)) {

            hiddenMenus(mindmap, evt);

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

            // bindCollapseBtnClick.click(evt, {
            //     vm,
            //     graph
            // });

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

    graph.on('wheelzoom', (evt: IG6GraphEvent): void => {

        bindNodeEdit.refresh(evt, {
            mindmap,
        });

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
