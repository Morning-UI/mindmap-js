import {
    NoteFeatures,
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    getModel,
}                                               from '../utils/G6Ext';

export const note: NoteFeatures.Note = (options) => {

    const {
        mindmap,
        nodeIds,
        note : _note,
    } = options;
    const ids = fillNodeIds(nodeIds);

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        model.note = _note;
        // TODO: 启用draw后编辑链接后，appends宽度会改变
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '添加备注',
        undoCmd : {
            cmd : NoteFeatures.Commands.Unnote,
            opts : {
                nodeIds,
            },
        } as Command<NoteFeatures.Commands.Unnote>,
    };

};

export const unnote: NoteFeatures.Unnote = (options) => {

    const {
        mindmap,
        nodeIds,
    } = options;
    const ids = fillNodeIds(nodeIds);
    const undoCmds: Command<NoteFeatures.Commands.Note>[] = [];

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        undoCmds.push({
            cmd : NoteFeatures.Commands.Note,
            opts : {
                nodeIds : id,
                note : model.note,
            },
        });
        model.note = null;
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '删除备注',
        undoCmd : undoCmds,
    };

};
