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
import * as G6 from '@antv/g6';
import { create, register, bindEvent, } from '../base/graph';
import { Commander, } from '../commander/index';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.call(this) || this;
            var options = args[0];
            register(_this);
            _this.graph = create(_this, options);
            _this.commander = new Commander({
                maxRecordNums: 100,
                mindmap: _this,
            });
            _this.G6 = G6;
            bindEvent(_this);
            // this._options.$editorInput = this._options.$editor.querySelector('textarea');
            var $g6Minimap = _this._options.$con.querySelector('.g6-minimap');
            var g6MinimapHeight = $g6Minimap.clientHeight;
            _this._options.$zoomSlider.style.paddingBottom = g6MinimapHeight + "px";
            // TODO : remove test
            window.test = _this;
            return _this;
        }
        class_1.prototype.redo = function () {
            return this.commander.redo();
        };
        class_1.prototype.undo = function () {
            return this.commander.undo();
        };
        return class_1;
    }(Base));
});
