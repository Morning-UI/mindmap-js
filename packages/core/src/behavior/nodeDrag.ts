import G6                                       from '@antv/g6';
import {
    BehaviorOption,
    IG6GraphEvent,
    IBBox,
    Item,
}                                               from '@antv/g6/lib/types';
import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    IGroup,
    IShape,
}                                               from '@antv/g-base/lib/interfaces';
import throttle                                 from 'lodash.throttle';
import sortBy                                   from 'lodash.sortby';
import {
    NodeDragBehaviorCfg,
    BehaviorEvents,
    DragOptions,
    UpdateDelegateOptions,
    DragTarget,
    MindmapNodeItem,
    MindmapCoreType,
    OriginPointType,
}                                               from '../interface';
import {
    DRAG_NODE_STYLE,
}                                               from '../style';
import {
    toggleNodeVisibility,
}                                               from '../base/utils';
import globalData                               from '../base/globalData';

let dragTarget: DragTarget = null;
let dragHolderParentModel: MindmapNodeItem = null;
let dragHolderIndexOfParent: number = null;

const DRAG_REFRESH_INTERVAL = 160;

const udpateOneDragTarget = (
    mindmap: MindmapCoreType,
    index: number,
    dragging: boolean,
    _dragHolderIndexOfParent: number,
): void => {

    const node = dragTarget.nodes[index];

    if (dragging && !dragTarget.hidden) {

        dragTarget.originNodeStyle[index] = {
            height : node.getBBox().height,
        };
        dragTarget.saveModel[index] = node.getModel() as MindmapNodeItem;
        node.setState('dragging', true);
        node.update({
            _isDragging : true,
            style : G6.Util.deepMix({}, {
                fillOpacity : 0,
            }, node.getModel().style),
        });

        toggleNodeVisibility(node as INode, 'hide', (type, model) => {

            if (type === 'hide') {

                model._isDragging = true;

            } else {

                model._isDragging = false;

            }

        });

    } else if (!dragging && dragTarget.hidden) {

        const nodeModel = dragTarget.saveModel[index];

        node.setState('dragging', false);
        node.update({
            _isDragging : false,
            style : G6.Util.deepMix({}, {
                fillOpacity : 1,
            }, nodeModel.style),
        });

        toggleNodeVisibility(node as INode, 'show', (type, model) => {

            if (type === 'hide') {

                model._isDragging = true;

            } else {

                model._isDragging = false;

            }

        });

        let appendIndexOfParent = _dragHolderIndexOfParent;

        // 如果父节点处于折叠状态，则默认追加到最后
        if (dragHolderParentModel._isFolded) {

            appendIndexOfParent = -1;

        }

        mindmap.insertSubNode(
            dragHolderParentModel.id,
            nodeModel,
            appendIndexOfParent,
            false
        );

    }

};

const updateDragTarget = (mindmap: MindmapCoreType, dragging = false): void => {

    const targetNodes = dragTarget.nodes;

    let first = true;

    if (!dragging && dragTarget.hidden) {

        const dragNodes = mindmap.graph.findAllByState('node', 'dragging') as INode[];

        for (const node of dragNodes) {

            const parentNodeModel = node.getInEdges()[0].getSource().getModel();
            const parentNodeDataChildren = parentNodeModel.children;
            const model = node.getModel() as MindmapNodeItem;
            const index = parentNodeDataChildren.indexOf(model);

            if (
                parentNodeModel === dragHolderParentModel
                && index < dragHolderIndexOfParent
            ) {

                dragHolderIndexOfParent--;

            }

            mindmap.removeNode(model.id, false);

        }

    }

    for (const index in targetNodes) {

        if (!first) {

            udpateOneDragTarget(mindmap, Number(index), dragging, dragHolderIndexOfParent + 1);

        } else {

            udpateOneDragTarget(mindmap, Number(index), dragging, dragHolderIndexOfParent);

        }

        first = false;

    }

    if (dragging && !dragTarget.hidden) {

        dragTarget.hidden = true;
        mindmap.graph.layout();

    } else if (!dragging && dragTarget.hidden) {

        dragTarget.hidden = false;
        dragHolderIndexOfParent += targetNodes.length;

        // 如果父节点处于折叠状态，永远都是0
        if (dragHolderParentModel._isFolded) {

            dragHolderIndexOfParent = 0;

        }

        mindmap.graph.paint();
        mindmap.graph.changeData();
        mindmap.graph.layout();

    }

};

const fillChildBBox = (mindmap: MindmapCoreType, bbox: IBBox, node: INode): IBBox => {

    const model = node.getModel() as MindmapNodeItem;

    bbox.conMaxX = bbox.maxX;
    bbox.conMinX = bbox.minX;
    bbox.conMaxY = bbox.maxY;
    bbox.conMinY = bbox.minY;

    // 仅寻找可见的子元素(不考虑折叠的子元素)
    const children = model.children;

    if (!children || children.length === 0) {

        return bbox;

    }

    for (const child of children) {

        const childNode = mindmap.graph.findById(child.id);
        const childBbox = childNode.getBBox();

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

const removeOldDragPlaceholder = (mindmap: MindmapCoreType): void => {

    // 仅考虑可见的子元素(不考虑折叠的子元素)
    if (dragHolderIndexOfParent > -1 && dragHolderParentModel) {

        const children = dragHolderParentModel.children;

        children.splice(dragHolderIndexOfParent, 1);

    }

    mindmap.graph.changeData();

};

const refreshDragHolder = throttle((mindmap: MindmapCoreType, delegateShape: IShape, targetNode: INode) => {

    // if (!delegateShape) {

    //     return;

    // }

    const nodes = mindmap.graph.getNodes();
    const delegateBbox = delegateShape.getBBox() as IBBox;
    const matchOptions: {
        node?: INode;
        mode?: 'childN';
        index?: number;
        hasPlaceholder?: boolean | number;
    } = {};

    let distance: number;
    let distanceNodes: INode[] = [];

    delegateBbox.centerX = delegateBbox.x + (delegateBbox.width / 2);
    delegateBbox.centerY = delegateBbox.y + (delegateBbox.height / 2);

    // 按距离对节点排序
    distanceNodes = sortBy(nodes, (node) => {

        const nodeBbox = node.getBBox();

        distance = Math.sqrt(
            Math.pow(Math.abs(nodeBbox.centerX - delegateBbox.centerX), 2)
            + Math.pow(Math.abs(nodeBbox.centerY - delegateBbox.centerY), 2)
        );

        return distance;

    });

    // 选择最匹配的元素
    // Child[n] : 作为子元素，centerX > Parent.centerX
    for (const node of distanceNodes) {

        const model = node.getModel() as MindmapNodeItem;

        if (node === targetNode
            || model._isHolder
            || model._isDragging) {

            // eslint-disable-next-line no-continue
            continue;

        }

        const nodeBbox = fillChildBBox(mindmap, node.getBBox(), node);

        // 如果是root节点无视区域
        if (
            (
                (mindmap._options.direction === 'LR' && nodeBbox.centerX < delegateBbox.x)
                || model._isRoot
            )
            && (
                (nodeBbox.conMaxY > delegateBbox.centerY && delegateBbox.centerY > nodeBbox.conMinY)
                || model._isRoot
            )
        ) {

            matchOptions.node = node;
            matchOptions.mode = 'childN';
            matchOptions.index = 0;
            matchOptions.hasPlaceholder = false;

            // const model = node.getModel();

            // 仅考虑可见的子元素(不考虑折叠的子元素)
            const children = model.children;

            for (const index in children) {

                const childData = children[index] as MindmapNodeItem;
                const childBbox = mindmap.graph.findById(childData.id).getBBox();

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
        const model = matchOptions.node.getModel() as MindmapNodeItem;

        // 仅寻找可见的子元素(不考虑折叠的子元素)
        if (model.children === undefined) {

            model.children = [];

        }

        dragHolderIndexOfParent = matchOptions.index;
        model.children.splice(matchOptions.index, 0, {
            id : String(globalData.id++),
            type : 'mind-holder-node',
            // eslint-disable-next-line no-magic-numbers
            // TODO 和tag的兼容性
            anchorPoints : [[0, 0.5], [1, 0.5]],
            _isRoot : false,
            _isNode : true,
            _isDragging : false,
            _isHolder : true,
        });
        dragHolderParentModel = model;
        mindmap.graph.paint();
        mindmap.graph.changeData();
        mindmap.graph.layout();

        const node = mindmap.graph.findById(String(globalData.id - 1)) as INode;

        node.getInEdges()[0].update({
            type : 'mind-holder-edge',
        });

    }

}, DRAG_REFRESH_INTERVAL);

const calculationGroupPosition = (mindmap: MindmapCoreType): OriginPointType => {

    const graph = mindmap.graph;
    const nodes = graph.findAllByState('node', 'selected');

    let minx = Infinity;
    let maxx = -Infinity;
    let miny = Infinity;
    let maxy = -Infinity;

    // 获取已节点的所有最大最小x y值
    for (const node of nodes) {

        const item = (typeof node === 'string') ? graph.findById(node) : node;
        const bbox = item.getBBox();
        const {
            minX,
            minY,
            maxX,
            maxY,
        } = bbox;

        if (minX < minx) {

            minx = minX;

        }

        if (minY < miny) {

            miny = minY;

        }

        if (maxX > maxx) {

            maxx = maxX;

        }

        if (maxY > maxy) {

            maxy = maxY;

        }

    }

    const x = Math.floor(minx);
    const y = Math.floor(miny);
    const width = Math.ceil(maxx) - x;
    const height = Math.ceil(maxy) - y;

    return {
        x,
        y,
        width,
        height,
        minX : minx,
        minY : miny,
    };

};

const updateDelegate = (options: UpdateDelegateOptions): void => {

    const {
        mindmap,
        evt,
        dragOptions,
    } = options;

    // 如果还没创建代理元素
    if (dragOptions.delegateShape === null) {

        const parentGroup: IGroup = mindmap.graph.get('group');
        const delegateShapeAttr = {
            fill : DRAG_NODE_STYLE.bgColor,
            stroke : DRAG_NODE_STYLE.borderColor,
            lineWidth : DRAG_NODE_STYLE.borderWidth,
            lineDash : DRAG_NODE_STYLE.borderDash,
        };

        if (dragOptions.type === 'select') {

            dragOptions.originPoint = calculationGroupPosition(mindmap);
            dragOptions.delegateShape = parentGroup.addShape('rect', {
                attrs : {
                    width : dragOptions.originPoint.width,
                    height : dragOptions.originPoint.height,
                    x : dragOptions.originPoint.x,
                    y : dragOptions.originPoint.y,
                    ...delegateShapeAttr,
                },
            });
            dragTarget = {
                nodes : dragOptions.targets,
                hidden : false,
                originNodeStyle : {},
                saveModel : {},
            };

        } else if (dragOptions.type === 'unselect-single') {

            const keyShape = dragOptions.targets[0].get('keyShape') as IShape;
            const bbox = keyShape.getBBox();
            const x = evt.x - dragOptions.originX + dragOptions.point.x;
            const y = evt.y - dragOptions.originY + dragOptions.point.y;

            dragOptions.delegateShape = parentGroup.addShape('rect', {
                attrs : {
                    width : bbox.width,
                    height : bbox.height,
                    x : x + bbox.x,
                    y : y + bbox.y,
                    ...delegateShapeAttr,
                },
            });
            dragTarget = {
                nodes : dragOptions.targets,
                hidden : false,
                originNodeStyle : {},
                saveModel : {},
            };

        }

        updateDragTarget(mindmap, true);
        refreshDragHolder(mindmap, dragOptions.delegateShape, evt.item as INode);
        // this.target.set('delegateShape', this.delegateShape);
        // this.dragOptions.delegateShape.set('capture', false);

    } else if (dragOptions.type === 'unselect-single') {

        const bbox = evt.item.get('keyShape').getBBox() as IBBox;
        const x = evt.x - dragOptions.originX + dragOptions.point.x;
        const y = evt.y - dragOptions.originY + dragOptions.point.y;

        dragOptions.delegateShape.attr({
            x : x + bbox.x,
            y : y + bbox.y,
        });
        refreshDragHolder(mindmap, dragOptions.delegateShape, null);

    } else if (dragOptions.type === 'select') {

        const clientX = evt.x - dragOptions.originX + dragOptions.originPoint.minX;
        const clientY = evt.y - dragOptions.originY + dragOptions.originPoint.minY;

        dragOptions.delegateShape.attr({
            x : clientX,
            y : clientY,
        });
        refreshDragHolder(mindmap, dragOptions.delegateShape, null);

    }

    mindmap.graph.paint();

};

const getTopSelectedNodeModel = (node: INode): MindmapNodeItem => {

    const parentNode = node.getInEdges()[0].getSource();

    let model = node.getModel() as MindmapNodeItem;

    if (parentNode.getStates().indexOf('selected') !== -1) {

        model = getTopSelectedNodeModel(parentNode);

    }

    return model;

};

export const getNodeDragBehavior = (mindmap: MindmapCoreType): BehaviorOption => ({
    getDefaultCfg (): NodeDragBehaviorCfg {

        return {
            dragOptions : null,
        };

    },
    getEvents (): BehaviorEvents {

        return {
            'node:dragstart' : 'onDragStart',
            'node:drag' : 'onDrag',
            'node:dragend' : 'onDragEnd',
            // 'canvas:mouseleave' : 'onOutOfRange'
        };

    },
    onDragStart (evt: IG6GraphEvent): void {

        if (!evt.item) {

            return;

        }

        const model = evt.item.getModel() as MindmapNodeItem;

        // root节点不能被拖拽
        if (model._isRoot) {

            return;

        }

        const dragOptions: DragOptions = {
            originX : evt.x,
            originY : evt.y,
            originPoint : null,
            delegateShape : null,
            targets : [],
        };

        // 获取所有选中的元素
        const nodeIds = mindmap.getAllSelectedNodeIds();
        const targetNodeId: string = evt.item.get('id');

        // 当前拖动的节点是否是选中的节点
        const dragNodes = nodeIds.filter((id) => targetNodeId === id);

        if (dragNodes.length === 0) {

            // 只拖动当前节点
            const currentModel = evt.item.getModel();

            dragOptions.type = 'unselect-single';
            dragOptions.targets = [evt.item];
            dragOptions.point = {
                x : currentModel.x,
                y : currentModel.y,
            };

        } else if (nodeIds.length === 1) {

            // 拖动选中节点
            dragOptions.targets = [evt.item];
            dragOptions.type = 'select';

        } else {

            const models: MindmapNodeItem[] = [];

            // 拖动多个节点
            nodeIds.forEach((id) => {

                const node = mindmap.graph.findById(id) as INode;
                const nodeModel = getTopSelectedNodeModel(node);

                // 仅计算top节点
                if (models.indexOf(nodeModel) === -1) {

                    models.push(nodeModel);
                    dragOptions.targets.push(node);

                }

            });

            dragOptions.type = 'select';

        }

        this.dragOptions = dragOptions;

    },
    onDrag (evt: IG6GraphEvent): void {

        if (!evt.item) {

            return;

        }

        const model = evt.item.getModel();
        const dragOptions: DragOptions = this.dragOptions;

        if (!this.get('shouldUpdate').call(this, evt) || model._isRoot) {

            return;

        }

        if (dragOptions.type === 'unselect-single') {

            updateDelegate({
                mindmap,
                evt,
                dragOptions,
            });

        } else {

            updateDelegate({
                mindmap,
                evt,
                dragOptions,
            });

        }

        mindmap.dragging = true;

    },
    onDragEnd (evt: IG6GraphEvent): void {

        if (!this.get('shouldEnd').call(this, evt)) {

            return;

        }

        const model = evt.item.getModel() as MindmapNodeItem;

        // root节点不能被拖拽
        if (model._isRoot) {

            return;

        }

        const dragOptions: DragOptions = this.dragOptions;

        if (dragOptions.delegateShape) {

            dragOptions.delegateShape.remove();
            dragOptions.delegateShape = null;

        }

        // 终止时需要判断此时是否在监听画布外的 mouseup 事件，若有则解绑
        const fn: (this: HTMLElement, evt: MouseEvent) => any = this.fn;

        if (typeof fn === 'function') {

            window.document.body.removeEventListener('mouseup', fn, false);
            this.fn = null;

        }

        updateDragTarget(mindmap, false);

        // 若目标父节点处于折叠状态，则打开
        // 并且不需要_removeOldDragPlaceholder，因为展开时会自动删除当前的children
        if (dragHolderParentModel._isFolded) {

            mindmap.graph.layout();
            mindmap.fold(dragHolderParentModel.id, false);

        } else {

            removeOldDragPlaceholder(mindmap);
            mindmap.graph.layout();

        }

        dragHolderParentModel = null;
        dragHolderIndexOfParent = null;
        this.dragOptions = null;
        mindmap.dragging = false;

    },
});
