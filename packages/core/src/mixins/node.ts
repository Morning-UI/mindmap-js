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
    Command,
    FeatureRes,
}                                               from '../interface';
import {
    fillNodeIds,
    getNodeElements,
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
import {
    pluckDataFromModels,
    dataItemGetter,
    nodeItemGetter,
}                                               from '../utils/dataGetter';
import {
    mindNodeAdjustPosition,
}                                               from '../nodes/mindNode';

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

            this.commander.addExec({
                cmd : NodeFeatures.Commands.SelectNode,
                opts : {
                    nodeIds,
                },
            });

            return this;

        }

        unselectNode (nodeIds: NodeIds): this {

            this.commander.addExec({
                cmd : NodeFeatures.Commands.UnselectNode,
                opts : {
                    nodeIds,
                },
            } as Command<NodeFeatures.Commands.UnselectNode>);

            return this;

        }

        clearAllSelectedNode (): this {

            if (!this.hasSelectedNode()) {

                return this;

            }

            this.commander.addExec({
                cmd : NodeFeatures.Commands.ClearAllSelectedNode,
                opts : {},
            });

            return this;

        }

        clearAndSelectNode (nodeIds: NodeIds): this {

            // 节点未发生变化
            if ([].concat(nodeIds).join(',') === this.getAllSelectedNodeIds().join(',')) {

                return this;

            }

            this.commander.commandNewGroup();
            this.clearAllSelectedNode();
            this.selectNode(nodeIds);
            this.commander.commandExecGroup();

            return this;

        }

        selectMoveUp (): this {

            // 未选中节点
            if (!this.hasSelectedNode()) {

                return this;

            }

            const id: NodeId = this.getSelectedNodeId();
            const upwardNodeId: NodeId = getUDNodeId(this, id, 'up');

            this.commander.commandNewGroup();

            if (upwardNodeId !== null) {

                this.clearAllSelectedNode();
                this.selectNode(upwardNodeId);

            }

            this.commander.commandExecGroup();

            return this;

        }

        selectMoveDown (): this {

            // 未选中节点
            if (!this.hasSelectedNode()) {

                return this;

            }

            const id: NodeId = this.getSelectedLastNodeId();
            const downwardNodeId: NodeId = getUDNodeId(this, id, 'down');

            this.commander.commandNewGroup();

            if (downwardNodeId !== null) {

                this.clearAllSelectedNode();
                this.selectNode(downwardNodeId);

            }

            this.commander.commandExecGroup();

            return this;

        }

        selectMoveBefore (): this {

            // 未选中节点
            if (!this.hasSelectedNode()) {

                return this;

            }

            const id: NodeId = this.getSelectedNodeId();
            const node = findNodeById(this.graph, id);
            const inEdges = node.getInEdges();

            // 无父节点
            if (!inEdges[0]) {

                return this;

            }

            const parentNode = inEdges[0].getSource();
            const parentModel = getModel(parentNode);

            this.commander.commandNewGroup();
            this.clearAllSelectedNode();
            this.selectNode(parentModel.id);
            this.commander.commandExecGroup();

            return this;

        }

        selectMoveAfter (): this {

            // 未选中节点
            if (!this.hasSelectedNode()) {

                return this;

            }

            const id: NodeId = this.getSelectedLastNodeId();
            const node = findNodeById(this.graph, id);
            const outEdges = node.getOutEdges();

            // 无子节点
            if (!outEdges[0]) {

                return this;

            }

            // 移动到中间的节点
            const index = Math.ceil((outEdges.length - 1) / 2);
            const childNode = outEdges[index].getTarget();
            const childModel = getModel(childNode);

            this.commander.commandNewGroup();
            this.clearAllSelectedNode();
            this.selectNode(childModel.id);
            this.commander.commandExecGroup();

            return this;

        }

        removeNode (nodeIds: NodeIds, _refresh = true): this {

            this.commander.addExec({
                cmd : NodeFeatures.Commands.RemoveNode,
                opts : {
                    nodeIds,
                    _refresh,
                },
            });

            return this;

        }

        insertSubNode (
            nodeId: NodeId,
            datas: MindmapDataItem|MindmapDataItems,
            index = -1,
            _refresh = true,
        ): NodeId | NodeId[] {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);
            const isSingle = !Array.isArray(datas);

            let children = model.folded ? model._foldedChildren : model.children;
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

            const models: MindmapNodeItems = [];

            for (const _index in _datas) {

                models[_index] = traverseData(_datas[_index]);

            }

            this.commander.addExec({
                cmd : NodeFeatures.Commands.InsertSubNode,
                opts : {
                    nodeId,
                    models,
                    index,
                    _refresh,
                },
            });

            return isSingle ? models[0].id : map(models, 'id');

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

        appendUniqueNode (nodeId: NodeId, data: MindmapDataItem): NodeId {

            const node = findNodeById(this.graph, nodeId);
            const model = getModel(node);

            if (model._isRoot) {

                return null;

            }

            data.children = pluckDataFromModels<MindmapDataItem>(model.children, nodeItemGetter, this);

            const appendModel = traverseData(data);
            const childrenIds = map(data.children, 'id');

            this.commander.commandNewGroup();
            this.removeNode(childrenIds);
            const newId = this.insertSubNode(nodeId, appendModel, 0) as NodeId;
            this.commander.commandExecGroup();

            return newId;

        }

        prependParentNode (nodeIds: NodeIds, data: MindmapDataItem): NodeId {

            const ids = fillNodeIds(nodeIds);
            const nodes: INode[] = [];
            const models: MindmapNodeItems = [];
            const parentNodes: INode[] = [];
            const parentModels: MindmapNodeItems = [];

            let hasSameParent = true;
            let hasRoot = false;

            for (const id of ids) {

                const node = findNodeById(this.graph, id);
                const model = getModel(node);

                if (model._isRoot) {

                    hasRoot = true;
                    break;

                }

                const parentNode = node.getInEdges()[0].getSource();
                const parentModel = getModel(parentNode);

                if (parentNodes.length > 0 && parentNodes.indexOf(parentNode) === -1) {

                    hasSameParent = false;

                }

                nodes.push(node);
                models.push(model);
                parentNodes.push(parentNode);
                parentModels.push(parentModel);

            }

            if (hasRoot || !hasSameParent) {

                return null;

            }

            data.children = pluckDataFromModels<MindmapDataItem>(models, dataItemGetter, this);

            const indexOfParent = parentModels[0].children.indexOf(models[0]);
            const appendModel = traverseData(data);

            this.commander.commandNewGroup();
            this.removeNode(nodeIds);
            const newId = this.insertSubNode(parentModels[0].id, appendModel, indexOfParent) as NodeId;
            this.commander.commandExecGroup();

            return newId;

        }

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

            this.commander.commandNewGroup();
            this.removeNode(nodeId);
            this.insertSubNode(parentModel.id, model, indexOfParent - 1);
            this.commander.commandExecGroup();

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

            this.commander.commandNewGroup();
            this.removeNode(nodeId);
            this.insertSubNode(parentModel.id, model, indexOfParent + 1);
            this.commander.commandExecGroup();

            return this;

        }

        copyNodes (nodeIds: NodeIds): MindmapDataItems {

            const ids = fillNodeIds(nodeIds);
            const datas: MindmapDataItems = [];

            for (const id of ids) {

                const model = getModel(findNodeById(this.graph, id));

                datas.push(pluckDataFromModels<MindmapDataItem>([model], dataItemGetter, this)[0]);

            }

            return datas;

        }

        cutNodes (nodeIds: NodeIds): MindmapDataItems {

            const datas = this.copyNodes(nodeIds);

            this.removeNode(nodeIds);

            return datas;

        }

        pasteNodes (parentNodeIds: NodeIds, datas: MindmapDataItems): NodeIds {

            const ids = fillNodeIds(parentNodeIds);

            let insertIds: NodeIds = [];

            this.commander.commandNewGroup();

            for (const id of ids) {

                const insertId: NodeIds = this.insertSubNode(id, datas, -1);

                if (typeof insertId === 'string') {

                    insertIds.push(insertId);

                } else {

                    insertIds = insertIds.concat(insertId);

                }

            }

            this.commander.commandExecGroup();

            return insertIds;

        }

        hasSelectedNode (): boolean {

            return !(this.getSelectedNodeId() === null);

        }

    };
