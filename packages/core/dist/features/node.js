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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import map from 'lodash.map';
import { fillNodeIds, traverseData, } from '../base/utils';
var parseNodeDataOnce = function (data) {
    var _data = data;
    if (typeof _data === 'string') {
        try {
            _data = JSON.parse(_data);
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    }
    _data = __assign({ text: '新的节点' }, _data);
    return _data;
};
var parseNodeData = function (datas) {
    var _datas = datas;
    if (Array.isArray(_datas)) {
        for (var key in _datas) {
            _datas[key] = parseNodeDataOnce(_datas[Number(key)]);
        }
        return _datas;
    }
    return [parseNodeDataOnce(_datas)];
};
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
                var node = this.graph.findById(id);
                if (!node) {
                    return this;
                }
                var model = node.getModel();
                var parent_1 = node.getInEdges()[0].getSource();
                var parentModel = parent_1.getModel();
                // TODO : 支持collapsed
                // const parentChildren = parentModel._collapsed ? parentModel._collapsedChildren : parentModel.children;
                var parentChildren = parentModel.children;
                var indexOfParent = parentChildren.indexOf(model);
                parentChildren.splice(indexOfParent, 1);
            }
            if (_refresh) {
                this.graph.changeData();
                this.graph.refreshLayout();
            }
            return this;
        };
        class_1.prototype.insertSubNode = function (nodeId, datas, index, _refresh) {
            if (index === void 0) { index = -1; }
            if (_refresh === void 0) { _refresh = true; }
            var node = this.graph.findById(String(nodeId));
            var model = node.getModel();
            // let parent = node.getInEdges()[0].getSource();
            // TODO : 支持折叠
            // let children = model._collapsed ? model._collapsedChildren : model.children;
            var isSingle = !Array.isArray(datas);
            var _datas = parseNodeData(datas);
            var children = model.children;
            if (children === undefined) {
                // TODO : 支持折叠
                // if (model._collapsed) {
                //     model._collapsedChildren = [];
                //     children = model._collapsedChildren;
                // } else {
                model.children = [];
                children = model.children;
                // }
            }
            if (!Array.isArray(_datas)) {
                _datas = [_datas];
            }
            for (var _index in _datas) {
                _datas[_index] = traverseData(_datas[_index]);
            }
            if (index > -1) {
                _datas = Object.assign([], _datas);
                _datas.reverse();
                for (var _i = 0, _datas_1 = _datas; _i < _datas_1.length; _i++) {
                    var item = _datas_1[_i];
                    children.splice(index, 0, item);
                }
            }
            else {
                for (var _a = 0, _datas_2 = _datas; _a < _datas_2.length; _a++) {
                    var item = _datas_2[_a];
                    children.push(item);
                }
            }
            if (_refresh) {
                // 刷新当前节点的展开按钮
                node.draw();
                this.graph.changeData();
                this.graph.refreshLayout();
            }
            if (isSingle) {
                return _datas[0].id;
            }
            return map(_datas, 'id');
        };
        return class_1;
    }(Base));
});
