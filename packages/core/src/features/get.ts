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
    GetFeatures,
    NodeId,
    MindmapDataItem,
}                                               from '../interface';
import {
    fillNodeIds,
    pluckDataFromNodes,
    nodeDataItemGetter,
}                                               from '../base/utils';

const cleanTagHoverState = (graph: TreeGraph, node: Item): void => {

    const states = node.getStates();

    for (const state of states) {

        if ((/^tag-hover/u).test(state)) {

            graph.setItemState(node, state, false);

        }

    }

};

export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements GetFeatures {

        getAllSelectedNodeIds (): NodeId[] {

            const nodes = this.graph.findAllByState('node', 'selected');
            const nodeIds = [];

            for (const node of nodes) {

                nodeIds.push(node.get('id'));

            }

            return nodeIds;

        }

        getAllSelectedNodeDetails (): MindmapDataItem[] {

            const ids = this.getAllSelectedNodeIds();

            if (ids.length <= 1) {

                return [this.getNodeDetail(ids) as MindmapDataItem];

            }

            return this.getNodeDetail(ids) as MindmapDataItem[];

        }

        getSelectedNodeId (): NodeId {

            return this.getAllSelectedNodeIds()[0];

        }

        getSelectedNodeDetail (): MindmapDataItem {

            return this.getAllSelectedNodeDetails()[0];

        }

        getNodeDetail (nodeIds: NodeIds): MindmapDataItem|MindmapDataItem[] {

            const ids = fillNodeIds(nodeIds);
            const nodeModels: MindmapNodeItem[] = [];

            for (const id of ids) {

                nodeModels.push(this.graph.findById(id).getModel() as MindmapNodeItem);

            }

            const details = pluckDataFromNodes(nodeModels, nodeDataItemGetter, this);

            if (nodeModels.length <= 1) {

                return details[0];

            }

            return details;

        },

    };
