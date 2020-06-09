var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { MIND_EDGE_STYLE, } from '../style';
export var getMindEdge = function () { return ({
    getStyles: function () {
        return {};
    },
    draw: function (cfg, group) {
        var styles = __assign(__assign({}, MIND_EDGE_STYLE), this.getStyles());
        var startPoint = cfg.startPoint;
        var endPoint = cfg.endPoint;
        var radius = styles.radius;
        var p1 = {
            x: ((endPoint.x - startPoint.x) / 3) + startPoint.x,
            y: startPoint.y,
        };
        var p3 = {
            x: p1.x,
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
        // const dir = startPoint.y < endPoint.y ? 'up' : 'down';
        var path;
        if (startPoint.y !== endPoint.y) {
            // 曲线
            path = [
                ['M', startPoint.x, startPoint.y],
                ['L', p1.x, p1.y],
                // ['Q', p12c.x, p12c.y, p2.x, p2.y],
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
                stroke: styles.borderColor,
                lineWidth: styles.borderWidth,
                path: path,
            },
            name: 'path-shape',
        });
        return shape;
    },
}); };
