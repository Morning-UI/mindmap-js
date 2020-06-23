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
import isHotkey from 'is-hotkey';
var systemHotkeyMap = {
    backspace: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.removeNode(mindmap.getAllSelectedNodeIds());
        // TODO: 删除后选中最近的节点
    },
    'mod+backspace': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.removeNode(mindmap.getAllSelectedNodeIds());
        // TODO: 删除后选中最近的节点
    },
    'mod+c': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.copyNodeToClipboard(mindmap.getAllSelectedNodeIds());
    },
    'mod+x': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.cutNodeToClipboard(mindmap.getAllSelectedNodeIds());
    },
    'mod+v': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.pasteNodes(mindmap.getAllSelectedNodeIds(), JSON.parse(mindmap.getClipboard()));
    },
    'mod+/': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.foldToggle(mindmap.getAllSelectedNodeIds());
    },
    enter: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {
            return;
        }
        var id = mindmap.insertDownwardNode(mindmap.getSelectedNodeId(), {
            text: '新的节点',
        });
        mindmap.clearAllSelectedNode();
        mindmap.selectNode(id);
    },
    'shift+enter': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {
            return;
        }
        var id = mindmap.insertUpwardNode(mindmap.getSelectedNodeId(), {
            text: '新的节点',
        });
        mindmap.clearAllSelectedNode();
        mindmap.selectNode(id);
    },
    tab: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        var ids = mindmap.getAllSelectedNodeIds();
        var newId;
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            newId = mindmap.insertSubNode(id, {
                text: '新的节点',
            }, -1);
        }
        mindmap.clearAllSelectedNode();
        mindmap.selectNode(newId);
    },
    'mod+enter': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        var id = mindmap.prependParentNode(mindmap.getAllSelectedNodeIds(), {
            text: '新的节点',
        });
        if (id !== null) {
            mindmap.clearAllSelectedNode();
            mindmap.selectNode(id);
        }
    },
    ArrowUp: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.selectMoveUp();
    },
    ArrowDown: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.selectMoveDown();
    },
    ArrowLeft: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.selectMoveBefore();
    },
    ArrowRight: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.selectMoveAfter();
    },
    'shift+alt+n': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {
            return;
        }
        mindmap.showEditNote(mindmap.getSelectedNodeId());
    },
    'mod+k': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {
            return;
        }
        mindmap.showEditLink(mindmap.getSelectedNodeId());
    },
    'mod+=': function (mindmap) {
        // eslint-disable-next-line no-magic-numbers
        mindmap.zoom(mindmap.getZoom() * 1.25);
    },
    'mod+-': function (mindmap) {
        // eslint-disable-next-line no-magic-numbers
        mindmap.zoom(mindmap.getZoom() / 1.25);
    },
    'mod+0': function (mindmap) {
        mindmap.zoom(1);
    },
    esc: function (mindmap) {
    },
};
var hotkeyMap = __assign({}, systemHotkeyMap);
export default {
    keydown: function (evt, options) {
        evt.preventDefault();
        for (var key in hotkeyMap) {
            if (isHotkey(key, evt) && typeof hotkeyMap[key] === 'function') {
                hotkeyMap[key](options.mindmap);
            }
        }
    },
};
