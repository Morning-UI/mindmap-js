import isHotkey                                 from 'is-hotkey';
import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    EventOptions,
    Command,
    FoldFeatures,
    CommandOptions,
    MindmapCoreType,
    HotkeyMap,
    NodeIds,
    NodeId,
}                                               from '../interface';
import {
    inNodeShape,
}                                               from '../base/utils';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';
import {
    getModel,
}                                               from '../utils/G6Ext';

const systemHotkeyMap: HotkeyMap = {
    backspace : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.removeNode(mindmap.getAllSelectedNodeIds());

        // TODO: 删除后选中最近的节点

    },
    'mod+backspace' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.removeNode(mindmap.getAllSelectedNodeIds());

        // TODO: 删除后选中最近的节点

    },
    'mod+c' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.copyNodeToClipboard(mindmap.getAllSelectedNodeIds());

    },
    'mod+x' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.cutNodeToClipboard(mindmap.getAllSelectedNodeIds());

    },
    'mod+v' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.pasteNodes(mindmap.getAllSelectedNodeIds(), JSON.parse(mindmap.getClipboard()));

    },
    'mod+/' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.foldToggle(mindmap.getAllSelectedNodeIds());

    },
    enter : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {

            return;

        }

        const id = mindmap.insertDownwardNode(mindmap.getSelectedNodeId(), {
            text : '新的节点',
        });

        mindmap.clearAllSelectedNode();
        mindmap.selectNode(id);

    },
    'shift+enter' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        // 选中多节点不支持
        if (mindmap.getAllSelectedNodeIds().length > 1) {

            return;

        }

        const id = mindmap.insertUpwardNode(mindmap.getSelectedNodeId(), {
            text : '新的节点',
        });

        mindmap.clearAllSelectedNode();
        mindmap.selectNode(id);

    },
    tab : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        const ids = mindmap.getAllSelectedNodeIds();

        let newId: NodeId;

        for (const id of ids) {

            newId = mindmap.insertSubNode(id, {
                text : '新的节点',
            }, -1) as NodeId;

        }

        mindmap.clearAllSelectedNode();
        mindmap.selectNode(newId);

    },
    'mod+enter' : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        const id = mindmap.prependParentNode(mindmap.getAllSelectedNodeIds(), {
            text : '新的节点',
        });

        if (id !== null) {

            mindmap.clearAllSelectedNode();
            mindmap.selectNode(id);

        }

    },
    ArrowUp : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.selectMoveUp();

    },
    ArrowDown : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.selectMoveDown();

    },
    ArrowLeft : (mindmap) => {

        if (!mindmap.hasSelectedNode()) {

            return;

        }

        mindmap.selectMoveBefore();

    },
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
    'mod+=' : (mindmap) => {

        // eslint-disable-next-line no-magic-numbers
        mindmap.zoom(mindmap.getZoom() * 1.25);

    },
    'mod+-' : (mindmap) => {

        // eslint-disable-next-line no-magic-numbers
        mindmap.zoom(mindmap.getZoom() / 1.25);

    },
    'mod+0' : (mindmap) => {

        mindmap.zoom(1);

    },
    esc : (mindmap) => {

    },
};

const hotkeyMap = {
    ...systemHotkeyMap,
};

export default {
    keydown : (evt: KeyboardEvent, options: EventOptions): void => {

      

        evt.preventDefault();

        for (const key in hotkeyMap) {

            if (isHotkey(key, evt) && typeof hotkeyMap[key] === 'function') {

                hotkeyMap[key](options.mindmap);

            }

        }


    },
};
