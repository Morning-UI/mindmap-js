/**
 * @fileOverview random layout
 * @author shiwu.wyy@antfin.com
 */
import { __extends } from "tslib";
import * as d3Force from 'd3-force';
import isArray from '@antv/util/lib/is-array';
import isFunction from '@antv/util/lib/is-function';
import isNumber from '@antv/util/lib/is-number';
import mix from '@antv/util/lib/mix';
import { BaseLayout } from './layout';
import { LAYOUT_MESSAGE } from './worker/layoutConst';
/**
 * 经典力导布局 force-directed
 */
var ForceLayout = 
/** @class */
function (_super) {
    __extends(ForceLayout, _super);
    function ForceLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 向心力作用点 */
        _this.center = [0, 0];
        /** 节点作用力 */
        _this.nodeStrength = null;
        /** 边的作用力, 默认为根据节点的入度出度自适应 */
        _this.edgeStrength = null;
        /** 是否防止节点相互覆盖 */
        _this.preventOverlap = false;
        /** 默认边长度 */
        _this.linkDistance = 50;
        /** 迭代阈值的衰减率 [0, 1]，0.028 对应最大迭代数为 300 */
        _this.alphaDecay = 0.028;
        /** 停止迭代的阈值 */
        _this.alphaMin = 0.001;
        /** 当前阈值 */
        _this.alpha = 0.3;
        /** 防止重叠的力强度 */
        _this.collideStrength = 1;
        /** 是否启用web worker。前提是在web worker里执行布局，否则无效	*/
        _this.workerEnabled = false;
        _this.tick = function () { };
        _this.onLayoutEnd = function () { };
        /** 布局完成回调 */
        _this.onTick = function () { };
        /** 是否正在布局 */
        _this.ticking = undefined;
        return _this;
    }
    ForceLayout.prototype.getDefaultCfg = function () {
        return {
            center: [0, 0],
            nodeStrength: null,
            edgeStrength: null,
            preventOverlap: false,
            nodeSize: undefined,
            nodeSpacing: undefined,
            linkDistance: 50,
            forceSimulation: null,
            alphaDecay: 0.028,
            alphaMin: 0.001,
            alpha: 0.3,
            collideStrength: 1,
            tick: function tick() { },
            onLayoutEnd: function onLayoutEnd() { },
            onTick: function onTick() { },
            // 是否启用web worker。前提是在web worker里执行布局，否则无效
            workerEnabled: false
        };
    };
    /**
     * 初始化
     * @param {object} data 数据
     */
    ForceLayout.prototype.init = function (data) {
        var self = this;
        self.nodes = data.nodes || [];
        var edges = data.edges || [];
        self.edges = edges.map(function (edge) {
            var res = {};
            var expectKeys = ['targetNode', 'sourceNode', 'startPoint', 'endPoint'];
            Object.keys(edge).forEach(function (key) {
                if (!(expectKeys.indexOf(key) > -1)) {
                    res[key] = edge[key];
                }
            });
            return res;
        });
        self.ticking = false;
    };
    /**
     * 执行布局
     */
    ForceLayout.prototype.execute = function () {
        var self = this;
        var nodes = self.nodes;
        var edges = self.edges; // 如果正在布局，忽略布局请求
        if (self.ticking) {
            return;
        }
        var simulation = self.forceSimulation;
        var alphaMin = self.alphaMin;
        var alphaDecay = self.alphaDecay;
        var alpha = self.alpha;
        if (!simulation) {
            try {
                // 定义节点的力
                var nodeForce = d3Force.forceManyBody();
                if (self.nodeStrength) {
                    nodeForce.strength(self.nodeStrength);
                }
                simulation = d3Force.forceSimulation().nodes(nodes).force('center', d3Force.forceCenter(self.center[0], self.center[1])).force('charge', nodeForce).alpha(alpha).alphaDecay(alphaDecay).alphaMin(alphaMin);
                if (self.preventOverlap) {
                    self.overlapProcess(simulation);
                } // 如果有边，定义边的力
                if (edges) {
                    // d3 的 forceLayout 会重新生成边的数据模型，为了避免污染源数据
                    var edgeForce = d3Force.forceLink().id(function (d) {
                        return d.id;
                    }).links(edges);
                    if (self.edgeStrength) {
                        edgeForce.strength(self.edgeStrength);
                    }
                    if (self.linkDistance) {
                        edgeForce.distance(self.linkDistance);
                    }
                    simulation.force('link', edgeForce);
                }
                if (self.workerEnabled && !isInWorker()) {
                    // 如果不是运行在web worker里，不用web worker布局
                    self.workerEnabled = false;
                    console.warn('workerEnabled option is only supported when running in web worker.');
                }
                if (!self.workerEnabled) {
                    simulation.on('tick', function () {
                        self.tick();
                    }).on('end', function () {
                        self.ticking = false;
                        if (self.onLayoutEnd) {
                            self.onLayoutEnd();
                        }
                    });
                    self.ticking = true;
                }
                else {
                    // worker is enabled
                    simulation.stop();
                    var totalTicks = getSimulationTicks(simulation);
                    for (var currentTick = 1; currentTick <= totalTicks; currentTick++) {
                        simulation.tick(); // currentTick starts from 1.
                        postMessage({
                            type: LAYOUT_MESSAGE.TICK,
                            currentTick: currentTick,
                            totalTicks: totalTicks,
                            nodes: nodes
                        }, undefined);
                    }
                    self.ticking = false;
                }
                self.forceSimulation = simulation;
                self.ticking = true;
            }
            catch (e) {
                self.ticking = false;
                console.warn(e);
            }
        }
        else {
            if (self.preventOverlap) {
                self.overlapProcess(simulation);
            }
            simulation.alpha(alpha).restart();
            this.ticking = true;
        }
    };
    /**
     * 防止重叠
     * @param {object} simulation 力模拟模型
     */
    ForceLayout.prototype.overlapProcess = function (simulation) {
        var self = this;
        var nodeSize = self.nodeSize;
        var nodeSpacing = self.nodeSpacing;
        var nodeSizeFunc;
        var nodeSpacingFunc;
        var collideStrength = self.collideStrength;
        if (isNumber(nodeSpacing)) {
            nodeSpacingFunc = function nodeSpacingFunc() {
                return nodeSpacing;
            };
        }
        else if (isFunction(nodeSpacing)) {
            nodeSpacingFunc = nodeSpacing;
        }
        else {
            nodeSpacingFunc = function nodeSpacingFunc() {
                return 0;
            };
        }
        if (!nodeSize) {
            nodeSizeFunc = function nodeSizeFunc(d) {
                if (d.size) {
                    if (isArray(d.size)) {
                        var res = d.size[0] > d.size[1] ? d.size[0] : d.size[1];
                        return res / 2 + nodeSpacingFunc(d);
                    }
                    return d.size / 2 + nodeSpacingFunc(d);
                }
                return 10 + nodeSpacingFunc(d);
            };
        }
        else if (isFunction(nodeSize)) {
            nodeSizeFunc = function nodeSizeFunc(d) {
                var size = nodeSize(d);
                return size + nodeSpacingFunc(d);
            };
        }
        else if (isArray(nodeSize)) {
            var larger = nodeSize[0] > nodeSize[1] ? nodeSize[0] : nodeSize[1];
            var radius_1 = larger / 2;
            nodeSizeFunc = function nodeSizeFunc(d) {
                return radius_1 + nodeSpacingFunc(d);
            };
        }
        else if (isNumber(nodeSize)) {
            var radius_2 = nodeSize / 2;
            nodeSizeFunc = function nodeSizeFunc(d) {
                return radius_2 + nodeSpacingFunc(d);
            };
        }
        else {
            nodeSizeFunc = function nodeSizeFunc() {
                return 10;
            };
        } // forceCollide's parameter is a radius
        simulation.force('collisionForce', d3Force.forceCollide(nodeSizeFunc).strength(collideStrength));
    };
    /**
     * 更新布局配置，但不执行布局
     * @param {object} cfg 需要更新的配置项
     */
    ForceLayout.prototype.updateCfg = function (cfg) {
        var self = this;
        if (self.ticking) {
            self.forceSimulation.stop();
            self.ticking = false;
        }
        self.forceSimulation = null;
        mix(self, cfg);
    };
    ForceLayout.prototype.destroy = function () {
        var self = this;
        if (self.ticking) {
            self.forceSimulation.stop();
            self.ticking = false;
        }
        self.nodes = null;
        self.edges = null;
        self.destroyed = true;
    };
    return ForceLayout;
}(BaseLayout);
export default ForceLayout; // Return total ticks of d3-force simulation
function getSimulationTicks(simulation) {
    var alphaMin = simulation.alphaMin();
    var alphaTarget = simulation.alphaTarget();
    var alpha = simulation.alpha();
    var totalTicksFloat = Math.log((alphaMin - alphaTarget) / (alpha - alphaTarget)) / Math.log(1 - simulation.alphaDecay());
    var totalTicks = Math.ceil(totalTicksFloat);
    return totalTicks;
} // 判断是否运行在web worker里
function isInWorker() {
    // eslint-disable-next-line no-undef
    return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
}
