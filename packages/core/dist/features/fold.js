import { FoldFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { setItemState, } from '../utils/setItemState';
import { getModel, findNodeById, } from '../utils/G6Ext';
var foldChildren = function (mindmap, node, fold) {
    var model = getModel(node);
    var _fold = fold === undefined ? !model.folded : fold;
    if (model.folded === _fold) {
        return;
    }
    model.folded = _fold;
    if (_fold) {
        model._foldedChildren = model.children;
        model.children = [];
    }
    else {
        model.children = model._foldedChildren;
        model._foldedChildren = [];
    }
    setItemState(mindmap.graph, node.get('id'), 'children-fold', _fold);
};
// mindmap: MindmapCoreType, nodeIds: NodeIds, fold: boolean|undefined
export var foldToggle = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, fold = options.fold;
    var ids = fillNodeIds(nodeIds);
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var node = findNodeById(mindmap.graph, id);
        foldChildren(mindmap, node, fold);
        node.draw();
    }
    mindmap.graph.changeData();
    mindmap.graph.refreshLayout();
    return {
        note: fold ? '节点折叠' : '节点展开',
        undoCmd: {
            cmd: FoldFeatures.Commands.FoldToggle,
            opts: {
                nodeIds: nodeIds,
                fold: fold === undefined ? fold : !fold,
            },
        },
    };
};
