import {
    BehaviorOption,
    IG6GraphEvent,
    G6Event,
}                                               from '@antv/g6/lib/types';
import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    IGroup,
    IShape,
}                                               from '@antv/g-base/lib/interfaces';
import {
    MindmapCore,
}                                               from '../index';
import {
    NodeDragBehaviorCfg,
    BehaviorEvents,
    DragOptions,
    UpdateDelegateOptions,
    DragTarget,
    MindmapNodeItem,
}                                               from '../interface';
import {
    DRAG_NODE_STYLE,
}                                               from '../style';

let dragTarget: DragTarget = null;
let dragHolderParentModel: MindmapNodeItem = null;
let dragHolderIndexOfParent: number = null;

const updateDragTarget = (mindmap: MindmapCore, dragging: boolean = false): void => {

    const targetNodes = dragTarget.nodes;
    const first: boolean = true;

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

    // TODO : DOING
    for (let index in targetNodes) {

        if (!first) {

            _udpateOneDragTarget(vm, index, dragging, dragHolderIndexOfParentChildren + 1);

        } else {

            _udpateOneDragTarget(vm, index, dragging, dragHolderIndexOfParentChildren);

        }

        first = false;

    }

    if (dragging && !dragTarget.hidden) {

        dragTarget.hidden = true;
        vm.data.graph.refreshLayout();

    } else if (!dragging && dragTarget.hidden) {

        dragTarget.hidden = false;

        dragHolderIndexOfParentChildren += targetNodes.length;

        // 如果父节点处于折叠状态，永远都是0
        if (dragHolderParentModel._collapsed) {

            dragHolderIndexOfParentChildren = 0;

        }

        vm.data.graph.paint();
        vm.data.graph.changeData();
        vm.data.graph.refreshLayout();

    }

};

const updateDelegate = (options: UpdateDelegateOptions): void => {

    const {
        mindmap,
        evt,
        dragOptions,
    } = options;

    // 如果还没创建代理元素
    if (!dragOptions.delegateShape === null) {

        const parentGroup: IGroup = mindmap.graph.get('group');
        const delegateShapeAttr = {
            fill : DRAG_NODE_STYLE.bgColor,
            stroke : DRAG_NODE_STYLE.borderColor,
            lineWidth : DRAG_NODE_STYLE.borderWidth,
            lineDash : DRAG_NODE_STYLE.borderDash,
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
        // TODO : DOING
        _refreshDragHolder(vm, this.dragOptions.delegateShape, evt.item);
        // this.target.set('delegateShape', this.delegateShape);
        // this.dragOptions.delegateShape.set('capture', false);

    } else if (dragOptions.type === 'unselect-single') {

        let bbox = evt.item.get('keyShape').getBBox();
        let x = evt.x - this.dragOptions.originX + this.point.x;
        let y = evt.y - this.dragOptions.originY + this.point.y;

        this.dragOptions.delegateShape.attr({
            x : x + bbox.x,
            y : y + bbox.y
        });
        _refreshDragHolder(vm, this.dragOptions.delegateShape, null);

    } else if (this.dragOptions.type === 'select') {

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

export const getNodeDragBehavior = (mindmap: MindmapCore): BehaviorOption => ({
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

        const model = evt.item.getModel();

        // root节点不能被拖拽
        if (model._isRoot) {

            return;

        }

        const dragOptions: DragOptions = {
            originX : evt.x,
            originY : evt.y,
            delegateShape : null,
        };

        // 获取所有选中的元素
        const nodes = mindmap.graph.findAllByState('node', 'selected');
        const targetNodeId: string = evt.item.get('id');

        // 当前拖动的节点是否是选中的节点
        const dragNodes = nodes.filter((node) => targetNodeId === node.get('id'));

        if (dragNodes.length === 0) {

            // 只拖动当前节点
            const currentModel = evt.item.getModel();

            dragOptions.type = 'unselect-single';
            dragOptions.targets = [evt.item];
            dragOptions.point = {
                x : currentModel.x,
                y : currentModel.y,
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
    onDrag (evt: IG6GraphEvent): void {

        if (!evt.item) {

            return;

        }

        const model = evt.item.getModel();
        const dragOptions: DragOptions = this.dragOptions;

        if (!this.get('shouldUpdate').call(this, evt) || model._isRoot) {

            return;

        }

        // if (dragOptions.type === 'unselect-single') {

        updateDelegate({
            mindmap,
            evt,
            dragOptions,
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
});
