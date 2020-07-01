import isHotkey                                 from 'is-hotkey';
import {
    EventOptions,
    HotkeyMap,
    NodeId,
    MindmapNodeItems,
}                                               from '../interface';

const systemHotkeyMap: HotkeyMap = {
    // Undo/Redo Ready
    'backspace mod+backspace' : (mindmap) => {

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
    'mod+c' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.copyNodeToClipboard(mindmap.getAllSelectedNodeIds());

    },
    // Undo/Redo Ready
    'mod+x' : (mindmap) => {

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
    'mod+v' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        const clipboardModels = JSON.parse(mindmap.getClipboard()) as MindmapNodeItems;

        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        const pastedIds = mindmap.pasteNodes(mindmap.getAllSelectedNodeIds(), clipboardModels);
        mindmap.selectNode(pastedIds[pastedIds.length - 1]);
        mindmap.commandExecGroup();

    },
    // Undo/Redo Ready
    'mod+/' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.foldToggle(mindmap.getAllSelectedNodeIds());

    },
    // Undo/Redo Ready
    enter : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {

            return;

        }

        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        const insertId = mindmap.insertDownwardNode(mindmap.getSelectedNodeId(), {
            text : '新的节点',
        });
        mindmap.selectNode(insertId);
        mindmap.commandExecGroup();

    },
    // Undo/Redo Ready
    'shift+enter' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {

            return;

        }

        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        const insertId = mindmap.insertUpwardNode(mindmap.getSelectedNodeId(), {
            text : '新的节点',
        });
        mindmap.selectNode(insertId);
        mindmap.commandExecGroup();

    },
    // Undo/Redo Ready
    tab : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        let insertId: NodeId;

        const ids = mindmap.getAllSelectedNodeIds();

        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();
        for (const id of ids) {

            insertId = mindmap.insertSubNode(id, {
                text : '新的节点',
            }, -1) as NodeId;

        }

        mindmap.selectNode(insertId);
        mindmap.commandExecGroup();

    },
    // Undo/Redo Ready
    'mod+enter' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.commandNewGroup();
        mindmap.clearAllSelectedNode();

        const insertId = mindmap.prependParentNode(mindmap.getAllSelectedNodeIds(), {
            text : '新的节点',
        });

        if (insertId !== null) {

            mindmap.selectNode(insertId);

        }

        mindmap.commandExecGroup();

    },
    // Undo/Redo Ready
    ArrowUp : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.selectMoveUp();

    },
    // Undo/Redo Ready
    ArrowDown : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.selectMoveDown();

    },
    // Undo/Redo Ready
    ArrowLeft : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.selectMoveBefore();

    },
    // Undo/Redo Ready
    ArrowRight : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.selectMoveAfter();

    },
    'shift+alt+n' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {

            return;

        }

        mindmap.showEditNote(mindmap.getSelectedNodeId());

    },
    'mod+k' : (mindmap) => {

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
    'mod+=' : (mindmap) => {

        // eslint-disable-next-line no-magic-numbers
        mindmap.zoom(mindmap.getZoom() * 1.25);

    },
    // Undo/Redo Ready
    'mod+-' : (mindmap) => {

        // eslint-disable-next-line no-magic-numbers
        mindmap.zoom(mindmap.getZoom() / 1.25);

    },
    // Undo/Redo Ready
    'mod+0' : (mindmap) => {

        mindmap.zoom(1);

    },
    'mod+z' : (mindmap) => {

        mindmap.commander.undo();

    },
    'mod+y mod+shift+z' : (mindmap) => {

        mindmap.commander.redo();

    },
    esc : (mindmap) => {

        mindmap.hideContextMenu();

    },
};

const hotkeyMap = {
    ...systemHotkeyMap,
};

export default {
    keydown : (evt: KeyboardEvent, options: EventOptions): void => {

        if (options.mindmap.focus === false) {

            return;

        }

        console.log(evt);
        evt.preventDefault();

        for (const key in hotkeyMap) {

            if (isHotkey(key.split(' '), evt) && typeof hotkeyMap[key] === 'function') {

                hotkeyMap[key](options.mindmap);

            }

        }

    },
};
