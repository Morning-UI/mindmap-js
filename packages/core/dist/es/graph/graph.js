import { __extends } from "tslib";
import EventEmitter from '@antv/event-emitter';
import GCanvas from '@antv/g-canvas/lib/canvas';
import GSVGCanvas from '@antv/g-svg/lib/canvas';
import { mat3 } from '@antv/matrix-util/lib';
import clone from '@antv/util/lib/clone';
import deepMix from '@antv/util/lib/deep-mix';
import each from '@antv/util/lib/each';
import isPlainObject from '@antv/util/lib/is-plain-object';
import isString from '@antv/util/lib/is-string';
import isNumber from '@antv/util/lib/is-number';
import { getAllNodeInGroups } from '../util/group';
import { move, translate } from '../util/math';
import { groupBy } from 'lodash';
import Global from '../global';
import { CustomGroup, EventController, ItemController, LayoutController, ModeController, StateController, ViewController } from './controller';
import createDom from '@antv/dom-util/lib/create-dom';
var NODE = 'node';
var SVG = 'svg';
var CANVAS = 'canvas';
var Graph = 
/** @class */
function (_super) {
    __extends(Graph, _super);
    function Graph(cfg) {
        var _this = _super.call(this) || this;
        _this.cfg = deepMix(_this.getDefaultCfg(), cfg);
        _this.init();
        _this.animating = false;
        _this.destroyed = false;
        return _this;
    }
    Graph.prototype.init = function () {
        this.initCanvas(); // instance controller
        var eventController = new EventController(this);
        var viewController = new ViewController(this);
        var modeController = new ModeController(this);
        var itemController = new ItemController(this);
        var layoutController = new LayoutController(this);
        var stateController = new StateController(this);
        var customGroupControll = new CustomGroup(this);
        this.set({
            eventController: eventController,
            viewController: viewController,
            modeController: modeController,
            itemController: itemController,
            layoutController: layoutController,
            stateController: stateController,
            customGroupControll: customGroupControll
        });
        this.initPlugin();
    };
    Graph.prototype.initCanvas = function () {
        var container = this.get('container');
        if (isString(container)) {
            container = document.getElementById(container);
            this.set('container', container);
        }
        if (!container) {
            throw new Error('invalid container');
        }
        var width = this.get('width');
        var height = this.get('height');
        var renderer = this.get('renderer');
        var canvas;
        if (renderer === SVG) {
            canvas = new GSVGCanvas({
                container: container,
                width: width,
                height: height
            });
        }
        else {
            canvas = new GCanvas({
                container: container,
                width: width,
                height: height
            });
        }
        this.set('canvas', canvas);
        this.initGroups();
    };
    Graph.prototype.initPlugin = function () {
        var self = this;
        each(self.get('plugins'), function (plugin) {
            if (!plugin.destroyed && plugin.initPlugin) {
                plugin.initPlugin(self);
            }
        });
    }; // 初始化所有 Group
    Graph.prototype.initGroups = function () {
        var canvas = this.get('canvas');
        var el = this.get('canvas').get('el');
        var id = el.id;
        var group = canvas.addGroup({
            id: id + "-root",
            className: Global.rootContainerClassName
        });
        if (this.get('groupByTypes')) {
            var edgeGroup = group.addGroup({
                id: id + "-edge",
                className: Global.edgeContainerClassName
            });
            var nodeGroup = group.addGroup({
                id: id + "-node",
                className: Global.nodeContainerClassName
            });
            var delegateGroup = group.addGroup({
                id: id + "-delegate",
                className: Global.delegateContainerClassName
            }); // 用于存储自定义的群组
            var customGroup = group.addGroup({
                id: id + "-group",
                className: Global.customGroupContainerClassName
            });
            customGroup.toBack();
            this.set({
                nodeGroup: nodeGroup,
                edgeGroup: edgeGroup,
                customGroup: customGroup,
                delegateGroup: delegateGroup
            });
        }
        this.set('group', group);
    }; // eslint-disable-next-line class-methods-use-this
    Graph.prototype.getDefaultCfg = function () {
        return {
            /**
             * Container could be dom object or dom id
             */
            container: undefined,
            /**
             * Canvas width
             * unit pixel if undefined force fit width
             */
            width: undefined,
            /**
             * Canvas height
             * unit pixel if undefined force fit height
             */
            height: undefined,
            /**
             * renderer canvas or svg
             * @type {string}
             */
            renderer: 'canvas',
            /**
             * control graph behaviors
             */
            modes: {},
            /**
             * 注册插件
             */
            plugins: [],
            /**
             * source data
             */
            data: {},
            /**
             * Fit view padding (client scale)
             */
            fitViewPadding: 10,
            /**
             * Minimum scale size
             */
            minZoom: 0.2,
            /**
             * Maxmum scale size
             */
            maxZoom: 10,
            /**
             *  capture events
             */
            event: true,
            /**
             * group node & edges into different graphic groups
             */
            groupByTypes: true,
            /**
             * determine if it's a directed graph
             */
            directed: false,
            /**
             * when data or shape changed, should canvas draw automatically
             */
            autoPaint: true,
            /**
             * store all the node instances
             */
            nodes: [],
            /**
             * store all the edge instances
             */
            edges: [],
            /**
             * all the instances indexed by id
             */
            itemMap: {},
            /**
             * 边直接连接到节点的中心，不再考虑锚点
             */
            linkCenter: false,
            /**
             * 默认的节点配置，data 上定义的配置会覆盖这些配置。例如：
             * defaultNode: {
             *  type: 'rect',
             *  size: [60, 40],
             *  style: {
             *    //... 样式配置项
             *  }
             * }
             * 若数据项为 { id: 'node', x: 100, y: 100 }
             * 实际创建的节点模型是 { id: 'node', x: 100, y: 100， type: 'rect', size: [60, 40] }
             * 若数据项为 { id: 'node', x: 100, y: 100, type: 'circle' }
             * 实际创建的节点模型是 { id: 'node', x: 100, y: 100， type: 'circle', size: [60, 40] }
             */
            defaultNode: {},
            /**
             * 默认边配置，data 上定义的配置会覆盖这些配置。用法同 defaultNode
             */
            defaultEdge: {},
            /**
             * 节点默认样式，也可以添加状态样式
             * 例如：
             * const graph = new G6.Graph({
             *  nodeStateStyles: {
             *    selected: { fill: '#ccc', stroke: '#666' },
             *    active: { lineWidth: 2 }
             *  },
             *  ...
             * });
             *
             */
            nodeStateStyles: {},
            /**
             * 边默认样式，用法同nodeStateStyle
             */
            edgeStateStyles: {},
            /**
             * graph 状态
             */
            states: {},
            /**
             * 是否启用全局动画
             */
            animate: false,
            /**
             * 动画设置,仅在 animate 为 true 时有效
             */
            animateCfg: {
                /**
                 * 帧回调函数，用于自定义节点运动路径，为空时线性运动
                 */
                onFrame: undefined,
                /**
                 * 动画时长(ms)
                 */
                duration: 500,
                /**
                 * 指定动画动效
                 */
                easing: 'easeLinear'
            },
            callback: undefined,
            /**
             * group类型
             */
            groupType: 'circle',
            /**
             * group bbox 对象
             * @private
             */
            groupBBoxs: {},
            /**
             * 以groupid分组的节点数据
             * @private
             */
            groupNodes: {},
            /**
             * group 数据
             */
            groups: [],
            /**
             * group样式
             */
            groupStyle: {}
        };
    };
    /**
     * 将值设置到 this.cfg 变量上面
     * @param key 键 或 对象值
     * @param val 值
     */
    Graph.prototype.set = function (key, val) {
        if (isPlainObject(key)) {
            this.cfg = Object.assign({}, this.cfg, key);
        }
        else {
            this.cfg[key] = val;
        }
        return this;
    };
    /**
     * 获取 this.cfg 中的值
     * @param key 键
     */
    Graph.prototype.get = function (key) {
        return this.cfg[key];
    };
    /**
     * 清理元素多个状态
     * @param {string|Item} item 元素id或元素实例
     * @param {string[]} states 状态
     */
    Graph.prototype.clearItemStates = function (item, states) {
        if (isString(item)) {
            item = this.findById(item);
        }
        var itemController = this.get('itemController');
        itemController.clearItemStates(item, states);
        if (!states) {
            states = item.get('states');
        }
        var stateController = this.get('stateController');
        stateController.updateStates(item, states, false);
    };
    /**
     * 设置各个节点样式，以及在各种状态下节点 keyShape 的样式。
     * 若是自定义节点切在各种状态下
     * graph.node(node => {
     *  return {
     *    type: 'rect',
     *    label: node.id,
     *    style: { fill: '#666' },
     *    stateStyles: {
     *       selected: { fill: 'blue' },
     *       custom: { fill: 'green' }
     *     }
     *   }
     * });
     * @param {function} nodeFn 指定每个节点样式
     */
    Graph.prototype.node = function (nodeFn) {
        if (typeof nodeFn === 'function') {
            this.set('nodeMapper', nodeFn);
        }
    };
    /**
     * 设置各个边样式
     * @param {function} edgeFn 指定每个边的样式,用法同 node
     */
    Graph.prototype.edge = function (edgeFn) {
        if (typeof edgeFn === 'function') {
            this.set('edgeMapper', edgeFn);
        }
    };
    /**
     * 根据 ID 查询图元素实例
     * @param id 图元素 ID
     */
    Graph.prototype.findById = function (id) {
        return this.get('itemMap')[id];
    };
    /**
     * 根据对应规则查找单个元素
     * @param {ITEM_TYPE} type 元素类型(node | edge | group)
     * @param {(item: T, index: number) => T} fn 指定规则
     * @return {T} 元素实例
     */
    Graph.prototype.find = function (type, fn) {
        var result;
        var items = this.get(type + "s"); // eslint-disable-next-line consistent-return
        each(items, function (item, i) {
            if (fn(item, i)) {
                result = item;
                return result;
            }
        });
        return result;
    };
    /**
     * 查找所有满足规则的元素
     * @param {string} type 元素类型(node|edge)
     * @param {string} fn 指定规则
     * @return {array} 元素实例
     */
    Graph.prototype.findAll = function (type, fn) {
        var result = [];
        each(this.get(type + "s"), function (item, i) {
            if (fn(item, i)) {
                result.push(item);
            }
        });
        return result;
    };
    /**
     * 查找所有处于指定状态的元素
     * @param {string} type 元素类型(node|edge)
     * @param {string} state 状态
     * @return {object} 元素实例
     */
    Graph.prototype.findAllByState = function (type, state) {
        return this.findAll(type, function (item) {
            return item.hasState(state);
        });
    };
    /**
     * 平移画布
     * @param dx 水平方向位移
     * @param dy 垂直方向位移
     */
    Graph.prototype.translate = function (dx, dy) {
        var group = this.get('group');
        translate(group, {
            x: dx,
            y: dy
        });
        this.emit('viewportchange', {
            action: 'translate',
            matrix: group.getMatrix()
        });
        this.autoPaint();
    };
    /**
     * 平移画布到某点
     * @param {number} x 水平坐标
     * @param {number} y 垂直坐标
     */
    Graph.prototype.moveTo = function (x, y) {
        var group = this.get('group');
        move(group, {
            x: x,
            y: y
        });
        this.emit('viewportchange', {
            action: 'move',
            matrix: group.getMatrix()
        });
    };
    /**
     * 调整视口适应视图
     * @param {object} padding 四周围边距
     */
    Graph.prototype.fitView = function (padding) {
        if (padding) {
            this.set('fitViewPadding', padding);
        }
        var viewController = this.get('viewController');
        viewController.fitView();
        this.autoPaint();
    };
    /**
     * 新增行为
     * @param {string | IModeOption | IModeType[]} behaviors 添加的行为
     * @param {string | string[]} modes 添加到对应的模式
     * @return {Graph} Graph
     */
    Graph.prototype.addBehaviors = function (behaviors, modes) {
        var modeController = this.get('modeController');
        modeController.manipulateBehaviors(behaviors, modes, true);
        return this;
    };
    /**
     * 移除行为
     * @param {string | IModeOption | IModeType[]} behaviors 移除的行为
     * @param {string | string[]} modes 从指定的模式中移除
     * @return {Graph} Graph
     */
    Graph.prototype.removeBehaviors = function (behaviors, modes) {
        var modeController = this.get('modeController');
        modeController.manipulateBehaviors(behaviors, modes, false);
        return this;
    };
    /**
     * 伸缩窗口
     * @param ratio 伸缩比例
     * @param center 以center的x, y坐标为中心缩放
     */
    Graph.prototype.zoom = function (ratio, center) {
        var group = this.get('group');
        var matrix = clone(group.getMatrix());
        var minZoom = this.get('minZoom');
        var maxZoom = this.get('maxZoom');
        if (!matrix) {
            matrix = mat3.create();
        }
        if (center) {
            mat3.translate(matrix, matrix, [-center.x, -center.y]);
            mat3.scale(matrix, matrix, [ratio, ratio]);
            mat3.translate(matrix, matrix, [center.x, center.y]);
        }
        else {
            mat3.scale(matrix, matrix, [ratio, ratio]);
        }
        if (minZoom && matrix[0] < minZoom || maxZoom && matrix[0] > maxZoom) {
            return;
        }
        group.setMatrix(matrix);
        this.emit('viewportchange', {
            action: 'zoom',
            matrix: matrix
        });
        this.autoPaint();
    };
    /**
     * 伸缩视口到一固定比例
     * @param {number} toRatio 伸缩比例
     * @param {Point} center 以center的x, y坐标为中心缩放
     */
    Graph.prototype.zoomTo = function (toRatio, center) {
        var ratio = toRatio / this.getZoom();
        this.zoom(ratio, center);
    };
    /**
     * 将元素移动到视口中心
     * @param {Item} item 指定元素
     */
    Graph.prototype.focusItem = function (item) {
        var viewController = this.get('viewController');
        viewController.focus(item);
        this.autoPaint();
    };
    /**
     * 自动重绘
     * @internal 仅供内部更新机制调用，外部根据需求调用 render 或 paint 接口
     */
    Graph.prototype.autoPaint = function () {
        if (this.get('autoPaint')) {
            this.paint();
        }
    };
    /**
     * 仅画布重新绘制
     */
    Graph.prototype.paint = function () {
        this.emit('beforepaint');
        this.get('canvas').draw();
        this.emit('afterpaint');
    };
    /**
     * 将屏幕坐标转换为视口坐标
     * @param {number} clientX 屏幕x坐标
     * @param {number} clientY 屏幕y坐标
     * @return {Point} 视口坐标
     */
    Graph.prototype.getPointByClient = function (clientX, clientY) {
        var viewController = this.get('viewController');
        return viewController.getPointByClient(clientX, clientY);
    };
    /**
     * 将视口坐标转换为屏幕坐标
     * @param {number} x 视口x坐标
     * @param {number} y 视口y坐标
     * @return {Point} 视口坐标
     */
    Graph.prototype.getClientByPoint = function (x, y) {
        var viewController = this.get('viewController');
        return viewController.getClientByPoint(x, y);
    };
    /**
     * 将画布坐标转换为视口坐标
     * @param {number} canvasX 画布 x 坐标
     * @param {number} canvasY 画布 y 坐标
     * @return {object} 视口坐标
     */
    Graph.prototype.getPointByCanvas = function (canvasX, canvasY) {
        var viewController = this.get('viewController');
        return viewController.getPointByCanvas(canvasX, canvasY);
    };
    /**
     * 将视口坐标转换为画布坐标
     * @param {number} x 视口 x 坐标
     * @param {number} y 视口 y 坐标
     * @return {object} 画布坐标
     */
    Graph.prototype.getCanvasByPoint = function (x, y) {
        var viewController = this.get('viewController');
        return viewController.getCanvasByPoint(x, y);
    };
    /**
     * 显示元素
     * @param {Item} item 指定元素
     */
    Graph.prototype.showItem = function (item) {
        var itemController = this.get('itemController');
        itemController.changeItemVisibility(item, true);
    };
    /**
     * 隐藏元素
     * @param {Item} item 指定元素
     */
    Graph.prototype.hideItem = function (item) {
        var itemController = this.get('itemController');
        itemController.changeItemVisibility(item, false);
    };
    /**
     * 刷新元素
     * @param {string|object} item 元素id或元素实例
     */
    Graph.prototype.refreshItem = function (item) {
        var itemController = this.get('itemController');
        itemController.refreshItem(item);
    };
    /**
     * 设置是否在更新/刷新后自动重绘
     * @param {boolean} auto 自动重绘
     */
    Graph.prototype.setAutoPaint = function (auto) {
        var self = this;
        self.set('autoPaint', auto);
        var canvas = self.get('canvas');
        canvas.set('autoDraw', auto);
    };
    /**
     * 删除元素
     * @param {Item} item 元素id或元素实例
     */
    Graph.prototype.remove = function (item) {
        this.removeItem(item);
    };
    /**
     * 删除元素
     * @param {Item} item 元素id或元素实例
     */
    Graph.prototype.removeItem = function (item) {
        // 如果item是字符串，且查询的节点实例不存在，则认为是删除group
        var nodeItem = null;
        if (isString(item)) {
            nodeItem = this.findById(item);
        }
        if (!nodeItem && isString(item)) {
            var customGroupControll = this.get('customGroupControll');
            customGroupControll.remove(item);
        }
        else {
            var itemController = this.get('itemController');
            itemController.removeItem(item);
        }
    };
    /**
     * 新增元素 或 节点分组
     * @param {string} type 元素类型(node | edge | group)
     * @param {ModelConfig} model 元素数据模型
     * @return {Item} 元素实例
     */
    Graph.prototype.addItem = function (type, model) {
        if (type === 'group') {
            var groupId = model.groupId, nodes = model.nodes, groupType = model.type, zIndex = model.zIndex, title = model.title;
            var groupTitle = title;
            if (isString(title)) {
                groupTitle = {
                    text: title
                };
            }
            return this.get('customGroupControll').create(groupId, nodes, groupType, zIndex, true, groupTitle);
        }
        var itemController = this.get('itemController');
        var item = itemController.addItem(type, model);
        this.autoPaint();
        return item;
    };
    Graph.prototype.add = function (type, model) {
        return this.addItem(type, model);
    };
    /**
     * 更新元素
     * @param {Item} item 元素id或元素实例
     * @param {Partial<NodeConfig> | EdgeConfig} cfg 需要更新的数据
     */
    Graph.prototype.updateItem = function (item, cfg) {
        var itemController = this.get('itemController');
        itemController.updateItem(item, cfg);
    };
    /**
     * 更新元素
     * @param {Item} item 元素id或元素实例
     * @param {Partial<NodeConfig> | EdgeConfig} cfg 需要更新的数据
     */
    Graph.prototype.update = function (item, cfg) {
        this.updateItem(item, cfg);
    };
    /**
     * 设置元素状态
     * @param {Item} item 元素id或元素实例
     * @param {string} state 状态名称
     * @param {string | boolean} value 是否启用状态 或 状态值
     */
    Graph.prototype.setItemState = function (item, state, value) {
        if (isString(item)) {
            item = this.findById(item);
        }
        var itemController = this.get('itemController');
        itemController.setItemState(item, state, value);
        var stateController = this.get('stateController');
        if (isString(value)) {
            stateController.updateState(item, state + ":" + value, true);
        }
        else {
            stateController.updateState(item, state, value);
        }
    };
    /**
     * 设置视图初始化数据
     * @param {GraphData} data 初始化数据
     */
    Graph.prototype.data = function (data) {
        this.set('data', data);
    };
    /**
     * 根据data接口的数据渲染视图
     */
    Graph.prototype.render = function () {
        var self = this;
        var data = this.get('data');
        if (!data) {
            throw new Error('data must be defined first');
        }
        var _a = data.nodes, nodes = _a === void 0 ? [] : _a, _b = data.edges, edges = _b === void 0 ? [] : _b;
        this.clear();
        this.emit('beforerender');
        each(nodes, function (node) {
            self.add('node', node);
        });
        each(edges, function (edge) {
            self.add('edge', edge);
        });
        if (!this.get('groupByTypes')) {
            // 为提升性能，选择数量少的进行操作
            if (data.nodes && data.edges && data.nodes.length < data.edges.length) {
                var nodesArr = this.getNodes(); // 遍历节点实例，将所有节点提前。
                nodesArr.forEach(function (node) {
                    node.toFront();
                });
            }
            else {
                var edgesArr = this.getEdges(); // 遍历节点实例，将所有节点提前。
                edgesArr.forEach(function (edge) {
                    edge.toBack();
                });
            }
        } // layout
        var animate = self.get('animate');
        self.set('animate', false);
        var layoutController = self.get('layoutController');
        if (!layoutController.layout(success)) {
            success();
        }
        function success() {
            self.set('animate', animate);
            if (self.get('fitView')) {
                self.fitView();
            }
            self.autoPaint();
            self.emit('afterrender');
        } // 防止传入的数据不存在nodes
        if (data.nodes) {
            // 获取所有有groupID的node
            var nodeInGroup = data.nodes.filter(function (node) {
                return node.groupId;
            }); // 所有node中存在groupID，则说明需要群组
            if (nodeInGroup.length > 0) {
                // 渲染群组
                var groupType = self.get('groupType');
                this.renderCustomGroup(data, groupType);
            }
        }
    };
    /**
     * 接收数据进行渲染
     * @Param {Object} data 初始化数据
     */
    Graph.prototype.read = function (data) {
        this.data(data);
        this.render();
    }; // 比较item
    Graph.prototype.diffItems = function (type, items, models) {
        var self = this;
        var item;
        var itemMap = this.get('itemMap');
        each(models, function (model) {
            item = itemMap[model.id];
            if (item) {
                if (self.get('animate') && type === NODE) {
                    var containerMatrix = item.getContainer().getMatrix();
                    if (!containerMatrix)
                        containerMatrix = mat3.create();
                    item.set('originAttrs', {
                        x: containerMatrix[6],
                        y: containerMatrix[7]
                    });
                }
                self.updateItem(item, model);
            }
            else {
                item = self.addItem(type, model);
            }
            items[type + "s"].push(item);
        });
    };
    /**
     * 更改源数据，根据新数据重新渲染视图
     * @param {object} data 源数据
     * @return {object} this
     */
    Graph.prototype.changeData = function (data) {
        var self = this;
        if (!data) {
            return this;
        } // 更改数据源后，取消所有状态
        this.getNodes().map(function (node) {
            return self.clearItemStates(node);
        });
        this.getEdges().map(function (edge) {
            return self.clearItemStates(edge);
        });
        var canvas = this.get('canvas');
        var localRefresh = canvas.get('localRefresh');
        canvas.set('localRefresh', false);
        if (!self.get('data')) {
            self.data(data);
            self.render();
        }
        var itemMap = this.get('itemMap');
        var items = {
            nodes: [],
            edges: []
        };
        this.diffItems('node', items, data.nodes);
        this.diffItems('edge', items, data.edges);
        each(itemMap, function (item, id) {
            if (items.nodes.indexOf(item) < 0 && items.edges.indexOf(item) < 0) {
                delete itemMap[id];
                self.remove(item);
            }
        });
        this.set({
            nodes: items.nodes,
            edges: items.edges
        });
        var layoutController = this.get('layoutController');
        layoutController.changeData();
        if (self.get('animate') && !layoutController.getLayoutType()) {
            // 如果没有指定布局
            self.positionsAnimate();
        }
        else {
            self.autoPaint();
        }
        setTimeout(function () {
            canvas.set('localRefresh', localRefresh);
        }, 16);
        return this;
    };
    /**
     * 根据数据渲染群组
     * @param {GraphData} data 渲染图的数据
     * @param {string} groupType group类型
     */
    Graph.prototype.renderCustomGroup = function (data, groupType) {
        var _this = this;
        var groups = data.groups, _a = data.nodes, nodes = _a === void 0 ? [] : _a; // 第一种情况，，不存在groups，则不存在嵌套群组
        var groupIndex = 10;
        if (!groups) {
            // 存在单个群组
            // 获取所有有groupID的node
            var nodeInGroup = nodes.filter(function (node) {
                return node.groupId;
            });
            var groupsArr_1 = []; // 根据groupID分组
            var groupIds_1 = groupBy(nodeInGroup, 'groupId'); // tslint:disable-next-line:forin
            Object.keys(groupIds_1).forEach(function (groupId) {
                var nodeIds = groupIds_1[groupId].map(function (node) {
                    return node.id;
                });
                _this.get('customGroupControll').create(groupId, nodeIds, groupType, groupIndex);
                groupIndex--; // 获取所有不重复的 groupId
                if (!groupsArr_1.find(function (d) {
                    return d.id === groupId;
                })) {
                    groupsArr_1.push({
                        id: groupId
                    });
                }
            });
            this.set({
                groups: groupsArr_1
            });
        }
        else {
            // 将groups的数据存到groups中
            this.set({
                groups: groups
            }); // 第二种情况，存在嵌套的群组，数据中有groups字段
            var groupNodes_1 = getAllNodeInGroups(data); // tslint:disable-next-line:forin
            Object.keys(groupNodes_1).forEach(function (groupId) {
                var tmpNodes = groupNodes_1[groupId];
                _this.get('customGroupControll').create(groupId, tmpNodes, groupType, groupIndex);
                groupIndex--;
            }); // 对所有Group排序
            var customGroup = this.get('customGroup');
            customGroup.sort();
        }
    };
    /**
     * 导出图数据
     * @return {object} data
     */
    Graph.prototype.save = function () {
        var nodes = [];
        var edges = [];
        each(this.get('nodes'), function (node) {
            nodes.push(node.getModel());
        });
        each(this.get('edges'), function (edge) {
            edges.push(edge.getModel());
        });
        return {
            nodes: nodes,
            edges: edges,
            groups: this.get('groups')
        };
    };
    /**
     * 改变画布大小
     * @param  {number} width  画布宽度
     * @param  {number} height 画布高度
     * @return {object} this
     */
    Graph.prototype.changeSize = function (width, height) {
        var viewController = this.get('viewController');
        viewController.changeSize(width, height);
        return this;
    };
    /**
     * 当源数据在外部发生变更时，根据新数据刷新视图。但是不刷新节点位置
     */
    Graph.prototype.refresh = function () {
        var self = this;
        self.emit('beforegraphrefresh');
        if (self.get('animate')) {
            self.positionsAnimate();
        }
        else {
            var nodes = self.get('nodes');
            var edges = self.get('edges');
            each(nodes, function (node) {
                node.refresh();
            });
            each(edges, function (edge) {
                edge.refresh();
            });
        }
        self.emit('aftergraphrefresh');
        self.autoPaint();
    };
    /**
     * 获取当前图中所有节点的item实例
     * @return {INode} item数组
     */
    Graph.prototype.getNodes = function () {
        return this.get('nodes');
    };
    /**
     * 获取当前图中所有边的item实例
     * @return {IEdge} item数组
     */
    Graph.prototype.getEdges = function () {
        return this.get('edges');
    };
    /**
     * 根据 graph 上的 animateCfg 进行视图中节点位置动画接口
     */
    Graph.prototype.positionsAnimate = function () {
        var self = this;
        self.emit('beforeanimate');
        var animateCfg = self.get('animateCfg');
        var onFrame = animateCfg.onFrame;
        var nodes = self.getNodes();
        var toNodes = nodes.map(function (node) {
            var model = node.getModel();
            return {
                id: model.id,
                x: model.x,
                y: model.y
            };
        });
        if (self.isAnimating()) {
            self.stopAnimate();
        }
        var canvas = self.get('canvas');
        canvas.animate(function (ratio) {
            each(toNodes, function (data) {
                var node = self.findById(data.id);
                if (!node || node.destroyed) {
                    return;
                }
                var originAttrs = node.get('originAttrs');
                var model = node.get('model');
                if (!originAttrs) {
                    var containerMatrix = node.getContainer().getMatrix();
                    if (!containerMatrix)
                        containerMatrix = mat3.create();
                    originAttrs = {
                        x: containerMatrix[6],
                        y: containerMatrix[7]
                    };
                    node.set('originAttrs', originAttrs);
                }
                if (onFrame) {
                    var attrs = onFrame(node, ratio, data, originAttrs);
                    node.set('model', Object.assign(model, attrs));
                }
                else {
                    model.x = originAttrs.x + (data.x - originAttrs.x) * ratio;
                    model.y = originAttrs.y + (data.y - originAttrs.y) * ratio;
                }
            });
            self.refreshPositions();
        }, {
            duration: animateCfg.duration,
            easing: animateCfg.easing,
            callback: function callback() {
                each(nodes, function (node) {
                    node.set('originAttrs', null);
                });
                if (animateCfg.callback) {
                    animateCfg.callback();
                }
                self.emit('afteranimate');
                self.animating = false;
            }
        });
    };
    /**
     * 当节点位置在外部发生改变时，刷新所有节点位置，重计算边
     */
    Graph.prototype.refreshPositions = function () {
        var self = this;
        self.emit('beforegraphrefreshposition');
        var nodes = self.get('nodes');
        var edges = self.get('edges');
        var model;
        var updatedNodes = {};
        each(nodes, function (node) {
            model = node.getModel();
            var originAttrs = node.get('originAttrs');
            if (originAttrs && model.x === originAttrs.x && model.y === originAttrs.y) {
                return;
            }
            node.updatePosition({
                x: model.x,
                y: model.y
            });
            updatedNodes[model.id] = true;
        });
        each(edges, function (edge) {
            var sourceModel = edge.getSource().getModel();
            var targetModel = edge.getTarget().getModel();
            if (updatedNodes[sourceModel.id] || updatedNodes[targetModel.id]) {
                edge.refresh();
            }
        });
        self.emit('aftergraphrefreshposition');
        self.autoPaint();
    };
    Graph.prototype.stopAnimate = function () {
        this.get('canvas').stopAnimate();
    };
    Graph.prototype.isAnimating = function () {
        return this.animating;
    };
    /**
     * 获取当前视口伸缩比例
     * @return {number} 比例
     */
    Graph.prototype.getZoom = function () {
        var matrix = this.get('group').getMatrix();
        return matrix ? matrix[0] : 1;
    };
    /**
     * 获取当前的行为模式
     * @return {string} 当前行为模式
     */
    Graph.prototype.getCurrentMode = function () {
        var modeController = this.get('modeController');
        return modeController.getMode();
    };
    /**
     * 切换行为模式
     * @param {string} mode 指定模式
     * @return {object} this
     */
    Graph.prototype.setMode = function (mode) {
        var modeController = this.get('modeController');
        modeController.setMode(mode);
        return this;
    };
    /**
     * 清除画布元素
     * @return {object} this
     */
    Graph.prototype.clear = function () {
        var canvas = this.get('canvas');
        canvas.clear();
        this.initGroups(); // 清空画布时同时清除数据
        this.set({
            itemMap: {},
            nodes: [],
            edges: [],
            groups: []
        });
        return this;
    };
    /**
     * 返回图表的 dataUrl 用于生成图片
     * @return {string} 图片 dataURL
     */
    Graph.prototype.toDataURL = function (type, backgroundColor) {
        var canvas = this.get('canvas');
        var renderer = canvas.getRenderer();
        var canvasDom = canvas.get('el');
        if (!type)
            type = 'image/png';
        var dataURL = '';
        if (renderer === 'svg') {
            var clone_1 = canvasDom.cloneNode(true);
            var svgDocType = document.implementation.createDocumentType('svg', '-//W3C//DTD SVG 1.1//EN', 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd');
            var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
            svgDoc.replaceChild(clone_1, svgDoc.documentElement);
            var svgData = new XMLSerializer().serializeToString(svgDoc);
            dataURL = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgData);
        }
        else {
            var imageData = void 0;
            var context = canvasDom.getContext('2d');
            var width = this.get('width');
            var height = this.get('height');
            var compositeOperation = void 0;
            if (backgroundColor) {
                var pixelRatio = window.devicePixelRatio;
                imageData = context.getImageData(0, 0, width * pixelRatio, height * pixelRatio);
                compositeOperation = context.globalCompositeOperation;
                context.globalCompositeOperation = "destination-over";
                context.fillStyle = backgroundColor;
                context.fillRect(0, 0, width, height);
            }
            dataURL = canvasDom.toDataURL(type);
            if (backgroundColor) {
                context.clearRect(0, 0, width, height);
                context.putImageData(imageData, 0, 0);
                context.globalCompositeOperation = compositeOperation;
            }
        }
        return dataURL;
    };
    /**
     * 导出包含全图的图片
     * @param {String} name 图片的名称
     */
    Graph.prototype.downloadFullImage = function (name, imageConfig) {
        var _this = this;
        var bbox = this.get('group').getCanvasBBox();
        var height = bbox.height;
        var width = bbox.width;
        var renderer = this.get('renderer');
        var vContainerDOM = createDom('<div id="test"></div>');
        var backgroundColor = imageConfig ? imageConfig.backgroundColor : undefined;
        var padding = imageConfig ? imageConfig.padding : undefined;
        if (!padding)
            padding = [0, 0, 0, 0];
        else if (isNumber(padding))
            padding = [padding, padding, padding, padding];
        var vHeight = height + padding[0] + padding[2];
        var vWidth = width + padding[1] + padding[3];
        var canvasOptions = {
            container: vContainerDOM,
            height: vHeight,
            width: vWidth
        };
        var vCanvas = renderer === 'svg' ? new GSVGCanvas(canvasOptions) : new GCanvas(canvasOptions);
        var group = this.get('group');
        var vGroup = group.clone();
        var matrix = vGroup.getMatrix();
        if (!matrix)
            matrix = mat3.create();
        var centerX = (bbox.maxX + bbox.minX) / 2;
        var centerY = (bbox.maxY + bbox.minY) / 2;
        mat3.translate(matrix, matrix, [-centerX, -centerY]);
        mat3.translate(matrix, matrix, [width / 2 + padding[3], height / 2 + padding[0]]);
        vGroup.resetMatrix();
        vGroup.setMatrix(matrix);
        vCanvas.add(vGroup);
        var vCanvasEl = vCanvas.get('el');
        setTimeout(function () {
            var type = 'image/png';
            var dataURL = '';
            if (renderer === 'svg') {
                var clone_2 = vCanvasEl.cloneNode(true);
                var svgDocType = document.implementation.createDocumentType('svg', '-//W3C//DTD SVG 1.1//EN', 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd');
                var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
                svgDoc.replaceChild(clone_2, svgDoc.documentElement);
                var svgData = new XMLSerializer().serializeToString(svgDoc);
                dataURL = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgData);
            }
            else {
                var imageData = void 0;
                var context = vCanvasEl.getContext('2d');
                var compositeOperation = void 0;
                if (backgroundColor) {
                    var pixelRatio = window.devicePixelRatio;
                    imageData = context.getImageData(0, 0, vWidth * pixelRatio, vHeight * pixelRatio);
                    compositeOperation = context.globalCompositeOperation;
                    context.globalCompositeOperation = "destination-over";
                    context.fillStyle = backgroundColor;
                    context.fillRect(0, 0, vWidth, vHeight);
                }
                dataURL = vCanvasEl.toDataURL(type);
                if (backgroundColor) {
                    context.clearRect(0, 0, vWidth, vHeight);
                    context.putImageData(imageData, 0, 0);
                    context.globalCompositeOperation = compositeOperation;
                }
            }
            var link = document.createElement('a');
            var fileName = (name || 'graph') + (renderer === 'svg' ? '.svg' : '.png');
            _this.dataURLToImage(dataURL, renderer, link, fileName);
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', false, false);
            link.dispatchEvent(e);
        }, 16);
    };
    /**
     * 画布导出图片，图片仅包含画布可见区域部分内容
     * @param {String} name 图片的名称
     */
    Graph.prototype.downloadImage = function (name, backgroundColor) {
        var _this = this;
        var self = this;
        if (self.isAnimating()) {
            self.stopAnimate();
        }
        var canvas = self.get('canvas');
        var renderer = canvas.getRenderer();
        var fileName = (name || 'graph') + (renderer === 'svg' ? '.svg' : '.png');
        var link = document.createElement('a');
        setTimeout(function () {
            var dataURL = self.toDataURL('image/png', backgroundColor);
            _this.dataURLToImage(dataURL, renderer, link, fileName);
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', false, false);
            link.dispatchEvent(e);
        }, 16);
    };
    Graph.prototype.dataURLToImage = function (dataURL, renderer, link, fileName) {
        if (typeof window !== 'undefined') {
            if (window.Blob && window.URL && renderer !== 'svg') {
                var arr = dataURL.split(',');
                var mime = '';
                if (arr && arr.length > 0) {
                    var match = arr[0].match(/:(.*?);/); // eslint-disable-next-line prefer-destructuring
                    if (match && match.length >= 2)
                        mime = match[1];
                }
                var bstr = atob(arr[1]);
                var n = bstr.length;
                var u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                var blobObj_1 = new Blob([u8arr], {
                    type: mime
                });
                if (window.navigator.msSaveBlob) {
                    window.navigator.msSaveBlob(blobObj_1, fileName);
                }
                else {
                    link.addEventListener('click', function () {
                        link.download = fileName;
                        link.href = window.URL.createObjectURL(blobObj_1);
                    });
                }
            }
            else {
                link.addEventListener('click', function () {
                    link.download = fileName;
                    link.href = dataURL;
                });
            }
        }
    };
    /**
     * 更换布局配置项
     * @param {object} cfg 新布局配置项
     * 若 cfg 含有 type 字段或为 String 类型，且与现有布局方法不同，则更换布局
     * 若 cfg 不包括 type ，则保持原有布局方法，仅更新布局配置项
     */
    Graph.prototype.updateLayout = function (cfg) {
        var layoutController = this.get('layoutController');
        var newLayoutType;
        if (isString(cfg)) {
            newLayoutType = cfg;
            cfg = {
                type: newLayoutType
            };
        }
        else {
            newLayoutType = cfg.type;
        }
        var oriLayoutCfg = this.get('layout');
        var oriLayoutType = oriLayoutCfg ? oriLayoutCfg.type : undefined;
        if (!newLayoutType || oriLayoutType === newLayoutType) {
            // no type or same type, update layout
            var layoutCfg = {};
            Object.assign(layoutCfg, oriLayoutCfg, cfg);
            layoutCfg.type = oriLayoutType || 'random';
            this.set('layout', layoutCfg);
            layoutController.updateLayoutCfg(layoutCfg);
        }
        else {
            // has different type, change layout
            this.set('layout', cfg);
            layoutController.changeLayout(newLayoutType);
        }
    };
    /**
     * 重新以当前示例中配置的属性进行一次布局
     */
    Graph.prototype.layout = function () {
        var layoutController = this.get('layoutController');
        var layoutCfg = this.get('layout');
        if (layoutCfg.workerEnabled) {
            // 如果使用web worker布局
            layoutController.layout();
            return;
        }
        if (layoutController.layoutMethod) {
            layoutController.relayout();
        }
        else {
            layoutController.layout();
        }
    };
    /**
     * 收起分组
     * @param {string} groupId 分组ID
     */
    Graph.prototype.collapseGroup = function (groupId) {
        var customGroupControll = this.get('customGroupControll');
        customGroupControll.collapseGroup(groupId);
    };
    /**
     * 展开分组
     * @param {string} groupId 分组ID
     */
    Graph.prototype.expandGroup = function (groupId) {
        var customGroupControll = this.get('customGroupControll');
        customGroupControll.expandGroup(groupId);
    };
    /**
     * 添加插件
     * @param {object} plugin 插件实例
     */
    Graph.prototype.addPlugin = function (plugin) {
        var self = this;
        if (plugin.destroyed) {
            return;
        }
        self.get('plugins').push(plugin);
        plugin.initPlugin(self);
    };
    /**
     * 添加插件
     * @param {object} plugin 插件实例
     */
    Graph.prototype.removePlugin = function (plugin) {
        var plugins = this.get('plugins');
        var index = plugins.indexOf(plugin);
        if (index >= 0) {
            plugin.destroyPlugin();
            plugins.splice(index, 1);
        }
    };
    /**
     * 销毁画布
     */
    Graph.prototype.destroy = function () {
        this.clear();
        each(this.get('plugins'), function (plugin) {
            plugin.destroyPlugin();
        });
        this.get('eventController').destroy();
        this.get('itemController').destroy();
        this.get('modeController').destroy();
        this.get('viewController').destroy();
        this.get('stateController').destroy();
        this.get('layoutController').destroy();
        this.get('customGroupControll').destroy();
        this.get('canvas').destroy();
        this.cfg = null;
        this.destroyed = true;
    };
    return Graph;
}(EventEmitter);
export default Graph;
