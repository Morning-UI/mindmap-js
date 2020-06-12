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
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
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
        class_1.prototype.getAllSelectedNodeDetails = function () {
            var ids = this.getAllSelectedNodeIds();
            if (ids.length <= 1) {
                return [this.getNodeDetail(ids)];
            }
            return this.getNodeDetail(ids);
        };
        class_1.prototype.getSelectedNodeDetail = function () {
            return this.getAllSelectedNodeDetails()[0];
        };
        // TODO : detail和data的区别
        class_1.prototype.getNodeDetail = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var nodeModels = [];
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                nodeModels.push(this.graph.findById(id).getModel());
            }
            var details = pluckDataFromModels(nodeModels, dataItemGetter, this);
            if (nodeModels.length <= 1) {
                return details[0];
            }
            return details;
        };
        class_1.prototype.getRootNodeId = function () {
            var nodes = this.getAllNodeIds();
            if (nodes && nodes[0]) {
                return nodes[0];
            }
            return undefined;
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
        return class_1;
    }(Base));
});
