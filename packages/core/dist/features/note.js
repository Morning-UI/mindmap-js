import { NoteFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
export var note = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, _note = options.note;
    var ids = fillNodeIds(nodeIds);
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        model.note = _note;
        // TODO: 启用draw后编辑链接后，appends宽度会改变
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '添加备注',
        undoCmd: {
            cmd: NoteFeatures.Commands.Unnote,
            opts: {
                nodeIds: nodeIds,
            },
        },
    };
};
export var unnote = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds;
    var ids = fillNodeIds(nodeIds);
    var undoCmds = [];
    for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
        var id = ids_2[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        undoCmds.push({
            cmd: NoteFeatures.Commands.Note,
            opts: {
                nodeIds: id,
                note: model.note,
            },
        });
        model.note = null;
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '删除备注',
        undoCmd: undoCmds,
    };
};
