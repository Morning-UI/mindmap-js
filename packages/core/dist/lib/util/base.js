"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isNaN = exports.isViewportChanged = exports.cloneEvent = exports.formatPadding = void 0;
var _isArray = _interopRequireDefault(require("@antv/util/lib/is-array"));
var _isNil = _interopRequireDefault(require("@antv/util/lib/is-nil"));
var _isNumber = _interopRequireDefault(require("@antv/util/lib/is-number"));
var _isString = _interopRequireDefault(require("@antv/util/lib/is-string"));
var _behavior = require("../interface/behavior");
var _lib = require("@antv/matrix-util/lib");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * turn padding into [top, right, bottom, right]
 * @param  {Number|Array} padding input padding
 * @return {array} output
 */
var formatPadding = function formatPadding(padding) {
    var top = 0;
    var left = 0;
    var right = 0;
    var bottom = 0;
    if ((0, _isNumber.default)(padding)) {
        top = left = right = bottom = padding;
    }
    else if ((0, _isString.default)(padding)) {
        var intPadding = parseInt(padding, 10);
        top = left = right = bottom = intPadding;
    }
    else if ((0, _isArray.default)(padding)) {
        top = padding[0];
        right = !(0, _isNil.default)(padding[1]) ? padding[1] : padding[0];
        bottom = !(0, _isNil.default)(padding[2]) ? padding[2] : padding[0];
        left = !(0, _isNil.default)(padding[3]) ? padding[3] : right;
    }
    return [top, right, bottom, left];
};
/**
 * clone event
 * @param e
 */
exports.formatPadding = formatPadding;
var cloneEvent = function cloneEvent(e) {
    var event = new _behavior.G6GraphEvent(e.type, e);
    event.clientX = e.clientX;
    event.clientY = e.clientY;
    event.x = e.x;
    event.y = e.y;
    event.target = e.target;
    event.currentTarget = e.currentTarget;
    event.bubbles = true;
    event.item = e.item;
    return event;
};
/**
 * 判断 viewport 是否改变，通过和单位矩阵对比
 * @param matrix Viewport 的 Matrix
 */
exports.cloneEvent = cloneEvent;
var isViewportChanged = function isViewportChanged(matrix) {
    // matrix 为 null， 则说明没有变化
    if (!matrix) {
        return false;
    }
    var MATRIX_LEN = 9;
    var ORIGIN_MATRIX = _lib.mat3.create();
    for (var i = 0; i < MATRIX_LEN; i++) {
        if (matrix[i] !== ORIGIN_MATRIX[i]) {
            return true;
        }
    }
    return false;
};
exports.isViewportChanged = isViewportChanged;
var isNaN = function isNaN(input) {
    return Number.isNaN(Number(input));
};
exports.isNaN = isNaN;
