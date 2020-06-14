import map                                      from 'lodash.map';
import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    NodeIds,
    MindmapCoreL1Ctor,
    MindmapNodeItem,
    NodeFeatures,
    NodeId,
    MindmapDatas,
    MindmapData,
    MindmapNodeItems,
    MindmapDataItems,
    MindmapDataItem,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    traverseData,
}                                               from '../utils/traverseData';
import {
    findNodeById,
    getModel,
}                                               from '../utils/G6Ext';

// const parseNodeDataOnce = (data: MindmapData): MindmapData => {

//     let _data = data;

//     if (typeof _data === 'string') {

//         try {

//             _data = JSON.parse(_data);

//         // eslint-disable-next-line no-empty
//         } catch (e) {}

//     }

//     _data = {
//         text : '新的节点',
//         ..._data,
//     };

//     return _data;

// };

// const parseNodeData = (datas: MindmapDataItems|MindmapDataItem): MindmapDatas => {

//     const _datas = datas;

//     if (Array.isArray(_datas)) {

//         for (const key in _datas) {

//             _datas[key] = parseNodeDataOnce(_datas[Number(key)]);

//         }

//         return _datas;

//     }

//     return [parseNodeDataOnce(_datas as MindmapData)];

// };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
    class extends Base implements NodeFeatures {

        removeNode (nodeIds: NodeIds, _refresh = true): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = findNodeById(this.graph, id);

                if (!node) {

                    return this;

                }

                const model = getModel(node);
                const parent = node.getInEdges()[0].getSource();
                const parentModel = getModel(parent);
                const parentChildren = parentModel.folded ? parentModel._foldedChildren : parentModel.children;
                const indexOfParent = parentChildren.indexOf(model);

                parentChildren.splice(indexOfParent, 1);

            }

            if (_refresh) {

                this.graph.changeData();
                this.graph.layout();

            }

            return this;

        }

        insertSubNode (
            nodeId: NodeId,
            datas: MindmapDataItems|MindmapDataItem,
            index = -1,
            _refresh = true,
        ): string | string[] {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);
            // let parent = node.getInEdges()[0].getSource();
            let children = model.folded ? model._foldedChildren : model.children;
            const isSingle = !Array.isArray(datas);

            let _datas = datas;

            if (children === undefined) {

                if (model.folded) {

                    model._foldedChildren = [];
                    children = model._foldedChildren;

                } else {

                    model.children = [];
                    children = model.children;

                }

            }

            if (!Array.isArray(_datas)) {

                _datas = [_datas];

            }

            const _nodeItems: MindmapNodeItems = [];

            for (const _index in _datas) {

                _nodeItems[_index] = traverseData(_datas[_index]);

            }

            if (index > -1) {

                _nodeItems.reverse();

                for (const item of _nodeItems) {

                    children.splice(index, 0, item);

                }

            } else {

                for (const item of _nodeItems) {

                    children.push(item);

                }

            }

            if (_refresh) {

                // 刷新当前节点的展开按钮
                node.draw();
                this.graph.changeData();
                this.graph.layout();

            }

            if (isSingle) {

                return _nodeItems[0].id;

            }

            return map(_nodeItems, 'id');

        }

    };
