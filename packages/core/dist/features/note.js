import { NoteFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
export var note = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, _note = options.note;
    var ids = fillNodeIds(nodeIds);
    var oriNote;
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        oriNote = model.note;
        model.note = _note || null;
        // TODO: 启用draw后编辑链接后，appends宽度会改变
        node.draw();
    }
    mindmap.graph.layout();
    mindmap._options.$boxEditNote.querySelector('textarea').value = _note;
    return {
        note: '设置备注',
        undoCmd: {
            cmd: NoteFeatures.Commands.Note,
            opts: {
                nodeIds: nodeIds,
                note: oriNote,
            },
        },
    };
};
