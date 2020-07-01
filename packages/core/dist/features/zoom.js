import { ZoomFeatures, } from '../interface';
export var zoom = function (options) {
    var mindmap = options.mindmap, _zoom = options.zoom;
    var originZoom = mindmap.getZoom();
    var zoomVal = _zoom;
    if (zoomVal > mindmap._options.maxZoom) {
        zoomVal = mindmap._options.maxZoom;
    }
    if (zoomVal < mindmap._options.minZoom) {
        zoomVal = mindmap._options.minZoom;
    }
    mindmap.graph.zoomTo(zoomVal, {
        x: mindmap.graph.get('width') / 2,
        y: mindmap.graph.get('height') / 2,
    });
    mindmap._updateZoomValue();
    return {
        note: '调整缩放',
        undoCmd: {
            cmd: ZoomFeatures.Commands.Zoom,
            opts: {
                zoom: originZoom,
            },
        },
    };
};
export var fitZoom = function (options) {
    var mindmap = options.mindmap;
    var originZoom = mindmap.getZoom();
    var originPos = mindmap.getCanvasPos();
    mindmap.graph.fitView();
    mindmap._updateZoomValue();
    return {
        note: '适配缩放',
        undoCmd: [
            {
                cmd: ZoomFeatures.Commands.Zoom,
                opts: {
                    zoom: originZoom,
                },
            },
            {
                cmd: ZoomFeatures.Commands.MoveCanvas,
                opts: {
                    x: originPos.x,
                    y: originPos.y,
                },
            },
        ],
    };
};
export var fitCenter = function (options) {
    var mindmap = options.mindmap;
    var originZoom = mindmap.getZoom();
    var originPos = mindmap.getCanvasPos();
    mindmap.graph.fitCenter();
    mindmap._updateZoomValue();
    return {
        note: '适配至中心',
        undoCmd: [
            {
                cmd: ZoomFeatures.Commands.Zoom,
                opts: {
                    zoom: originZoom,
                },
            },
            {
                cmd: ZoomFeatures.Commands.MoveCanvas,
                opts: {
                    x: originPos.x,
                    y: originPos.y,
                },
            },
        ],
    };
};
export var moveCanvas = function (options) {
    var mindmap = options.mindmap, x = options.x, y = options.y;
    var originPos = mindmap.getCanvasPos();
    mindmap.graph.moveTo(x, y);
    return {
        note: '移动画布',
        undoCmd: {
            cmd: ZoomFeatures.Commands.MoveCanvas,
            opts: {
                x: originPos.x,
                y: originPos.y,
            },
        },
    };
};
