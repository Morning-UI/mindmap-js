import { BRUSH_SELECT_STYLE, } from '../style';
import { clearSelectedNode, } from '../base/utils';
var selectedNodes = [];
var brushShape = null;
var dragging = false;
var originPoint = null;
var createBrush = function (mindmap) {
    var shape = mindmap.graph.get('canvas').addShape('rect', {
        attrs: {
            fill: BRUSH_SELECT_STYLE.bgColor,
            stroke: BRUSH_SELECT_STYLE.borderColor,
            lineWidth: BRUSH_SELECT_STYLE.borderWidth,
            lineDash: BRUSH_SELECT_STYLE.borderDash,
        },
        capture: false,
    });
    return shape;
};
var stopBurshSelect = function (mindmap) {
    if (!brushShape) {
        return;
    }
    var graph = mindmap.graph;
    var autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    brushShape.hide();
    dragging = false;
    brushShape = null;
    originPoint = null;
    graph.paint();
    graph.setAutoPaint(autoPaint);
};
var clearStates = function (mindmap) {
    if (!mindmap.keydownState.mod) {
        clearSelectedNode(mindmap, 'selected');
        selectedNodes = [];
    }
};
var computeSelectedNodes = function (mindmap, evt, shouldUpdate) {
    var graph = mindmap.graph;
    var selectedState = 'selected';
    var p1 = evt;
    var p2 = graph.getPointByCanvas(originPoint.x, originPoint.y);
    var left = Math.min(p1.x, p2.x);
    var right = Math.max(p1.x, p2.x);
    var top = Math.min(p1.y, p2.y);
    var bottom = Math.max(p1.y, p2.y);
    var width = right - left;
    var height = bottom - top;
    var centerX = left + (width / 2);
    var centerY = top + (height / 2);
    var selectNodes = [];
    var selectIds = [];
    graph.getNodes().forEach(function (node) {
        var bbox = node.getBBox();
        // 计算矩形相交
        if (Math.abs(centerX - bbox.centerX) < ((bbox.width + width) / 2)
            && Math.abs(centerY - bbox.centerY) < ((bbox.height + height) / 2)) {
            if (shouldUpdate(node, 'select')) {
                var model = node.getModel();
                selectNodes.push(node);
                selectIds.push(model.id);
                graph.setItemState(node, selectedState, true);
            }
        }
    });
    selectedNodes = selectNodes;
};
var updateBrush = function (evt) {
    brushShape.attr({
        width: Math.abs(evt.canvasX - originPoint.x),
        height: Math.abs(evt.canvasY - originPoint.y),
        x: Math.min(evt.canvasX, originPoint.x),
        y: Math.min(evt.canvasY, originPoint.y),
    });
};
export var getNodeBrushSelectBehavior = function (mindmap) { return ({
    getDefaultCfg: function () {
        return {
            // brushStyle : {
            //     fill : '#e0efff',
            //     fillOpacity : 0.4,
            //     stroke : '#b2d2ef',
            //     lineWidth : 1
            // },
            // onSelect () {},
            // onDeselect () {},
            includeEdges: true,
        };
    },
    clearStates: function () {
        return clearStates(mindmap);
    },
    getEvents: function () {
        return {
            mousedown: 'onMouseDown',
            dragend: 'onMouseUp',
            drag: 'onMouseMove',
            'canvas:click': 'clearStates',
            keyup: 'onKeyUp',
            keydown: 'onKeyDown',
        };
    },
    onMouseDown: function (evt) {
        if (evt.item || !mindmap.keydownState.shift) {
            return;
        }
        this.clearStates();
        brushShape = brushShape ? brushShape : createBrush(mindmap);
        originPoint = {
            x: evt.canvasX,
            y: evt.canvasY,
        };
        dragging = true;
        brushShape.attr({
            width: 0,
            height: 0,
        });
        brushShape.show();
    },
    onMouseMove: function (evt) {
        if (!dragging
            || !mindmap.keydownState.shift) {
            return;
        }
        this.clearStates();
        computeSelectedNodes(mindmap, evt, this.shouldUpdate);
        updateBrush(evt);
        this.graph.paint();
    },
    onMouseUp: function () {
        stopBurshSelect(mindmap);
    },
    onKeyDown: function (evt) {
        var code = evt.key;
        var shift = !!(code && code.toLowerCase() === 'shift');
        mindmap.keydownState.shift = shift;
        setTimeout(function () {
            mindmap._options.$canvas.querySelector('canvas').style.cursor = 'default';
        });
    },
    onKeyUp: function () {
        stopBurshSelect(mindmap);
        mindmap.keydownState.shift = false;
        setTimeout(function () {
            mindmap._options.$canvas.querySelector('canvas').style.cursor = 'move';
        });
    },
}); };
