import each from '@antv/util/lib/each';
var DEFAULT_TRIGGER = 'shift';
var ALLOW_EVENTS = ['shift', 'ctrl', 'alt', 'control'];
export default {
    getDefaultCfg: function getDefaultCfg() {
        return {
            multiple: true,
            trigger: DEFAULT_TRIGGER
        };
    },
    getEvents: function getEvents() {
        var self = this; // 检测输入是否合法
        if (!(ALLOW_EVENTS.indexOf(self.trigger.toLowerCase()) > -1)) {
            self.trigger = DEFAULT_TRIGGER; // eslint-disable-next-line no-console
            console.warn("Behavior brush-select 的 trigger 参数不合法，请输入 'drag'、'shift'、'ctrl' 或 'alt'");
        }
        if (!self.multiple) {
            return {
                'node:click': 'onClick',
                'canvas:click': 'onCanvasClick'
            };
        }
        return {
            'node:click': 'onClick',
            'canvas:click': 'onCanvasClick',
            keyup: 'onKeyUp',
            keydown: 'onKeyDown'
        };
    },
    onClick: function onClick(e) {
        var item = e.item;
        var _a = this, graph = _a.graph, keydown = _a.keydown, multiple = _a.multiple, shouldUpdate = _a.shouldUpdate; // allow to select multiple nodes but did not press a key || do not allow the select multiple nodes
        if (!keydown || !multiple) {
            var selected = graph.findAllByState('node', 'selected');
            each(selected, function (node) {
                if (node !== item) {
                    graph.setItemState(node, 'selected', false);
                }
            });
        }
        if (item.hasState('selected')) {
            if (shouldUpdate.call(this, e)) {
                graph.setItemState(item, 'selected', false);
            }
            var selectedNodes = graph.findAllByState('node', 'selected');
            graph.emit('nodeselectchange', {
                target: item,
                selectedItems: {
                    nodes: selectedNodes
                },
                select: false
            });
        }
        else {
            if (shouldUpdate.call(this, e)) {
                graph.setItemState(item, 'selected', true);
            }
            var selectedNodes = graph.findAllByState('node', 'selected');
            graph.emit('nodeselectchange', {
                target: item,
                selectedItems: {
                    nodes: selectedNodes
                },
                select: true
            });
        }
    },
    onCanvasClick: function onCanvasClick() {
        var graph = this.graph;
        var selected = graph.findAllByState('node', 'selected');
        each(selected, function (node) {
            graph.setItemState(node, 'selected', false);
        });
        graph.emit('nodeselectchange', {
            selectedItems: {
                nodes: [],
                edges: []
            },
            select: false
        });
    },
    onKeyDown: function onKeyDown(e) {
        var code = e.key;
        if (!code) {
            return;
        }
        if (code.toLowerCase() === this.trigger.toLowerCase() || code.toLowerCase() === 'control') {
            this.keydown = true;
        }
        else {
            this.keydown = false;
        }
    },
    onKeyUp: function onKeyUp() {
        this.keydown = false;
    }
};
