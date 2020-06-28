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

export const selectNode: NodeFeatures.SelectNode = (options) => {

    const {
        nodeIds,
        mindmap,
    } = options;
    const ids = fillNodeIds(nodeIds);

    for (const id of ids) {

        setItemState(mindmap.graph, id, 'selected', true);

    }

    // return mindmap;
    return {
        note : '选中节点',
        undoCmd : {
            cmd : NodeFeatures.Commands.UnselectNode,
            opts : {
                nodeIds,
            },
        } as Command<NodeFeatures.Commands.UnselectNode>,
    };

};

export const unselectNode: NodeFeatures.UnselectNode = (options) => {

    const {
        nodeIds,
        mindmap,
    } = options;
    const ids = fillNodeIds(nodeIds);

    for (const id of ids) {

        setItemState(mindmap.graph, id, 'selected', false);

    }

    return {
        note : '取消选中节点',
        undoCmd : {
            cmd : NodeFeatures.Commands.SelectNode,
            opts : {
                nodeIds,
            },
        } as Command<NodeFeatures.Commands.SelectNode>,
    };

};

export const clearAllSelectedNode: NodeFeatures.ClearAllSelectedNode = (options) => {

    const {
        mindmap,
    } = options;
    const selectedState = 'selected';
    const graph = mindmap.graph;
    const autoPaint: boolean = graph.get('autoPaint');
    const nodeItems = graph.findAllByState<INode>('node', selectedState);
    const edgeItems = graph.findAllByState<IEdge>('edge', selectedState);
    const nodeIds: NodeId[] = [];

    graph.setAutoPaint(false);
    nodeItems.forEach((node) => {

        setItemState(graph, node.get('id'), selectedState, false);
        nodeIds.push(node.get('id'));

    });
    edgeItems.forEach((edge) => setItemState(graph, edge.get('id'), selectedState, false));
    graph.paint();
    graph.setAutoPaint(autoPaint);

    return {
        note : '取消选中所有节点',
        undoCmd : {
            cmd : NodeFeatures.Commands.SelectNode,
            opts : {
                nodeIds,
            },
        } as Command<NodeFeatures.Commands.SelectNode>,
    };

};

export const removeNode: NodeFeatures.RemoveNode = (options) => {

    const {
        nodeIds,
        mindmap,
        _refresh,
    } = options;
    const ids = fillNodeIds(nodeIds);
    const undoCmds: Command<NodeFeatures.Commands.InsertSubNode>[] = [];

    for (const id of ids) {

        const node = findNodeById(mindmap.graph, id);

        if (!node) {

            return null;

        }

        const model = getModel(node);
        const parent = node.getInEdges()[0].getSource();
        const parentModel = getModel(parent);
        const parentChildren = parentModel.folded ? parentModel._foldedChildren : parentModel.children;
        const indexOfParent = parentChildren.indexOf(model);

        parentChildren.splice(indexOfParent, 1);
        undoCmds.unshift({
            cmd : NodeFeatures.Commands.InsertSubNode,
            opts : {
                nodeId : parentModel.id,
                models : pluckDataFromModels([model], nodeItemGetter, mindmap),
                index : indexOfParent,
                _refresh : false,
            },
        });

        const elements = getNodeElements(parent);

        mindNodeAdjustPosition(elements, parentModel, mindmap);

    }

    if (_refresh) {

        mindmap.graph.changeData();
        mindmap.graph.layout();

    }

    // [性能优化]最后一次undo进行refresh
    undoCmds[undoCmds.length - 1].opts._refresh = true;

    return {
        note : '删除节点',
        undoCmd : undoCmds,
    };

};

export const insertSubNode: NodeFeatures.InsertSubNode = (options) => {

    const {
        nodeId,
        models,
        index,
        _refresh,
        mindmap,
    } = options;
    const node = findNodeById(mindmap.graph, nodeId);
    const model = getModel(node);
    const children = model.folded ? model._foldedChildren : model.children;
    const undoCmds: Command<NodeFeatures.Commands.RemoveNode>[] = [];

    // 如果传入的models没有经过traverseData，则traverseData一次
    for (const _index in models) {

        if (models[_index]._isNode === undefined) {

            models[_index] = traverseData(models[_index]);

        }

    }

    if (index > -1) {

        models.reverse();

        for (const item of models) {

            children.splice(index, 0, item);

        }

    } else {

        for (const item of models) {

            children.push(item);

        }

    }

    for (const item of models) {

        undoCmds.push({
            cmd : NodeFeatures.Commands.RemoveNode,
            opts : {
                nodeIds : item.id,
                _refresh : false,
            },
        });

    }

    if (_refresh) {

        // 刷新当前节点的展开按钮
        node.draw();
        mindmap.graph.changeData();
        mindmap.graph.layout();

    }

    // [性能优化]最后一次undo进行refresh
    undoCmds[undoCmds.length - 1].opts._refresh = true;

    return {
        note : '为节点插入子节点',
        undoCmd : undoCmds,
    };

};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,max-lines-per-function
// export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
//     class extends Base implements NodeFeatures.Mixins {

//         focusNodeTextEditor (nodeId: NodeId, clean = false): this {

//             const node = findNodeById(this.graph, nodeId);
//             const elements = getNodeElements(node);

//             this.editting = true;
//             this.editElements = elements;
//             this.editNode = node;
//             refreshTextEditorPosition(this);
//             elements.text.attr({
//                 opacity : 0,
//             });
//             this.editNode.setState('editing', true);
//             this.graph.paint();
//             this._options.$editorInput.focus();

//             if (clean) {

//                 setTimeout(() => {

//                     this.editContent = this
//                         .editContent
//                         .split('')
//                         .slice(-1)
//                         .join('');
//                     this.editorInput(this.editContent);

//                 });

//             }

//             return this;

//         }

//         blurNodeTextEditor (): this {

//             if (!this.editting) {

//                 return this;

//             }

//             const elements = getNodeElements(this.editNode);

//             elements.text.attr({
//                 opacity : 1,
//             });
//             this.graph.paint();
//             this._options.$editor.style.display = 'none';
//             this.editContent = '';
//             this.editElements = {};
//             this.editZoom = 1;
//             this.editNode.setState('editing', false);
//             this.editNode = null;
//             this.graph.layout();
//             setTimeout(() => {

//                 this.editting = false;

//             });

//             return this;

//         }




//         nodeMoveUp (nodeId: NodeId): this {

//             const node = findNodeById(this.graph, nodeId);
//             const model = getModel(node);

//             if (model._isRoot) {

//                 return null;

//             }

//             const parentNode = node.getInEdges()[0].getSource();
//             const parentModel = getModel(parentNode);
//             const indexOfParent = parentModel.children.indexOf(model);

//             if (indexOfParent === 0) {

//                 return this;

//             }

//             swapArr(parentModel.children, indexOfParent, indexOfParent - 1);
//             this.graph.changeData();
//             this.graph.refreshLayout();

//             return this;

//         }

//         nodeMoveDown (nodeId: NodeId): this {

//             const node = findNodeById(this.graph, nodeId);
//             const model = getModel(node);

//             if (model._isRoot) {

//                 return null;

//             }

//             const parentNode = node.getInEdges()[0].getSource();
//             const parentModel = getModel(parentNode);
//             const indexOfParent = parentModel.children.indexOf(model);

//             if (indexOfParent === parentModel.children.length - 1) {

//                 return this;

//             }

//             swapArr(parentModel.children, indexOfParent, indexOfParent + 1);
//             this.graph.changeData();
//             this.graph.refreshLayout();

//             return this;

//         }

//         copyNodes (nodeIds: NodeIds): MindmapDataItems {

//             const ids = fillNodeIds(nodeIds);
//             const datas: MindmapDataItems = [];

//             for (const id of ids) {

//                 const model = getModel(findNodeById(this.graph, id));

//                 datas.push(pluckDataFromModels<MindmapDataItem>([model], dataItemGetter, this)[0]);

//             }

//             return datas;

//         }

//         cutNodes (nodeIds: NodeIds): MindmapDataItems {

//             const datas = this.copyNodes(nodeIds);

//             this.removeNode(nodeIds);

//             return datas;

//         }

//         pasteNodes (parentNodeIds: NodeIds, datas: MindmapDataItems): NodeIds {

//             const ids = fillNodeIds(parentNodeIds);

//             let insertIds: NodeIds = [];

//             for (const id of ids) {

//                 const insertId: NodeIds = this.insertSubNode(id, datas, -1);

//                 if (typeof insertId === 'string') {

//                     insertIds.push(insertId);

//                 } else {

//                     insertIds = insertIds.concat(insertId);

//                 }

//             }

//             return insertIds;

//         }

//         hasSelectedNode (): boolean {

//             return !(this.getSelectedNodeId() === null);

//         }

//     };
