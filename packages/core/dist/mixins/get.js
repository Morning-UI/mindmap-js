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
import { fillNodeIds, } from '../base/utils';
import { dataItemGetter, pluckDataFromModels, } from '../utils/dataGetter';
import { getModel, } from '../utils/G6Ext';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.getNodeData = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var nodeModels = [];
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                nodeModels.push(getModel(this.graph.findById(id)));
            }
            var datas = pluckDataFromModels(nodeModels, dataItemGetter, this);
            if (nodeModels.length <= 1) {
                return datas[0];
            }
            return datas;
        };
        class_1.prototype.getNode = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var nodeModels = [];
            for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
                var id = ids_2[_i];
                nodeModels.push(getModel(this.graph.findById(id)));
            }
            if (nodeModels.length <= 1) {
                return nodeModels[0];
            }
            return nodeModels;
        };
        class_1.prototype.getAllSelectedNodeIds = function () {
            var nodes = this.graph.findAllByState('node', 'selected');
            var nodeIds = [];
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                nodeIds.push(node.get('id'));
            }
            return nodeIds;
        };
        class_1.prototype.getSelectedNodeId = function () {
            return this.getAllSelectedNodeIds()[0];
        };
        class_1.prototype.getAllSelectedNodeDatas = function () {
            var ids = this.getAllSelectedNodeIds();
            if (ids.length <= 1) {
                return [this.getNodeData(ids)];
            }
            return this.getNodeData(ids);
        };
        class_1.prototype.getSelectedNodeData = function () {
            return this.getAllSelectedNodeDatas()[0];
        };
        class_1.prototype.getAllSelectedNodes = function () {
            var ids = this.getAllSelectedNodeIds();
            if (ids.length <= 1) {
                return [this.getNode(ids)];
            }
            return this.getNode(ids);
        };
        class_1.prototype.getSelectedNode = function () {
            return this.getAllSelectedNodes()[0];
        };
        class_1.prototype.getAllNodeIds = function () {
            var nodes = this.graph.getNodes();
            var nodeIds = [];
            for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                var node = nodes_2[_i];
                if (node.getModel()._isNode) {
                    nodeIds.push(node.get('id'));
                }
            }
            return nodeIds;
        };
        class_1.prototype.getAllNodeDatas = function () {
            var datas = this.getNodeData(this.getAllNodeIds());
            return Array.isArray(datas) ? datas : [datas];
        };
        class_1.prototype.getAllNodes = function () {
            var nodes = this.getNode(this.getAllNodeIds());
            return Array.isArray(nodes) ? nodes : [nodes];
        };
        class_1.prototype.getRootNodeId = function () {
            var nodes = this.getAllNodeIds();
            if (nodes && nodes[0]) {
                return nodes[0];
            }
            return undefined;
        };
        class_1.prototype.getRootNode = function () {
            return this.getNode(this.getRootNodeId());
        };
        class_1.prototype.getEdittingState = function () {
            return this.editting;
        };
        return class_1;
    }(Base));
});
