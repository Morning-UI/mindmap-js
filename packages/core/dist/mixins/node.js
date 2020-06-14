var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import map from 'lodash.map';
import { fillNodeIds, } from '../base/utils';
import { traverseData, } from '../utils/traverseData';
import { findNodeById, getModel, } from '../utils/G6Ext';
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
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.removeNode = function (nodeIds, _refresh) {
            if (_refresh === void 0) { _refresh = true; }
            var ids = fillNodeIds(nodeIds);
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                var node = findNodeById(this.graph, id);
                if (!node) {
                    return this;
                }
                var model = getModel(node);
                var parent_1 = node.getInEdges()[0].getSource();
                var parentModel = getModel(parent_1);
                var parentChildren = parentModel.folded ? parentModel._foldedChildren : parentModel.children;
                var indexOfParent = parentChildren.indexOf(model);
                parentChildren.splice(indexOfParent, 1);
            }
            if (_refresh) {
                this.graph.changeData();
                this.graph.layout();
            }
            return this;
        };
        class_1.prototype.insertSubNode = function (nodeId, datas, index, _refresh) {
            if (index === void 0) { index = -1; }
            if (_refresh === void 0) { _refresh = true; }
            var node = findNodeById(this.graph, nodeId);
            var model = getModel(node);
            // let parent = node.getInEdges()[0].getSource();
            var children = model.folded ? model._foldedChildren : model.children;
            var isSingle = !Array.isArray(datas);
            var _datas = datas;
            if (children === undefined) {
                if (model.folded) {
                    model._foldedChildren = [];
                    children = model._foldedChildren;
                }
                else {
                    model.children = [];
                    children = model.children;
                }
            }
            if (!Array.isArray(_datas)) {
                _datas = [_datas];
            }
            var _nodeItems = [];
            for (var _index in _datas) {
                _nodeItems[_index] = traverseData(_datas[_index]);
            }
            if (index > -1) {
                _nodeItems.reverse();
                for (var _i = 0, _nodeItems_1 = _nodeItems; _i < _nodeItems_1.length; _i++) {
                    var item = _nodeItems_1[_i];
                    children.splice(index, 0, item);
                }
            }
            else {
                for (var _a = 0, _nodeItems_2 = _nodeItems; _a < _nodeItems_2.length; _a++) {
                    var item = _nodeItems_2[_a];
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
        };
        return class_1;
    }(Base));
});
