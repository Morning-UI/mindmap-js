import { MIND_EDGE_STYLE, } from '../style';
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
export var getMindEdge = function (mindmap) { return ({
    draw: function (cfg, group) {
        var startPoint = cfg.startPoint;
        var endPoint = cfg.endPoint;
        var radius = MIND_EDGE_STYLE.radius;
        var p1 = {
            x: ((endPoint.x - startPoint.x) / 3) + startPoint.x - radius,
            y: startPoint.y,
        };
        var p12c = {
            x: p1.x + radius,
            y: startPoint.y,
        };
        var p2 = {
            x: p1.x + radius,
            y: startPoint.y < endPoint.y ? startPoint.y + radius : startPoint.y - radius,
        };
        var p3 = {
            x: p2.x,
            y: startPoint.y < endPoint.y ? endPoint.y - radius : endPoint.y + radius,
        };
        var p34c = {
            x: p3.x,
            y: endPoint.y,
        };
        var p4 = {
            x: p3.x + radius,
            y: endPoint.y,
        };
        var path;
        if (startPoint.y !== endPoint.y) {
            path = [
                ['M', startPoint.x, startPoint.y],
                ['L', p1.x, p1.y],
                ['Q', p12c.x, p12c.y, p2.x, p2.y],
                ['L', p3.x, p3.y],
                ['Q', p34c.x, p34c.y, p4.x, p4.y],
                ['L', endPoint.x, endPoint.y],
            ];
        }
        else {
            // 直线
            path = [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x, endPoint.y],
            ];
        }
        var shape = group.addShape('path', {
            attrs: {
                stroke: MIND_EDGE_STYLE.borderColor,
                lineWidth: MIND_EDGE_STYLE.borderWidth,
                path: path,
            },
            name: 'path-shape',
        });
        return shape;
    },
}); };
