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
    MindmapDataItems,
    MindmapNodeItems,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    dataItemGetter,
    pluckDataFromModels,
}                                               from '../utils/dataGetter';
import {
    getModel,
}                                               from '../utils/G6Ext';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements GetFeatures {

        getNodeData (nodeIds: NodeIds): MindmapDataItems|MindmapDataItem {

            const ids = fillNodeIds(nodeIds);
            const nodeModels: MindmapNodeItems = [];

            for (const id of ids) {

                nodeModels.push(getModel(this.graph.findById(id)));

            }

            const datas = pluckDataFromModels(nodeModels, dataItemGetter, this);

            if (nodeModels.length <= 1) {

                return datas[0];

            }

            return datas;

        }

        getNode (nodeIds: NodeIds): MindmapNodeItems|MindmapNodeItem {

            const ids = fillNodeIds(nodeIds);
            const nodeModels: MindmapNodeItems = [];

            for (const id of ids) {

                nodeModels.push(getModel(this.graph.findById(id)));

            }

            if (nodeModels.length <= 1) {

                return nodeModels[0];

            }

            return nodeModels;

        }

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

        getSelectedLastNodeId (): NodeId {

            const ids = this.getAllSelectedNodeIds();

            return ids[ids.length - 1];

        }

        getAllSelectedNodeDatas (): MindmapDataItems {

            const ids = this.getAllSelectedNodeIds();

            if (ids.length <= 1) {

                return [this.getNodeData(ids) as MindmapDataItem];

            }

            return this.getNodeData(ids) as MindmapDataItems;

        }

        getSelectedNodeData (): MindmapDataItem {

            return this.getAllSelectedNodeDatas()[0];

        }

        getAllSelectedNodes (): MindmapNodeItems {

            const ids = this.getAllSelectedNodeIds();

            if (ids.length <= 1) {

                return [this.getNode(ids) as MindmapNodeItem];

            }

            return this.getNode(ids) as MindmapNodeItems;

        }

        getSelectedNode (): MindmapNodeItem {

            return this.getAllSelectedNodes()[0];

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

        getAllNodeDatas (): MindmapDataItems {

            const datas = this.getNodeData(this.getAllNodeIds());

            return Array.isArray(datas) ? datas : [datas] ;

        }

        getAllNodes (): MindmapNodeItems {

            const nodes = this.getNode(this.getAllNodeIds());

            return Array.isArray(nodes) ? nodes : [nodes] ;

        }

        getRootNodeId (): NodeId {

            const nodes = this.getAllNodeIds();

            if (nodes && nodes[0]) {

                return nodes[0];

            }

            return undefined;

        }

        getRootData (): MindmapDataItem {

            return this.getNodeData(this.getRootNodeId()) as MindmapDataItem;

        }

        getRootNode (): MindmapNodeItem {

            return this.getNode(this.getRootNodeId()) as MindmapNodeItem;

        }

        getEdittingState (): boolean {

            return this.editting;

        }

    };
