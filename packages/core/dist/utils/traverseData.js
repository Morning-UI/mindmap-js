import globalData from '../base/globalData';
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
// ITEM INCLUEDS:
//      tag : 标签
//      note : 备注
//      mark : 标记(用户设置)
// PRIVATE >>>
//      _shapeStyle : 计算完的图形样式
//      _origin : 原始数据
//      _mark : 标记(经过转换后)
// for TODO :
// shapeStyle : 使用的图形样式（用户设置）；未启用；
export var traverseOneItem = function (item) {
    var globalId = globalData.id;
    var nodeItem = {
        id: String(globalData.id++),
        children: [],
        _foldedChildren: item._foldedChildren || [],
        // eslint-disable-next-line no-magic-numbers
        anchorPoints: [[0, 0.5], [1, 0.5]],
        style: {},
        // TODO : type diff when node is root
        type: 'mind-node',
        text: item.text || '新的节点',
        link: item.link || null,
        note: item.note || null,
        tag: item.tag || null,
        mark: item.mark || null,
        _isRoot: globalId === 1,
        _isNode: true,
        _isDragging: false,
        _isHolder: false,
        _isFolded: item._isFolded || false,
    };
    nodeItem._originChildren = item.children;
    return nodeItem;
};
export var traverseData = function (data) {
    var nodeData = traverseOneItem(data);
    if (nodeData._originChildren) {
        for (var index in nodeData._originChildren) {
            if (nodeData.children === undefined) {
                nodeData.children = [];
            }
            nodeData.children[index] = traverseData(nodeData._originChildren[index]);
        }
        delete nodeData._originChildren;
    }
    return nodeData;
};
