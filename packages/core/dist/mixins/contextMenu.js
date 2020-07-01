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
var _a;
import { ContextMenuTypes, ContextMenuElementSelector, } from '../interface';
var contextMenuMap = (_a = {},
    _a[ContextMenuTypes.Link] = ContextMenuElementSelector.Link,
    _a[ContextMenuTypes.Note] = ContextMenuElementSelector.Note,
    _a[ContextMenuTypes.Tag] = ContextMenuElementSelector.Tag,
    _a[ContextMenuTypes.LinkEditor] = ContextMenuElementSelector.LinkEditor,
    _a[ContextMenuTypes.NoteEditor] = ContextMenuElementSelector.NoteEditor,
    _a[ContextMenuTypes.TagEditor] = ContextMenuElementSelector.TagEditor,
    _a[ContextMenuTypes.MarkEditor] = ContextMenuElementSelector.MarkEditor,
    _a);
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.showContextMenu = function (options) {
            var $menu;
            var $menuInput;
            this.hideContextMenu();
            switch (options.type) {
                case ContextMenuTypes.Link:
                case ContextMenuTypes.Note:
                case ContextMenuTypes.Tag:
                    $menu = this._options[contextMenuMap[options.type]];
                    $menu.style.left = options.x + "px";
                    $menu.style.top = options.y + "px";
                    $menu.style.display = 'flex';
                    this.$contextEle = $menu;
                    break;
                case ContextMenuTypes.LinkEditor:
                case ContextMenuTypes.NoteEditor:
                case ContextMenuTypes.TagEditor:
                case ContextMenuTypes.MarkEditor:
                    $menu = this._options[contextMenuMap[options.type]];
                    $menu.style.display = 'block';
                    $menu.style.left = options.x - ($menu.clientWidth / 2) + "px";
                    $menu.style.top = options.y + "px";
                    $menuInput = $menu.querySelector('textarea');
                    if ($menuInput) {
                        $menuInput.value = options.data;
                    }
                    this.$contextEle = $menu;
                    this.contextHiddenCallback = options.hiddenCallback;
                    break;
                default:
                    break;
            }
            this.contextType = options.type;
            this.contextData = options.data;
            this.contextNodeIds = options.nodeIds;
            return this;
        };
        class_1.prototype.hideContextMenu = function () {
            switch (this.contextType) {
                case ContextMenuTypes.Link:
                case ContextMenuTypes.Note:
                case ContextMenuTypes.Tag:
                    this.$contextEle.style.display = 'none';
                    break;
                case ContextMenuTypes.LinkEditor:
                case ContextMenuTypes.NoteEditor:
                case ContextMenuTypes.TagEditor:
                case ContextMenuTypes.MarkEditor:
                    this.$contextEle.style.display = 'none';
                    if (typeof this.contextHiddenCallback === 'function') {
                        this.contextHiddenCallback(this.contextNodeIds, this.$contextEle.querySelector('textarea').value);
                    }
                    break;
                default:
                    break;
            }
            this.$contextEle = null;
            this.contextNodeIds = null;
            this.contextType = null;
            this.contextData = null;
            this.contextHiddenCallback = null;
            return this;
        };
        class_1.prototype.getContextNodeIds = function () {
            return this.contextNodeIds;
        };
        class_1.prototype.getContextType = function () {
            return this.contextType;
        };
        class_1.prototype.getContextData = function () {
            return this.contextData;
        };
        return class_1;
    }(Base));
});
