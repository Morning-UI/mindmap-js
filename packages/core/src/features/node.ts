import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    NodeIds,
    MindmapCoreConstructor,
    MindmapNodeItem,
    NodeFeatures,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';

export default <TBase extends MindmapCoreConstructor>(Base: TBase): TBase =>
    class extends Base implements NodeFeatures {

        removeNode (nodeIds: NodeIds, _refresh = true): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = this.graph.findById(id) as INode;

                if (!node) {

                    return this;

                }

                const model = node.getModel() as MindmapNodeItem;
                const parent = node.getInEdges()[0].getSource();
                const parentModel = parent.getModel() as MindmapNodeItem;
                // TODO : 支持collapsed
                // const parentChildren = parentModel._collapsed ? parentModel._collapsedChildren : parentModel.children;
                const parentChildren = parentModel.children;
                const indexOfParent = parentChildren.indexOf(model);

                parentChildren.splice(indexOfParent, 1);

            }

            if (_refresh) {

                this.graph.changeData();
                this.graph.refreshLayout();

            }

            return this;

        }

    };
