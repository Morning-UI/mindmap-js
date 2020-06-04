// import * as G6                                  from '@antv/g6';
// import GGroup                                   from '@antv/g-canvas/lib/group';
// import {
//     IPoint,
//     EdgeConfig,
//     ModelConfig,
//     ShapeStyle,
// }                                               from '@antv/g6/lib/types';
// import Node                                     from '@antv/g6/lib/item/node';
import {
    IShape,
}                                               from '@antv/g-base/lib/interfaces';
// import {
//     Point,
// }                                               from '@antv/g-base/lib/types';
// import {
//     // isBending,
//     // getBorderRadiusPoints,
//     simplifyPolyline,
//     getPolylinePoints,
//     getPathWithBorderRadiusByPolyline,
// }                                               from '@antv/g6/lib/shape/edges/polyline-util';
import {
    pointsToPolygon,
}                                               from '@antv/g6/lib/util/path';
import {
    MindShapeOptions,
    MindmapNodeItem,
}                                               from '../interface';
import {
    default as MindmapCore,
}                                               from '../index';
import {
    MIND_EDGE_STYLE,
}                                               from '../style';

// const getPathWithBorderRadiusByPolyline = (points: PolyPoint[], borderRadius: number): string => {

//     const pathSegments: string[] = [];
//     const startPoint = points[0];

//     pathSegments.push(`M${startPoint.x} ${startPoint.y}`);

//     points.forEach((p, i) => {
//         const p1 = points[i + 1];
//         const p2 = points[i + 2];

//         if (p1 && p2) {

//             if (isBending(p, p1, p2)) {

//                 const [ps, pt] = getBorderRadiusPoints(p, p1, p2, borderRadius);
//                 pathSegments.push(`L${ps.x} ${ps.y}`);
//                 pathSegments.push(`Q${p1.x} ${p1.y} ${pt.x} ${pt.y}`);
//                 pathSegments.push(`L${pt.x} ${pt.y}`);

//             } else {

//                 pathSegments.push(`L${p1.x} ${p1.y}`);

//             }

//         } else if (p1) {

//             pathSegments.push(`L${p1.x} ${p1.y}`);

//         }
//     });

//     return pathSegments.join('');

// };

export const getMindEdge = (mindmap: MindmapCore): MindShapeOptions => ({
    draw (cfg, group): IShape {

        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const radius = MIND_EDGE_STYLE.radius;
        const p1 = {
            x : ((endPoint.x - startPoint.x) / 3) + startPoint.x - radius,
            y : startPoint.y,
        };
        const p12c = {
            x : p1.x + radius,
            y : startPoint.y,
        };
        const p2 = {
            x : p1.x + radius,
            y : startPoint.y < endPoint.y ? startPoint.y + radius : startPoint.y - radius,
        };
        const p3 = {
            x : p2.x,
            y : startPoint.y < endPoint.y ? endPoint.y - radius : endPoint.y + radius,
        };
        const p34c = {
            x : p3.x,
            y : endPoint.y,
        };
        const p4 = {
            x : p3.x + radius,
            y : endPoint.y,
        };

        let path: (string|number)[][];

        if (startPoint.y !== endPoint.y) {

            path = [
                ['M', startPoint.x, startPoint.y],
                ['L', p1.x, p1.y],
                ['Q', p12c.x, p12c.y, p2.x, p2.y],
                ['L', p3.x, p3.y],
                ['Q', p34c.x, p34c.y, p4.x, p4.y],
                ['L', endPoint.x, endPoint.y],
            ];

        } else {

            // 直线
            path = [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x, endPoint.y],
            ];

        }

        const shape = group.addShape('path', {
            attrs : {
                stroke : MIND_EDGE_STYLE.borderColor,
                lineWidth : MIND_EDGE_STYLE.borderWidth,
                path,
            },
            name : 'path-shape',
        });

        return shape;

    },
});

