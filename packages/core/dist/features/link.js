import { LinkFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
export var link = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, _link = options.link;
    var ids = fillNodeIds(nodeIds);
    var oriLink;
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        oriLink = model.link;
        model.link = _link || null;
        // TODO: 启用draw后编辑链接后，appends宽度会改变
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '设置链接',
        undoCmd: {
            cmd: LinkFeatures.Commands.Link,
            opts: {
                nodeIds: nodeIds,
                link: oriLink,
            },
        },
    };
};
