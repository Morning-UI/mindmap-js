"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.radialLayout = exports.traverseTree = exports.getLabelPosition = exports.getLoopCfgs = exports.getBBox = void 0;
var _tslib = require("tslib");
var _matrixUtil = require("@antv/matrix-util");
var _each = _interopRequireDefault(require("@antv/util/lib/each"));
var _global = _interopRequireDefault(require("../global"));
var _math = require("./math");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var PI = Math.PI, sin = Math.sin, cos = Math.cos; // 一共支持8个方向的自环，每个环占的角度是45度，在计算时再二分，为22.5度
var SELF_LINK_SIN = sin(PI / 8);
var SELF_LINK_COS = cos(PI / 8);
var getBBox = function getBBox(element, group) {
    var bbox = element.getBBox();
    var leftTop = {
        x: bbox.minX,
        y: bbox.minY
    };
    var rightBottom = {
        x: bbox.maxX,
        y: bbox.maxY
    }; // 根据父元素变换矩阵
    if (group) {
        var matrix = group.getMatrix();
        if (!matrix) {
            matrix = _matrixUtil.mat3.create();
        }
        leftTop = (0, _math.applyMatrix)(leftTop, matrix);
        rightBottom = (0, _math.applyMatrix)(rightBottom, matrix);
    }
    var lx = leftTop.x, ly = leftTop.y;
    var rx = rightBottom.x, ry = rightBottom.y;
    return {
        x: lx,
        y: ly,
        minX: lx,
        minY: ly,
        maxX: rx,
        maxY: ry,
        width: rx - lx,
        height: ry - ly
    };
};
/**
 * get loop edge config
 * @param cfg edge config
 */
exports.getBBox = getBBox;
var getLoopCfgs = function getLoopCfgs(cfg) {
    var item = cfg.sourceNode || cfg.targetNode;
    var container = item.get('group');
    var containerMatrix = container.getMatrix();
    if (!containerMatrix)
        containerMatrix = _matrixUtil.mat3.create();
    var keyShape = item.getKeyShape();
    var bbox = keyShape.getBBox();
    var loopCfg = cfg.loopCfg || {}; // 距离keyShape边的最高距离
    var dist = loopCfg.dist || Math.max(bbox.width, bbox.height) * 2; // 自环边与keyShape的相对位置关系
    var position = loopCfg.position || _global.default.defaultLoopPosition; // 中心取group上真实位置
    var center = [containerMatrix[6], containerMatrix[7]];
    var startPoint = [cfg.startPoint.x, cfg.startPoint.y];
    var endPoint = [cfg.endPoint.x, cfg.endPoint.y];
    var rstart = bbox.height / 2;
    var rend = bbox.height / 2;
    var sinDeltaStart = rstart * SELF_LINK_SIN;
    var cosDeltaStart = rstart * SELF_LINK_COS;
    var sinDeltaEnd = rend * SELF_LINK_SIN;
    var cosDeltaEnd = rend * SELF_LINK_COS; // 如果定义了锚点的，直接用锚点坐标，否则，根据自环的 cfg 计算
    if (startPoint[0] === endPoint[0] && startPoint[1] === endPoint[1]) {
        switch (position) {
            case 'top':
                startPoint = [center[0] - sinDeltaStart, center[1] - cosDeltaStart];
                endPoint = [center[0] + sinDeltaEnd, center[1] - cosDeltaEnd];
                break;
            case 'top-right':
                rstart = bbox.height / 2;
                rend = bbox.width / 2;
                sinDeltaStart = rstart * SELF_LINK_SIN;
                cosDeltaStart = rstart * SELF_LINK_COS;
                sinDeltaEnd = rend * SELF_LINK_SIN;
                cosDeltaEnd = rend * SELF_LINK_COS;
                startPoint = [center[0] + sinDeltaStart, center[1] - cosDeltaStart];
                endPoint = [center[0] + cosDeltaEnd, center[1] - sinDeltaEnd];
                break;
            case 'right':
                rstart = bbox.width / 2;
                rend = bbox.width / 2;
                sinDeltaStart = rstart * SELF_LINK_SIN;
                cosDeltaStart = rstart * SELF_LINK_COS;
                sinDeltaEnd = rend * SELF_LINK_SIN;
                cosDeltaEnd = rend * SELF_LINK_COS;
                startPoint = [center[0] + cosDeltaStart, center[1] - sinDeltaStart];
                endPoint = [center[0] + cosDeltaEnd, center[1] + sinDeltaEnd];
                break;
            case 'bottom-right':
                rstart = bbox.width / 2;
                rend = bbox.height / 2;
                sinDeltaStart = rstart * SELF_LINK_SIN;
                cosDeltaStart = rstart * SELF_LINK_COS;
                sinDeltaEnd = rend * SELF_LINK_SIN;
                cosDeltaEnd = rend * SELF_LINK_COS;
                startPoint = [center[0] + cosDeltaStart, center[1] + sinDeltaStart];
                endPoint = [center[0] + sinDeltaEnd, center[1] + cosDeltaEnd];
                break;
            case 'bottom':
                rstart = bbox.height / 2;
                rend = bbox.height / 2;
                sinDeltaStart = rstart * SELF_LINK_SIN;
                cosDeltaStart = rstart * SELF_LINK_COS;
                sinDeltaEnd = rend * SELF_LINK_SIN;
                cosDeltaEnd = rend * SELF_LINK_COS;
                startPoint = [center[0] + sinDeltaStart, center[1] + cosDeltaStart];
                endPoint = [center[0] - sinDeltaEnd, center[1] + cosDeltaEnd];
                break;
            case 'bottom-left':
                rstart = bbox.height / 2;
                rend = bbox.width / 2;
                sinDeltaStart = rstart * SELF_LINK_SIN;
                cosDeltaStart = rstart * SELF_LINK_COS;
                sinDeltaEnd = rend * SELF_LINK_SIN;
                cosDeltaEnd = rend * SELF_LINK_COS;
                startPoint = [center[0] - sinDeltaStart, center[1] + cosDeltaStart];
                endPoint = [center[0] - cosDeltaEnd, center[1] + sinDeltaEnd];
                break;
            case 'left':
                rstart = bbox.width / 2;
                rend = bbox.width / 2;
                sinDeltaStart = rstart * SELF_LINK_SIN;
                cosDeltaStart = rstart * SELF_LINK_COS;
                sinDeltaEnd = rend * SELF_LINK_SIN;
                cosDeltaEnd = rend * SELF_LINK_COS;
                startPoint = [center[0] - cosDeltaStart, center[1] + sinDeltaStart];
                endPoint = [center[0] - cosDeltaEnd, center[1] - sinDeltaEnd];
                break;
            case 'top-left':
                rstart = bbox.width / 2;
                rend = bbox.height / 2;
                sinDeltaStart = rstart * SELF_LINK_SIN;
                cosDeltaStart = rstart * SELF_LINK_COS;
                sinDeltaEnd = rend * SELF_LINK_SIN;
                cosDeltaEnd = rend * SELF_LINK_COS;
                startPoint = [center[0] - cosDeltaStart, center[1] - sinDeltaStart];
                endPoint = [center[0] - sinDeltaEnd, center[1] - cosDeltaEnd];
                break;
            default:
                rstart = bbox.width / 2;
                rend = bbox.width / 2;
                sinDeltaStart = rstart * SELF_LINK_SIN;
                cosDeltaStart = rstart * SELF_LINK_COS;
                sinDeltaEnd = rend * SELF_LINK_SIN;
                cosDeltaEnd = rend * SELF_LINK_COS;
                startPoint = [center[0] - sinDeltaStart, center[1] - cosDeltaStart];
                endPoint = [center[0] + sinDeltaEnd, center[1] - cosDeltaEnd];
        } // 如果逆时针画，交换起点和终点
        if (loopCfg.clockwise === false) {
            var swap = [startPoint[0], startPoint[1]];
            startPoint = [endPoint[0], endPoint[1]];
            endPoint = [swap[0], swap[1]];
        }
    }
    var startVec = [startPoint[0] - center[0], startPoint[1] - center[1]];
    var scaleRateStart = (rstart + dist) / rstart;
    var scaleRateEnd = (rend + dist) / rend;
    if (loopCfg.clockwise === false) {
        scaleRateStart = (rend + dist) / rend;
        scaleRateEnd = (rstart + dist) / rstart;
    }
    var startExtendVec = _matrixUtil.vec2.scale([], startVec, scaleRateStart);
    var controlPoint1 = [center[0] + startExtendVec[0], center[1] + startExtendVec[1]];
    var endVec = [endPoint[0] - center[0], endPoint[1] - center[1]];
    var endExtendVec = _matrixUtil.vec2.scale([], endVec, scaleRateEnd);
    var controlPoint2 = [center[0] + endExtendVec[0], center[1] + endExtendVec[1]];
    cfg.startPoint = {
        x: startPoint[0],
        y: startPoint[1]
    };
    cfg.endPoint = {
        x: endPoint[0],
        y: endPoint[1]
    };
    cfg.controlPoints = [{
            x: controlPoint1[0],
            y: controlPoint1[1]
        }, {
            x: controlPoint2[0],
            y: controlPoint2[1]
        }];
    return cfg;
};
/**
 * 根据 label 所在线条的位置百分比，计算 label 坐标
 * @param {object}  pathShape  G 的 path 实例，一般是 Edge 实例的 keyShape
 * @param {number}  percent    范围 0 - 1 的线条百分比
 * @param {number}  refX     x 轴正方向为基准的 label 偏移
 * @param {number}  refY     y 轴正方向为基准的 label 偏移
 * @param {boolean} rotate     是否根据线条斜率旋转文本
 * @return {object} 文本的 x, y, 文本的旋转角度
 */
exports.getLoopCfgs = getLoopCfgs;
var getLabelPosition = function getLabelPosition(pathShape, percent, refX, refY, rotate) {
    var TAN_OFFSET = 0.0001;
    var vector = [];
    var point = pathShape.getPoint(percent);
    if (point === null) {
        return {
            x: 0,
            y: 0,
            angle: 0
        };
    } // 头尾最可能，放在最前面，使用 g path 上封装的方法
    if (percent < TAN_OFFSET) {
        vector = pathShape.getStartTangent().reverse();
    }
    else if (percent > 1 - TAN_OFFSET) {
        vector = pathShape.getEndTangent();
    }
    else {
        // 否则取指定位置的点,与少量偏移的点，做微分向量
        var offsetPoint = pathShape.getPoint(percent + TAN_OFFSET);
        vector.push([point.x, point.y]);
        vector.push([offsetPoint.x, offsetPoint.y]);
    }
    var rad = Math.atan2(vector[1][1] - vector[0][1], vector[1][0] - vector[0][0]);
    if (rad < 0) {
        rad += PI * 2;
    }
    if (refX) {
        point.x += cos(rad) * refX;
        point.y += sin(rad) * refX;
    }
    if (refY) {
        // 默认方向是 x 轴正方向，法线是 求出角度 - 90°
        var normal = rad - PI / 2; // 若法线角度在 y 轴负方向，切到正方向，保证 refY 相对于 y 轴正方向
        if (rad > 1 / 2 * PI && rad < 3 * 1 / 2 * PI) {
            normal -= PI;
        }
        point.x += cos(normal) * refY;
        point.y += sin(normal) * refY;
    }
    var result = {
        x: point.x,
        y: point.y,
        angle: rad
    };
    if (rotate) {
        if (rad > 1 / 2 * PI && rad < 3 * 1 / 2 * PI) {
            rad -= PI;
        }
        return (0, _tslib.__assign)({
            rotate: rad
        }, result);
    }
    return result;
};
exports.getLabelPosition = getLabelPosition;
var traverse = function traverse(data, fn) {
    if (fn(data) === false) {
        return;
    }
    if (data.children) {
        (0, _each.default)(data.children, function (child) {
            traverse(child, fn);
        });
    }
};
var traverseTree = function traverseTree(data, fn) {
    if (typeof fn !== 'function') {
        return;
    }
    traverse(data, fn);
};
/**
 *
 * @param data Tree graph data
 * @param layout
 */
exports.traverseTree = traverseTree;
var radialLayout = function radialLayout(data, layout) {
    // 布局方式有 H / V / LR / RL / TB / BT
    var VERTICAL_LAYOUTS = ['V', 'TB', 'BT'];
    var min = {
        x: Infinity,
        y: Infinity
    };
    var max = {
        x: -Infinity,
        y: -Infinity
    }; // 默认布局是垂直布局TB，此时x对应rad，y对应r
    var rScale = 'x';
    var radScale = 'y';
    if (layout && VERTICAL_LAYOUTS.indexOf(layout) >= 0) {
        // 若是水平布局，y对应rad，x对应r
        radScale = 'x';
        rScale = 'y';
    }
    var count = 0;
    traverseTree(data, function (node) {
        count++;
        if (node.x > max.x) {
            max.x = node.x;
        }
        if (node.x < min.x) {
            min.x = node.x;
        }
        if (node.y > max.y) {
            max.y = node.y;
        }
        if (node.y < min.y) {
            min.y = node.y;
        }
        return true;
    });
    var avgRad = PI * 2 / count;
    var radDiff = max[radScale] - min[radScale];
    if (radDiff === 0) {
        return data;
    }
    traverseTree(data, function (node) {
        var radial = (node[radScale] - min[radScale]) / radDiff * (PI * 2 - avgRad) + avgRad;
        var r = Math.abs(rScale === 'x' ? node.x - data.x : node.y - data.y);
        node.x = r * Math.cos(radial);
        node.y = r * Math.sin(radial);
        return true;
    });
    return data;
};
exports.radialLayout = radialLayout;
