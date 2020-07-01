import difference from 'lodash.difference';
import { TagFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
export var tagAll = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, tags = options.tags;
    var ids = fillNodeIds(nodeIds);
    var undoCmds = [];
    var _tags = typeof tags === 'string' ? [tags] : tags;
    _tags = difference(_tags, ['']);
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        undoCmds.push({
            cmd: TagFeatures.Commands.TagAll,
            opts: {
                nodeIds: id,
                tags: Object.assign([], model.tag),
            },
        });
        model.tag = Object.assign([], _tags);
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '设置标签',
        undoCmd: undoCmds,
    };
};
