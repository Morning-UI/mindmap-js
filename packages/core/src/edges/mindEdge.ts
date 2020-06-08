import {
    IShape,
}                                               from '@antv/g-base/lib/interfaces';
import {
    MindShapeOptions,
    NodeStyle,
}                                               from '../interface';
import {
    MIND_EDGE_STYLE,
}                                               from '../style';

export const getMindEdge = (): MindShapeOptions => ({
    getStyles (): NodeStyle {

        return {};

    },
    draw (cfg, group): IShape {

        const styles: NodeStyle = {
            ...MIND_EDGE_STYLE,
            ...this.getStyles(),
        };
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const radius = styles.radius;
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
                stroke : styles.borderColor,
                lineWidth : styles.borderWidth,
                path,
            },
            name : 'path-shape',
        });

        return shape;

    },
});

