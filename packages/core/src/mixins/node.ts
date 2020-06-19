import map                                      from 'lodash.map';
import {
    INode, IEdge,
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
    MindmapCoreL2Ctor,
    MindmapCoreL1Type,
}                                               from '../interface';
import {
    fillNodeIds, getNodeElements,
}                                               from '../base/utils';
import {
    traverseData,
}                                               from '../utils/traverseData';
import {
    findNodeById,
    getModel,
}                                               from '../utils/G6Ext';
import {
    setItemState,
}                                               from '../utils/setItemState';
import {
    refreshTextEditorPosition,
}                                               from '../base/editor';

const getUDNodeId = (mindmap: MindmapCoreL1Type, nodeId: NodeId, type: 'up'|'down'): NodeId => {

    const model = mindmap.getNode(nodeId) as MindmapNodeItem;
    const node = findNodeById(mindmap.graph, nodeId);
    const inEdges = node.getInEdges();

    // 无父节点
    if (!inEdges[0]) {

        return null;

    }

    const parentNode = inEdges[0].getSource();
    const parentModel = getModel(parentNode);
    const parentChildren = parentModel.children;
    const indexOfParentChildren = parentChildren.indexOf(model);

    let UDNodeId;

    if (type === 'up' && indexOfParentChildren > 0) {

        UDNodeId = parentChildren[indexOfParentChildren - 1].id;

    } else if (type === 'down' && indexOfParentChildren < parentChildren.length - 1) {

        UDNodeId = parentChildren[indexOfParentChildren + 1].id;

    } else if (
        (type === 'up' && indexOfParentChildren === 0)
        || (type === 'down' && indexOfParentChildren === parentChildren.length - 1)
    ) {

        const parentUDNodeId = getUDNodeId(mindmap, parentModel.id, type);

        // 当前节点父节点没有前同级节点
        if (parentUDNodeId === null) {

            UDNodeId = null;

        } else {

            const parentUDNode = findNodeById(mindmap.graph, parentUDNodeId);
            const parentUDModel = getModel(parentUDNode);
            const parentUDChilren = parentUDModel.children;

            if (parentUDChilren && parentUDChilren.length > 0) {

                // 在祖先节点上找到最近的兄弟节点
                if (type === 'up') {

                    UDNodeId = parentUDChilren[parentUDChilren.length - 1].id;

                } else if (type === 'down') {

                    UDNodeId = parentUDChilren[0].id;

                }

            } else {

                // 无兄弟节点，采用最近的祖先节点
                UDNodeId = parentUDNodeId;

            }

        }

    }

    return UDNodeId;

};

const swapArr = <T extends MindmapNodeItems>(children: T, fromIndex: number, toIndex: number): T => {

    children[toIndex] = children.splice(fromIndex, 1, children[toIndex])[0];

    return children;

};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,max-lines-per-function
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
    class extends Base implements NodeFeatures.Mixins {

        focusNodeTextEditor (nodeId: NodeId, clean = false): this {

            const node = findNodeById(this.graph, nodeId);
            const elements = getNodeElements(node);

            this.editting = true;
            this.editElements = elements;
            this.editNode = node;
            refreshTextEditorPosition(this);
            elements.text.attr({
                opacity : 0,
            });
            this.editNode.setState('editing', true);
            this.graph.paint();
            this._options.$editorInput.focus();

            if (clean) {

                setTimeout(() => {

                    this.editContent = this
                        .editContent
                        .split('')
                        .slice(-1)
                        .join('');
                    this.editorInput(this.editContent);

                });

            }

            return this;

        }

        blurNodeTextEditor (): this {

            if (!this.editting) {

                return this;

            }

            const elements = getNodeElements(this.editNode);

            elements.text.attr({
                opacity : 1,
            });
            this.graph.paint();
            this._options.$editor.style.display = 'none';
            this.editContent = '';
            this.editElements = {};
            this.editZoom = 1;
            this.editNode.setState('editing', false);
            this.editNode = null;
            this.graph.layout();
            setTimeout(() => {

                this.editting = false;

            });

            return this;

        }

        selectNode (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                setItemState(this.graph, id, 'selected', true);

            }

            return this;

        }

        unselectNode (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                setItemState(this.graph, id, 'selected', false);

            }

            return this;

        }

        clearAllSelectedNode (): this {

            const selectedState = 'selected';
            const graph = this.graph;
            const autoPaint: boolean = graph.get('autoPaint');
            const nodeItems = graph.findAllByState<INode>('node', selectedState);
            const edgeItems = graph.findAllByState<IEdge>('edge', selectedState);

            graph.setAutoPaint(false);
            nodeItems.forEach((node) => setItemState(graph, node.get('id'), selectedState, false));
            edgeItems.forEach((edge) => setItemState(graph, edge.get('id'), selectedState, false));
            graph.paint();
            graph.setAutoPaint(autoPaint);

            return this;

        }

        selectMoveUp (): this {

            const id: NodeId = this.getSelectedLastNodeId();

            // 未选中节点
            if (!id) {

                return this;

            }

            const upwardNodeId: NodeId = getUDNodeId(this, id, 'up');

            if (upwardNodeId !== null) {

                this.clearAllSelectedNode();
                this.selectNode(upwardNodeId);

            }

            return this;

        }

        selectMoveDown (): this {

            const id: NodeId = this.getSelectedLastNodeId();

            // 未选中节点
            if (!id) {

                return this;

            }

            const downwardNodeId: NodeId = getUDNodeId(this, id, 'down');

            if (downwardNodeId !== null) {

                this.clearAllSelectedNode();
                this.selectNode(downwardNodeId);

            }

            return this;

        }

        selectMoveBefore (): this {

            const id: NodeId = this.getSelectedNodeId();

            // 未选中节点
            if (!id) {

                return this;

            }

            const node = findNodeById(this.graph, id);
            const inEdges = node.getInEdges();

            // 无父节点
            if (!inEdges[0]) {

                return this;

            }

            const parentNode = inEdges[0].getSource();
            const parentModel = getModel(parentNode);

            this.clearAllSelectedNode();
            this.selectNode(parentModel.id);

            return this;

        }

        selectMoveAfter (): this {

            const id: NodeId = this.getSelectedLastNodeId();

            // 未选中节点
            if (!id) {

                return this;

            }

            const node = findNodeById(this.graph, id);
            const outEdges = node.getOutEdges();

            // 无父节点
            if (!outEdges[0]) {

                return this;

            }

            const childNode = outEdges[0].getTarget();
            const childModel = getModel(childNode);

            this.clearAllSelectedNode();
            this.selectNode(childModel.id);

            return this;

        }

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
            datas: MindmapDataItem|MindmapDataItems,
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

        insertUpwardNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems): NodeIds {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);

            if (model._isRoot) {

                return null;

            }

            const parentNode = node.getInEdges()[0].getSource();
            const parentModel = getModel(parentNode);
            const indexOfParent = parentModel.children.indexOf(model);

            return this.insertSubNode(parentModel.id, datas, indexOfParent);

        }

        insertDownwardNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems): NodeIds {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);

            if (model._isRoot) {

                return null;

            }

            const parentNode = node.getInEdges()[0].getSource();
            const parentModel = getModel(parentNode);
            const indexOfParent = parentModel.children.indexOf(model);

            return this.insertSubNode(parentModel.id, datas, indexOfParent + 1);

        }

        insertFirstNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems): NodeIds {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);

            if (model._isRoot) {

                return null;

            }

            const parentNode = node.getInEdges()[0].getSource();
            const parentModel = getModel(parentNode);

            return this.insertSubNode(parentModel.id, datas, 0);

        }

        insertLastNode (nodeId: NodeId, datas: MindmapDataItem|MindmapDataItems): NodeIds {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);

            if (model._isRoot) {

                return null;

            }

            const parentNode = node.getInEdges()[0].getSource();
            const parentModel = getModel(parentNode);

            return this.insertSubNode(parentModel.id, datas);

        }

        appendUniqueNode (nodeId: NodeId, datas: MindmapDataItem): NodeId {}

        prependUniqueNode (nodeId: NodeId, datas: MindmapDataItem): NodeId {}

        nodeMoveUp (nodeId: NodeId): this {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);

            if (model._isRoot) {

                return null;

            }

            const parentNode = node.getInEdges()[0].getSource();
            const parentModel = getModel(parentNode);
            const indexOfParent = parentModel.children.indexOf(model);

            if (indexOfParent === 0) {

                return this;

            }

            swapArr(parentModel.children, indexOfParent, indexOfParent - 1);
            this.graph.changeData();
            this.graph.refreshLayout();

            return this;

        }

        nodeMoveDown (nodeId: NodeId): this {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);

            if (model._isRoot) {

                return null;

            }

            const parentNode = node.getInEdges()[0].getSource();
            const parentModel = getModel(parentNode);
            const indexOfParent = parentModel.children.indexOf(model);

            if (indexOfParent === parentModel.children.length - 1) {

                return this;

            }

            swapArr(parentModel.children, indexOfParent, indexOfParent + 1);
            this.graph.changeData();
            this.graph.refreshLayout();

            return this;

        }

    };
