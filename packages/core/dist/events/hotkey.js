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
    // Undo/Redo Ready
    'backspace mod+backspace': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap
            .commandNewGroup()
            .clearAllSelectedNode()
            .removeNode(mindmap.getAllSelectedNodeIds())
            .commandExecGroup();
        // TODO: 删除后选中最近的节点
    },
    'mod+c': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.copyNodeToClipboard(mindmap.getAllSelectedNodeIds());
    },
    // Undo/Redo Ready
    'mod+x': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap
            .commandNewGroup()
            .clearAllSelectedNode()
            .cutNodeToClipboard(mindmap.getAllSelectedNodeIds())
            .commandExecGroup();
    },
    // Undo/Redo Ready
    'mod+v': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        var clipboardModels = JSON.parse(mindmap.getClipboard());
        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        var pastedIds = mindmap.pasteNodes(mindmap.getAllSelectedNodeIds(), clipboardModels);
        mindmap.selectNode(pastedIds[pastedIds.length - 1]);
        mindmap.commandExecGroup();
    },
    // Undo/Redo Ready
    'mod+/': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.foldToggle(mindmap.getAllSelectedNodeIds());
    },
    // Undo/Redo Ready
    enter: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {
            return;
        }
        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        var insertId = mindmap.insertDownwardNode(mindmap.getSelectedNodeId(), {
            text: '新的节点',
        });
        mindmap.selectNode(insertId);
        mindmap.commandExecGroup();
    },
    // Undo/Redo Ready
    'shift+enter': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {
            return;
        }
        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        var insertId = mindmap.insertUpwardNode(mindmap.getSelectedNodeId(), {
            text: '新的节点',
        });
        mindmap.selectNode(insertId);
        mindmap.commandExecGroup();
    },
    // Undo/Redo Ready
    tab: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        var insertId;
        var ids = mindmap.getAllSelectedNodeIds();
        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            insertId = mindmap.insertSubNode(id, {
                text: '新的节点',
            }, -1);
        }
        mindmap.selectNode(insertId);
        mindmap.commandExecGroup();
    },
    // Undo/Redo Ready
    'mod+enter': function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        var insertId = mindmap.prependParentNode(mindmap.getAllSelectedNodeIds(), {
            text: '新的节点',
        });
        if (insertId !== null) {
            mindmap.selectNode(insertId);
        }
        mindmap.commandExecGroup();
    },
    // Undo/Redo Ready
    ArrowUp: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.selectMoveUp();
    },
    // Undo/Redo Ready
    ArrowDown: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.selectMoveDown();
    },
    // Undo/Redo Ready
    ArrowLeft: function (mindmap) {
        if (!mindmap.hasSelectedNode()) {
            return;
        }
        mindmap.selectMoveBefore();
    },
    // Undo/Redo Ready
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
    // Undo/Redo Ready
    'mod+=': function (mindmap) {
        // eslint-disable-next-line no-magic-numbers
        mindmap.zoom(mindmap.getZoom() * 1.25);
    },
    // Undo/Redo Ready
    'mod+-': function (mindmap) {
        // eslint-disable-next-line no-magic-numbers
        mindmap.zoom(mindmap.getZoom() / 1.25);
    },
    // Undo/Redo Ready
    'mod+0': function (mindmap) {
        mindmap.zoom(1);
    },
    'mod+z': function (mindmap) {
        mindmap.commander.undo();
    },
    'mod+y mod+shift+z': function (mindmap) {
        mindmap.commander.redo();
    },
    esc: function (mindmap) {
        mindmap.hideAllContextMenu();
    },
};
var hotkeyMap = __assign({}, systemHotkeyMap);
export default {
    keydown: function (evt, options) {
        evt.preventDefault();
        for (var key in hotkeyMap) {
            if (isHotkey(key.split(' '), evt) && typeof hotkeyMap[key] === 'function') {
                hotkeyMap[key](options.mindmap);
            }
        }
    },
};
