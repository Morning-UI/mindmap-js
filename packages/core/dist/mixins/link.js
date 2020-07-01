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
import { LinkFeatures, ContextMenuTypes, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.menuItemLinkEdit = function () {
            this.showEditLink(this.getContextNodeIds());
        };
        class_1.prototype.menuItemLinkDelete = function () {
            this.unlink(this.getContextNodeIds());
            this.hideContextMenu();
        };
        class_1.prototype.showEditLink = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var node = this.graph.findById(ids[0]);
            var model = getModel(node);
            var bbox = node.getBBox();
            var _a = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY), x = _a.x, y = _a.y;
            this.showContextMenu({
                type: ContextMenuTypes.LinkEditor,
                nodeIds: nodeIds,
                x: x,
                y: y,
                data: model.link,
                hiddenCallback: this.link,
            });
            return this;
        };
        class_1.prototype.hideEditLink = function () {
            return this.hideContextMenu();
        };
        class_1.prototype.link = function (nodeIds, link) {
            this.commander.addExec({
                cmd: LinkFeatures.Commands.Link,
                opts: {
                    nodeIds: nodeIds,
                    link: link,
                },
            });
            return this;
        };
        class_1.prototype.unlink = function (nodeIds) {
            this.commander.addExec({
                cmd: LinkFeatures.Commands.Link,
                opts: {
                    nodeIds: nodeIds,
                    link: null,
                },
            });
            return this;
        };
        return class_1;
    }(Base));
});
