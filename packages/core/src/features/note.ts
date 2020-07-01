import {
    NoteFeatures,
    Command,
    ContextMenuTypes,
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

    let oriNote: string;

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        oriNote = model.note;
        model.note = _note || null;
        // TODO: 启用draw后编辑链接后，appends宽度会改变
        node.draw();

    }

    mindmap.graph.layout();
    mindmap._options.$boxEditNote.querySelector('textarea').value = _note;

    return {
        note : '设置备注',
        undoCmd : {
            cmd : NoteFeatures.Commands.Note,
            opts : {
                nodeIds,
                note : oriNote,
            },
        } as Command<NoteFeatures.Commands.Note>,
    };

};
