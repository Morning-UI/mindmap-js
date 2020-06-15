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
import { TagFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.showEditTag = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var node = this.graph.findById(ids[0]);
            var model = getModel(node);
            var bbox = node.getBBox();
            var _a = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY), x = _a.x, y = _a.y;
            var $boxEditTag = this._options.$boxEditTag;
            var $boxEditTagInput = $boxEditTag.querySelector('textarea');
            var tag = model.tag || [];
            var boxEditTagWidth = 0;
            this.currentEditTagNodeIds = nodeIds;
            $boxEditTag.style.display = 'block';
            boxEditTagWidth = $boxEditTag.clientWidth;
            $boxEditTag.style.left = x - (boxEditTagWidth / 2) + "px";
            $boxEditTag.style.top = y + "px";
            $boxEditTagInput.value = tag.join(',');
            return this;
        };
        class_1.prototype.hideEditTag = function () {
            var $boxEditTag = this._options.$boxEditTag;
            this.currentEditTagNodeIds = [];
            $boxEditTag.style.display = 'none';
            return this;
        };
        class_1.prototype.getCurrentEditTagNodeIds = function () {
            return this.currentEditTagNodeIds;
        };
        class_1.prototype.tag = function (nodeIds, tags) {
            this.commander.addExec({
                cmd: TagFeatures.Commands.Tag,
                opts: {
                    nodeIds: nodeIds,
                    tags: tags,
                },
            });
            return this;
        };
        class_1.prototype.tagAll = function (nodeIds, tags) {
            this.commander.addExec({
                cmd: TagFeatures.Commands.TagAll,
                opts: {
                    nodeIds: nodeIds,
                    tags: tags,
                },
            });
            return this;
        };
        class_1.prototype.untag = function (nodeIds, tags) {
            this.commander.addExec({
                cmd: TagFeatures.Commands.Untag,
                opts: {
                    nodeIds: nodeIds,
                    tags: tags,
                },
            });
            return this;
        };
        return class_1;
    }(Base));
});
