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
import { create, register, bindEvent, } from './base/graph';
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(options) {
            var _this = _super.call(this) || this;
            register(_this);
            _this.graph = create(_this, options);
            _this.G6 = G6;
            bindEvent(_this);
            // this._options.$editorInput = this._options.$editor.querySelector('textarea');
            return _this;
        }
        return class_1;
    }(Base));
});
