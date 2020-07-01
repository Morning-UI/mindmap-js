import {
    ZoomFeatures,
    Command,
}                                               from '../interface';

export const zoom: ZoomFeatures.Zoom = (options) => {

    const {
        mindmap,
        zoom : _zoom,
    } = options;
    const originZoom = mindmap.getZoom();

    let zoomVal = _zoom;

    if (zoomVal > mindmap._options.maxZoom) {

        zoomVal = mindmap._options.maxZoom;

    }

    if (zoomVal < mindmap._options.minZoom) {

        zoomVal = mindmap._options.minZoom;

    }

    mindmap.graph.zoomTo(zoomVal, {
        x : mindmap.graph.get('width') / 2,
        y : mindmap.graph.get('height') / 2,
    });
    mindmap._updateZoomValue();

    return {
        note : '调整缩放',
        undoCmd : {
            cmd : ZoomFeatures.Commands.Zoom,
            opts : {
                zoom : originZoom,
            },
        } as Command<ZoomFeatures.Commands.Zoom>,
    };

};

export const fitZoom: ZoomFeatures.FitZoom = (options) => {

    const {mindmap} = options;
    const originZoom = mindmap.getZoom();
    const originPos = mindmap.getCanvasPos();

    mindmap.graph.fitView();
    mindmap._updateZoomValue();

    return {
        note : '适配缩放',
        undoCmd : [
            {
                cmd : ZoomFeatures.Commands.Zoom,
                opts : {
                    zoom : originZoom,
                },
            } as Command<ZoomFeatures.Commands.Zoom>,
            {
                cmd : ZoomFeatures.Commands.MoveCanvas,
                opts : {
                    x : originPos.x,
                    y : originPos.y,
                },
            } as Command<ZoomFeatures.Commands.MoveCanvas>,
        ],
    };

};

export const fitCenter: ZoomFeatures.FitCenter = (options) => {

    const {mindmap} = options;
    const originZoom = mindmap.getZoom();
    const originPos = mindmap.getCanvasPos();

    mindmap.graph.fitCenter();
    mindmap._updateZoomValue();

    return {
        note : '适配至中心',
        undoCmd : [
            {
                cmd : ZoomFeatures.Commands.Zoom,
                opts : {
                    zoom : originZoom,
                },
            } as Command<ZoomFeatures.Commands.Zoom>,
            {
                cmd : ZoomFeatures.Commands.MoveCanvas,
                opts : {
                    x : originPos.x,
                    y : originPos.y,
                },
            } as Command<ZoomFeatures.Commands.MoveCanvas>,
        ],
    };

};

export const moveCanvas: ZoomFeatures.MoveCanvas = (options) => {

    const {
        mindmap,
        x,
        y,
    } = options;
    const originPos = mindmap.getCanvasPos();

    mindmap.graph.moveTo(x, y);

    return {
        note : '移动画布',
        undoCmd : {
            cmd : ZoomFeatures.Commands.MoveCanvas,
            opts : {
                x : originPos.x,
                y : originPos.y,
            },
        } as Command<ZoomFeatures.Commands.MoveCanvas>,
    };

};