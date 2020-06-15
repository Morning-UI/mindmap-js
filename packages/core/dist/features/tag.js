import difference from 'lodash.difference';
import { TagFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { setItemState, } from '../utils/setItemState';
import { getModel, } from '../utils/G6Ext';
var cleanTagHoverState = function (graph, node) {
    var states = node.getStates();
    for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
        var state = states_1[_i];
        if ((/^tag-hover/u).test(state)) {
            setItemState(graph, node.get('id'), state, false);
        }
    }
};
export var tag = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, tags = options.tags;
    var ids = fillNodeIds(nodeIds);
    var _tags = typeof tags === 'string' ? [tags] : tags;
    _tags = difference(_tags, ['']);
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        model.tag = Object.assign([], model.tag).concat(_tags);
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '添加标签',
        undoCmd: {
            cmd: TagFeatures.Commands.Untag,
            opts: {
                nodeIds: nodeIds,
                tags: tags,
            },
        },
    };
};
export var tagAll = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, tags = options.tags;
    var ids = fillNodeIds(nodeIds);
    var undoCmds = [];
    var _tags = typeof tags === 'string' ? [tags] : tags;
    _tags = difference(_tags, ['']);
    for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
        var id = ids_2[_i];
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
        note: '替换标签',
        undoCmd: undoCmds,
    };
};
export var untag = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, tags = options.tags;
    var ids = fillNodeIds(nodeIds);
    var undoCmds = [];
    var _untags = typeof tags === 'string' ? [tags] : tags;
    _untags = difference(_untags, ['']);
    for (var _i = 0, ids_3 = ids; _i < ids_3.length; _i++) {
        var id = ids_3[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        if (tags === undefined) {
            // 若tags没有入参，则清除所有tags
            undoCmds.push({
                cmd: TagFeatures.Commands.Tag,
                opts: {
                    nodeIds: id,
                    tags: model.tag,
                },
            });
            model.tag = null;
        }
        else {
            undoCmds.push({
                cmd: TagFeatures.Commands.Tag,
                opts: {
                    nodeIds: id,
                    tags: _untags,
                },
            });
            model.tag = difference(model.tag, _untags);
        }
        cleanTagHoverState(mindmap.graph, node);
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '删除标签',
        undoCmd: undoCmds,
    };
};
