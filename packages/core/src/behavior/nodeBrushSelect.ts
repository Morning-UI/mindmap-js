import {
    BehaviorOption,
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    IShape,
}                                               from '@antv/g-base/lib/interfaces';
import {
    BehaviorEvents,
    MindmapNodeItem,
    MindmapCoreType,
    BrushSelectBehaviorCfg,
    NodeId,
}                                               from '../interface';
import {
    BRUSH_SELECT_STYLE,
}                                               from '../style';
import {
    clearSelectedNode,
}                                               from '../base/utils';
import {
    setItemState,
}                                               from '../utils/setItemState';
import {
    getModel,
}                                               from '../utils/getModel';

type OriginPointType = {
    x: number;
    y: number;
};

let selectedNodes: INode[] = [];
let brushShape: IShape = null;
let dragging: boolean = false;
let originPoint: OriginPointType = null;

const createBrush = (mindmap: MindmapCoreType): IShape => {

    const shape: IShape = mindmap.graph.get('canvas').addShape('rect', {
        attrs : {
            fill : BRUSH_SELECT_STYLE.bgColor,
            stroke : BRUSH_SELECT_STYLE.borderColor,
            lineWidth : BRUSH_SELECT_STYLE.borderWidth,
            lineDash : BRUSH_SELECT_STYLE.borderDash,
        },
        capture : false,
    });

    return shape;

};

const stopBurshSelect = (mindmap: MindmapCoreType): void => {

    if (!brushShape) {

        return;

    }

    const graph = mindmap.graph;
    const autoPaint = graph.get('autoPaint');

    graph.setAutoPaint(false);
    brushShape.hide();
    dragging = false;
    brushShape = null;
    originPoint = null;
    graph.paint();
    graph.setAutoPaint(autoPaint);

};

const clearStates = (mindmap: MindmapCoreType): void => {

    if (!mindmap.keydownState.mod) {

        clearSelectedNode(mindmap, 'selected');
        selectedNodes = [];

    }

};

const computeSelectedNodes = (
    mindmap: MindmapCoreType,
    evt: IG6GraphEvent,
    shouldUpdate: (node: INode, state: string) => boolean,
): void => {

    const graph = mindmap.graph;
    const selectedState = 'selected';
    const p1 = evt;
    const p2 = graph.getPointByCanvas(originPoint.x, originPoint.y);
    const left = Math.min(p1.x, p2.x);
    const right = Math.max(p1.x, p2.x);
    const top = Math.min(p1.y, p2.y);
    const bottom = Math.max(p1.y, p2.y);
    const width = right - left;
    const height = bottom - top;
    const centerX = left + (width / 2);
    const centerY = top + (height / 2);
    const selectNodes: INode[] = [];
    const selectIds: NodeId[] = [];

    graph.getNodes().forEach((node) => {

        const bbox = node.getBBox();

        // 计算矩形相交
        if (
            Math.abs(centerX - bbox.centerX) < ((bbox.width + width) / 2)
            && Math.abs(centerY - bbox.centerY) < ((bbox.height + height) / 2)
        ) {

            if (shouldUpdate(node, 'select')) {

                const model = getModel(node);

                selectNodes.push(node);
                selectIds.push(model.id);
                setItemState(graph, node.get('id'), selectedState, true);

            }

        }

    });

    selectedNodes = selectNodes;

};

const updateBrush = (evt: IG6GraphEvent): void => {

    brushShape.attr({
        width : Math.abs(evt.canvasX - originPoint.x),
        height : Math.abs(evt.canvasY - originPoint.y),
        x : Math.min(evt.canvasX, originPoint.x),
        y : Math.min(evt.canvasY, originPoint.y),
    });

};

export const getNodeBrushSelectBehavior = (mindmap: MindmapCoreType): BehaviorOption => ({
    getDefaultCfg (): BrushSelectBehaviorCfg {

        return {
            includeEdges : true,
        };

    },
    clearStates (): void {

        return clearStates(mindmap);

    },
    getEvents (): BehaviorEvents {

        return {
            mousedown : 'onMouseDown',
            dragend : 'onMouseUp',
            drag : 'onMouseMove',
            'canvas:click' : 'clearStates',
            keyup : 'onKeyUp',
            keydown : 'onKeyDown',
        };

    },
    onMouseDown (evt: IG6GraphEvent): void {

        if (evt.item || !mindmap.keydownState.shift) {

            return;

        }

        this.clearStates();

        brushShape = brushShape ? brushShape : createBrush(mindmap);
        originPoint = {
            x : evt.canvasX,
            y : evt.canvasY,
        };

        dragging = true;
        brushShape.attr({
            width : 0,
            height : 0,
        });
        brushShape.show();

    },
    onMouseMove (evt: IG6GraphEvent): void {

        if (!dragging
            || !mindmap.keydownState.shift) {

            return;

        }

        this.clearStates();
        computeSelectedNodes(mindmap, evt, this.shouldUpdate);
        updateBrush(evt);
        this.graph.paint();

    },
    onMouseUp (): void {

        stopBurshSelect(mindmap);

    },
    onKeyDown (evt: IG6GraphEvent): void {

        const code = evt.key;
        const shift = !!(code && code.toLowerCase() === 'shift');

        mindmap.keydownState.shift = shift;

        setTimeout(() => {

            mindmap._options.$canvas.querySelector('canvas').style.cursor = 'default';

        });

    },
    onKeyUp (): void {

        stopBurshSelect(mindmap);
        mindmap.keydownState.shift = false;

        setTimeout(() => {

            mindmap._options.$canvas.querySelector('canvas').style.cursor = 'move';

        });

    },
});
