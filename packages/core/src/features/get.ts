import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
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
}                                               from '../base/utils';
import {
    dataItemGetter,
    pluckDataFromModels,
}                                               from '../utils/dataGetter';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements GetFeatures {

        getAllSelectedNodeIds (): NodeId[] {

            const nodes = this.graph.findAllByState<INode>('node', 'selected');
            const nodeIds = [];

            for (const node of nodes) {

                nodeIds.push(node.get('id'));

            }

            return nodeIds;

        }

        getSelectedNodeId (): NodeId {

            return this.getAllSelectedNodeIds()[0];

        }

        getAllSelectedNodeDetails (): MindmapDataItem[] {

            const ids = this.getAllSelectedNodeIds();

            if (ids.length <= 1) {

                return [this.getNodeDetail(ids) as MindmapDataItem];

            }

            return this.getNodeDetail(ids) as MindmapDataItem[];

        }

        getSelectedNodeDetail (): MindmapDataItem {

            return this.getAllSelectedNodeDetails()[0];

        }

        // TODO : detail和data的区别
        getNodeDetail (nodeIds: NodeIds): MindmapDataItem|MindmapDataItem[] {

            const ids = fillNodeIds(nodeIds);
            const nodeModels: MindmapNodeItem[] = [];

            for (const id of ids) {

                nodeModels.push(this.graph.findById(id).getModel() as MindmapNodeItem);

            }

            const details = pluckDataFromModels(nodeModels, dataItemGetter, this);

            if (nodeModels.length <= 1) {

                return details[0];

            }

            return details;

        }

        getRootNodeId (): NodeId {

            const nodes = this.getAllNodeIds();

            if (nodes && nodes[0]) {

                return nodes[0];

            }

            return undefined;

        }

        getAllNodeIds (): NodeId[] {

            const nodes = this.graph.getNodes();
            const nodeIds: string[] = [];

            for (const node of nodes) {

                if (node.getModel()._isNode) {

                    nodeIds.push(node.get('id'));

                }

            }

            return nodeIds;

        }

    };
