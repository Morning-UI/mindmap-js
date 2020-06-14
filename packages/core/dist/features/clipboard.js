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
import copy from 'clipboard-copy';
import { pluckDataFromModels, nodeItemGetter, } from '../utils/dataGetter';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.copyNodeToClipboard = function (nodeIds) {
            var data = JSON.stringify(this.copyNode(nodeIds));
            window.__MINDMAP_CLIPBOARD = data;
            copy(data).catch(function () {
                // do not handle errors.
            });
            return data;
        };
        class_1.prototype.copyNode = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var isSingle = (typeof nodeIds === 'string' || nodeIds.length === 1);
            var nodes = [];
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                var node = this.graph.findById(id);
                var model = getModel(node);
                var data = pluckDataFromModels([model], nodeItemGetter, this);
                nodes.push(data[0]);
            }
            if (isSingle) {
                return nodes[0];
            }
            return nodes;
        };
        // eslint-disable-next-line class-methods-use-this
        class_1.prototype.getClipboard = function () {
            return window.__MINDMAP_CLIPBOARD;
        };
        return class_1;
    }(Base));
});
