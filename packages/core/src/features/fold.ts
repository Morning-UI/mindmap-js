import difference                               from 'lodash.difference';
import {
    TreeGraph,
}                                               from '@antv/g6';
import {
    Item,
}                                               from '@antv/g6/lib/types';
import {
    NodeIds,
    MindmapNodeItem,
    MindmapCoreL0Ctor,
    FoldFeatures,
    NodeId,
    MindmapDataItem,
    MindmapCoreL0Type,
}                                               from '../interface';
import {
    fillNodeIds,
    pluckDataFromNodes,
    nodeDataItemGetter,
}                                               from '../base/utils';
import { INode } from '@antv/g6/lib/interface/item';

const cleanTagHoverState = (graph: TreeGraph, node: Item): void => {

    const states = node.getStates();

    for (const state of states) {

        if ((/^tag-hover/u).test(state)) {

            graph.setItemState(node, state, false);

        }

    }

};

const foldChildren = (mindmap: MindmapCoreL0Type, node: INode, fold: boolean|undefined): void => {

    const model = node.getModel() as MindmapNodeItem;

    let _fold = fold;

    if (fold === undefined) {

        _fold = !!fold;

    }

    if (model._isFolded === _fold) {

        return;

    }

    model._isFolded = _fold;

    if (_fold) {

        model._foldedChildren = model.children;
        model.children = [];

    } else {

        model.children = model._foldedChildren;
        model._foldedChildren = [];

    }

    mindmap.graph.setItemState(node, 'children-fold', _fold);

};

export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements FoldFeatures {

        fold (nodeIds: NodeIds, fold: boolean|undefined): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = this.graph.findById(id) as INode;

                foldChildren(this, node, fold);
                node.draw();

            }

            this.graph.changeData();
            this.graph.refreshLayout();

            return this;

        }

        unfold (nodeIds: NodeIds): this {

            return this.fold(nodeIds, false);

        }

    };
