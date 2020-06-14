import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    NodeIds,
    MindmapNodeItem,
    MindmapCoreL0Ctor,
    FoldFeatures,
    MindmapCoreL0Type,
    MindmapCoreType,
    CommandOptions,
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    setItemState,
}                                               from '../utils/setItemState';
import {
    getModel,
    findNodeById,
}                                               from '../utils/G6Ext';

const foldChildren = (mindmap: MindmapCoreL0Type, node: INode, fold: boolean|undefined): void => {

    const model = getModel(node);
    const _fold = fold === undefined ? !model.folded : fold;

    if (model.folded === _fold) {

        return;

    }

    model.folded = _fold;

    if (_fold) {

        model._foldedChildren = model.children;
        model.children = [];

    } else {

        model.children = model._foldedChildren;
        model._foldedChildren = [];

    }

    setItemState(mindmap.graph, node.get('id'), 'children-fold', _fold);

};

// mindmap: MindmapCoreType, nodeIds: NodeIds, fold: boolean|undefined
export const foldToggle: FoldFeatures.FoldToggle = (options) => {

    const {
        mindmap,
        nodeIds,
        fold,
    } = options;
    const ids = fillNodeIds(nodeIds);

    for (const id of ids) {

        const node = findNodeById(mindmap.graph, id);

        foldChildren(mindmap, node, fold);
        node.draw();

    }

    mindmap.graph.changeData();
    mindmap.graph.refreshLayout();

    return {
        note : fold ? '节点折叠' : '节点展开',
        undoCmd : {
            cmd : FoldFeatures.Commands.FoldToggle,
            opts : {
                nodeIds : nodeIds,
                fold : !fold,
            }
        } as Command<FoldFeatures.Commands.FoldToggle>
    };

};
