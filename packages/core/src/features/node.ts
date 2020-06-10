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
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    traverseData,
}                                               from '../utils/traverseData';

const parseNodeDataOnce = (data: MindmapData): MindmapData => {

    let _data = data;

    if (typeof _data === 'string') {

        try {

            _data = JSON.parse(_data);

        // eslint-disable-next-line no-empty
        } catch (e) {}

    }

    _data = {
        text : '新的节点',
        ..._data,
    };

    return _data;

};

const parseNodeData = (datas: MindmapDatas): MindmapDatas => {

    const _datas = datas;

    if (Array.isArray(_datas)) {

        for (const key in _datas) {

            _datas[key] = parseNodeDataOnce(_datas[Number(key)]);

        }

        return _datas;

    }

    return [parseNodeDataOnce(_datas as MindmapData)];

};

export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
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
                const parentChildren = parentModel._isFolded ? parentModel._foldedChildren : parentModel.children;
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
            datas: MindmapDatas,
            index = -1,
            _refresh = true,
        ): string | string[] {

            const node = this.graph.findById(String(nodeId)) as INode;
            const model = node.getModel() as MindmapNodeItem;
            // let parent = node.getInEdges()[0].getSource();
            let children = model._isFolded ? model._foldedChildren : model.children;
            const isSingle = !Array.isArray(datas);

            let _datas = parseNodeData(datas);

            if (children === undefined) {

                if (model._isFolded) {

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

            const _nodeItems: MindmapNodeItem[] = [];

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
