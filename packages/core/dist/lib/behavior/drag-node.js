"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _tslib = require("tslib");
var _deepMix = _interopRequireDefault(require("@antv/util/lib/deep-mix"));
var _global = _interopRequireDefault(require("../global"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
    getDefaultCfg: function getDefaultCfg() {
        return {
            updateEdge: true,
            delegateStyle: {},
            // 是否开启delegate
            enableDelegate: false
        };
    },
    getEvents: function getEvents() {
        return {
            'node:dragstart': 'onDragStart',
            'node:drag': 'onDrag',
            'node:dragend': 'onDragEnd'
        };
    },
    onDragStart: function onDragStart(e) {
        var _this = this;
        if (!this.shouldBegin.call(this, e)) {
            return;
        }
        var item = e.item;
        if (item && item.hasLocked()) {
            return;
        } // 如果拖动的target 是linkPoints / anchorPoints 则不允许拖动
        var target = e.target;
        if (target) {
            var isAnchorPoint = target.get('isAnchorPoint');
            if (isAnchorPoint) {
                return;
            }
        }
        var graph = this.graph;
        this.targets = []; // 获取所有选中的元素
        var nodes = graph.findAllByState('node', 'selected');
        var currentNodeId = item.get('id'); // 当前拖动的节点是否是选中的节点
        var dragNodes = nodes.filter(function (node) {
            var nodeId = node.get('id');
            return currentNodeId === nodeId;
        }); // 只拖动当前节点
        if (dragNodes.length === 0) {
            this.target = item;
        }
        else if (nodes.length > 1) {
            // 拖动多个节点
            nodes.forEach(function (node) {
                var locked = node.hasLocked();
                if (!locked) {
                    _this.targets.push(node);
                }
            });
        }
        else {
            this.targets.push(item);
        }
        this.origin = {
            x: e.x,
            y: e.y
        };
        this.point = {};
        this.originPoint = {};
    },
    onDrag: function onDrag(e) {
        var _this = this;
        if (!this.origin) {
            return;
        }
        if (!this.shouldUpdate(this, e)) {
            return;
        }
        var graph = this.graph; // 当targets中元素时，则说明拖动的是多个选中的元素
        if (this.targets.length > 0) {
            if (this.get('enableDelegate')) {
                this.updateDelegate(e);
            }
            else {
                this.targets.forEach(function (target) {
                    _this.update(target, e, _this.get('enableDelegate'));
                });
            }
        }
        else {
            // 只拖动单个元素
            this.update(this.target, e, this.get('enableDelegate'));
        }
    },
    onDragEnd: function onDragEnd(e) {
        var _this = this;
        if (!this.origin || !this.shouldEnd.call(this, e)) {
            return;
        }
        var graph = this.graph;
        if (this.delegateRect) {
            this.delegateRect.remove();
            this.delegateRect = null;
        }
        if (this.target) {
            var delegateShape = this.target.get('delegateShape');
            if (delegateShape) {
                delegateShape.remove();
                this.target.set('delegateShape', null);
            }
        }
        if (this.targets.length > 0) {
            // 获取所有已经选中的节点
            this.targets.forEach(function (node) {
                return _this.update(node, e);
            });
        }
        else if (this.target) {
            this.update(this.target, e);
        }
        this.point = {};
        this.origin = null;
        this.originPoint = {};
        this.targets.length = 0;
        this.target = null;
    },
    update: function update(item, e, force) {
        var origin = this.origin;
        var model = item.get('model');
        var nodeId = item.get('id');
        if (!this.point[nodeId]) {
            this.point[nodeId] = {
                x: model.x,
                y: model.y
            };
        }
        var x = e.x - origin.x + this.point[nodeId].x;
        var y = e.y - origin.y + this.point[nodeId].y; // 拖动单个未选中元素
        if (force) {
            this.updateDelegate(e, x, y);
            return;
        }
        var pos = {
            x: x,
            y: y
        };
        if (this.get('updateEdge')) {
            this.graph.updateItem(item, pos);
        }
        else {
            item.updatePosition(pos); // this.graph.paint();
        }
    },
    /**
     * 更新拖动元素时的delegate
     * @param {Event} e 事件句柄
     * @param {number} x 拖动单个元素时候的x坐标
     * @param {number} y 拖动单个元素时候的y坐标
     */
    updateDelegate: function updateDelegate(e, x, y) {
        var bbox = e.item.get('keyShape').getBBox();
        if (!this.delegateRect) {
            // 拖动多个
            var parent_1 = this.graph.get('group');
            var attrs = (0, _deepMix.default)({}, _global.default.delegateStyle, this.delegateStyle);
            if (this.targets.length > 0) {
                var _a = this.calculationGroupPosition(), cx = _a.x, cy = _a.y, width = _a.width, height = _a.height, minX = _a.minX, minY = _a.minY;
                this.originPoint = {
                    x: cx,
                    y: cy,
                    width: width,
                    height: height,
                    minX: minX,
                    minY: minY
                }; // model上的x, y是相对于图形中心的，delegateShape是g实例，x,y是绝对坐标
                this.delegateRect = parent_1.addShape('rect', {
                    attrs: (0, _tslib.__assign)({
                        width: width,
                        height: height,
                        x: cx,
                        y: cy
                    }, attrs),
                    name: 'rect-delegate-shape'
                });
            }
            else if (this.target) {
                this.delegateRect = parent_1.addShape('rect', {
                    attrs: (0, _tslib.__assign)({
                        width: bbox.width,
                        height: bbox.height,
                        x: x + bbox.x,
                        y: y + bbox.y
                    }, attrs),
                    name: 'rect-delegate-shape'
                });
            }
            this.delegateRect.set('capture', false);
        }
        else if (this.targets.length > 0) {
            var clientX = e.x - this.origin.x + this.originPoint.minX;
            var clientY = e.y - this.origin.y + this.originPoint.minY;
            this.delegateRect.attr({
                x: clientX,
                y: clientY
            });
        }
        else if (this.target) {
            this.delegateRect.attr({
                x: x + bbox.x,
                y: y + bbox.y
            });
        }
        if (this.target) {
            this.target.set('delegateShape', this.delegateRect);
        } // this.graph.paint();
    },
    /**
     * 计算delegate位置，包括左上角左边及宽度和高度
     * @memberof ItemGroup
     * @return {object} 计算出来的delegate坐标信息及宽高
     */
    calculationGroupPosition: function calculationGroupPosition() {
        var graph = this.graph;
        var nodes = graph.findAllByState('node', 'selected');
        var minx = Infinity;
        var maxx = -Infinity;
        var miny = Infinity;
        var maxy = -Infinity; // 获取已节点的所有最大最小x y值
        for (var i = 0; i < nodes.length; i++) {
            var element = nodes[i];
            var bbox = element.getBBox();
            var minX = bbox.minX, minY = bbox.minY, maxX = bbox.maxX, maxY = bbox.maxY;
            if (minX < minx) {
                minx = minX;
            }
            if (minY < miny) {
                miny = minY;
            }
            if (maxX > maxx) {
                maxx = maxX;
            }
            if (maxY > maxy) {
                maxy = maxY;
            }
        }
        var x = Math.floor(minx);
        var y = Math.floor(miny);
        var width = Math.ceil(maxx) - Math.floor(minx);
        var height = Math.ceil(maxy) - Math.floor(miny);
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            minX: minx,
            minY: miny
        };
    }
};
exports.default = _default;
