import { LinkFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
export var link = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, _link = options.link;
    var ids = fillNodeIds(nodeIds);
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        model.link = _link;
        // TODO: 启用draw后编辑链接后，appends宽度会改变
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '添加链接',
        undoCmd: {
            cmd: LinkFeatures.Commands.Unlink,
            opts: {
                nodeIds: nodeIds,
            },
        },
    };
};
export var unlink = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds;
    var ids = fillNodeIds(nodeIds);
    var undoCmds = [];
    for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
        var id = ids_2[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        if (model.link !== null) {
            undoCmds.push({
                cmd: LinkFeatures.Commands.Link,
                opts: {
                    nodeIds: id,
                    link: model.link,
                }
            });
        }
        model.link = null;
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '取消链接',
        undoCmd: undoCmds,
    };
};
