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
import { traverseData, } from '../utils/traverseData';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.readData = function (data) {
            var _this = this;
            this.data = traverseData(data);
            this.graph.read(this.data);
            setTimeout(function () {
                _this.graph.layout(true);
                // this.$refs['mor-mindmap-zoomslider'].set(vm.getZoom() * 100);
                _this._updateZoomValue();
            });
            return this;
        };
        return class_1;
    }(Base));
});
