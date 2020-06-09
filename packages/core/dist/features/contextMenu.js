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
            this.hideAllContextMenu();
            if (options.type === ContextMenuTypes.Link) {
                $menu = this._options.$contextMenuLink;
                $menu.style.left = options.x + "px";
                $menu.style.top = options.y + "px";
                $menu.style.display = 'flex';
                this.contextType = ContextMenuTypes.Link;
            }
            else if (options.type === ContextMenuTypes.Note) {
                $menu = this._options.$contextMenuNote;
                $menu.style.left = options.x + "px";
                $menu.style.top = options.y + "px";
                $menu.style.display = 'flex';
                this.contextType = ContextMenuTypes.Note;
            }
            else if (options.type === ContextMenuTypes.Tag) {
                $menu = this._options.$contextMenuTag;
                $menu.style.left = options.x + "px";
                $menu.style.top = options.y + "px";
                $menu.style.display = 'flex';
                this.contextType = ContextMenuTypes.Tag;
                this.contextData = options.data;
            }
            this.contextNodeId = options.nodeId;
            return this;
        };
        class_1.prototype.hideContextMenu = function () {
            var $menu;
            var type = this.contextType;
            if (type === ContextMenuTypes.Link) {
                $menu = this._options.$contextMenuLink;
                $menu.style.display = 'none';
            }
            else if (type === ContextMenuTypes.Note) {
                $menu = this._options.$contextMenuNote;
                $menu.style.display = 'none';
            }
            else if (type === ContextMenuTypes.Tag) {
                $menu = this._options.$contextMenuTag;
                $menu.style.display = 'none';
            }
            this.contextNodeId = null;
            this.contextType = null;
            this.contextData = null;
            return this;
        };
        class_1.prototype.hideAllContextMenu = function () {
            this.hideContextMenu();
            this.hideEditLink();
            this.hideEditNote();
            this.hideEditTag();
            return this;
        };
        class_1.prototype.getContextNodeId = function () {
            return this.contextNodeId;
        };
        class_1.prototype.getContextType = function () {
            return this.contextType;
        };
        class_1.prototype.getContextData = function () {
            return this.contextData;
        };
        class_1.prototype.menuItemLinkEdit = function () {
            this.showEditLink(this.getContextNodeId());
            this.hideContextMenu();
        };
        class_1.prototype.menuItemLinkDelete = function () {
            this.unlink(this.getContextNodeId());
            this.hideContextMenu();
        };
        class_1.prototype.menuItemNoteEdit = function () {
            this.showEditNote(this.getContextNodeId());
            this.hideContextMenu();
        };
        class_1.prototype.menuItemNoteDelete = function () {
            this.unnote(this.getContextNodeId());
            this.hideContextMenu();
        };
        class_1.prototype.menuItemTagEdit = function () {
            this.showEditTag(this.getContextNodeId());
            this.hideContextMenu();
        };
        class_1.prototype.menuItemTagDelete = function () {
            this.untagByIndex(this.getContextNodeId(), this.getContextData().tagIndex);
            this.hideContextMenu();
        };
        return class_1;
    }(Base));
});
