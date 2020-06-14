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
import { FoldFeatures, } from '../interface';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.foldToggle = function (nodeIds, fold) {
            this.commander.addExec({
                cmd: FoldFeatures.Commands.FoldToggle,
                opts: {
                    nodeIds: nodeIds,
                    fold: fold,
                },
            });
            return this;
        };
        class_1.prototype.fold = function (nodeIds) {
            return this.foldToggle(nodeIds, true);
        };
        class_1.prototype.unfold = function (nodeIds) {
            return this.foldToggle(nodeIds, false);
        };
        return class_1;
    }(Base));
});
