import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    NodeIds,
    MindmapNodeItem,
    MindmapCoreL0Ctor,
    FoldFeatures,
    MindmapCoreL0Type,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    setItemState,
}                                               from '../utils/setItemState';

const foldChildren = (mindmap: MindmapCoreL0Type, node: INode, fold: boolean|undefined): void => {

    const model = node.getModel() as MindmapNodeItem;
    const _fold = fold === undefined ? !model._isFolded : fold;

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

    setItemState(mindmap.graph, node.get('id'), 'children-fold', _fold);

};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements FoldFeatures {

        foldToggle (nodeIds: NodeIds, fold: boolean|undefined): this {

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

        fold (nodeIds: NodeIds): this {

            return this.foldToggle(nodeIds, true);

        }

        unfold (nodeIds: NodeIds): this {

            return this.foldToggle(nodeIds, false);

        }

    };
