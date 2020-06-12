import {
    MindmapNodeItem,
    MindmapDataItem,
    TraverseItemOptions,
}                                               from '../interface';
import globalData                               from '../base/globalData';

// ITEM INCLUEDS:
// --------------
// INPUT DATA:
//      text : 文案
//      children : 子节点
//      link : 链接
//      note : 备注
//      tag : 标签
//      mark : 标记
// --------------
// G6 DATA:
//      id : node id
//      anchorPoints : 锚点
//      style : 额外的样式
//      type : 采用的图形
// --------------
// INSIDE PROP:
//      _isRoot : 是否是根节点
//      _isNode : 是节点
//      _isDragging : 正在拖拽
//      _isHolder : 占位节点
//      _isFolded : 子节点是否折叠收起
// --------------

// TODO left node props: 
// PRIVATE >>>
//      _shapeStyle : 计算完的图形样式
//      _origin : 原始数据
// for TODO :
// shapeStyle : 使用的图形样式（用户设置）；未启用；

export const traverseOneItem = (item: MindmapDataItem, options: TraverseItemOptions = {}): MindmapNodeItem => {

    // TODO : type diff when node is root
    // TODO : root 计算不能按照id

    const id = String(globalData.id++);
    const nodeItem: MindmapNodeItem = {
        id,
        type : options.type || 'mind-node',
        // eslint-disable-next-line no-magic-numbers
        anchorPoints : [[0, 0.5], [1, 0.5]],

        style : {},

        text : item.text || '新的节点',
        link : item.link || null,
        note : item.note || null,
        tag : item.tag || null,
        mark : item.mark || null,
        children : [],
        folded : item.folded || false,

        _isRoot : id === '1',
        _isNode : true,
        _isDragging : false,
        _isHolder : options.holder || false,
        _foldedChildren : [],
    };

    nodeItem._originChildren = item.children;

    if (options.empty) {

        delete nodeItem.text;

    }

    return nodeItem;

};

export const traverseData = (data: MindmapDataItem): MindmapNodeItem => {

    const nodeData: MindmapNodeItem = traverseOneItem(data);

    if (nodeData._originChildren) {

        for (const index in nodeData._originChildren) {

            if (nodeData.children === undefined) {

                nodeData.children = [];

            }

            nodeData.children[index] = traverseData(nodeData._originChildren[index]);

        }

        // 如果节点是折叠的
        if (nodeData.folded) {

            nodeData._foldedChildren = nodeData.children;
            nodeData.children = [];

        }

        delete nodeData._originChildren;

    }

    return nodeData;

};
