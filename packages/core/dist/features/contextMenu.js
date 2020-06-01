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
import { ContextMenuTypes, } from '../interface';
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.showContextMenu = function (options) {
            var $menu;
            if (options.type === ContextMenuTypes.Link) {
                $menu = this._options.$contextMenuLink;
                $menu.style.left = options.x + "px";
                $menu.style.top = options.y + "px";
                $menu.style.display = 'flex';
                this.contextType = ContextMenuTypes.Link;
            }
            this.contextNodeId = options.nodeId;
            return this;
        };
        class_1.prototype.hideContextMenu = function (type) {
            var $menu;
            if (type === ContextMenuTypes.Link) {
                $menu = this._options.$contextMenuLink;
                $menu.style.display = 'none';
            }
            this.contextNodeId = null;
            this.contextType = null;
            return this;
        };
        class_1.prototype.getContextNodeId = function () {
            return this.contextNodeId;
        };
        class_1.prototype.getContextType = function () {
            return this.contextType;
        };
        return class_1;
    }(Base));
});
