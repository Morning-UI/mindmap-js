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
import { fillNodeIds, } from '../base/utils';
var cleanTagHoverState = function (graph, node) {
    var states = node.getStates();
    for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
        var state = states_1[_i];
        if ((/^tag-hover/u).test(state)) {
            graph.setItemState(node, state, false);
        }
    }
};
var foldChildren = function (mindmap, node, fold) {
    var model = node.getModel();
    var _fold = fold;
    if (fold === undefined) {
        _fold = !!fold;
    }
    if (model._isFolded === _fold) {
        return;
    }
    model._isFolded = _fold;
    if (_fold) {
        model._foldedChildren = model.children;
        model.children = [];
    }
    else {
        model.children = model._foldedChildren;
        model._foldedChildren = [];
    }
    mindmap.graph.setItemState(node, 'children-fold', _fold);
};
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.fold = function (nodeIds, fold) {
            var ids = fillNodeIds(nodeIds);
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                var node = this.graph.findById(id);
                foldChildren(this, node, fold);
                node.draw();
            }
            this.graph.changeData();
            this.graph.refreshLayout();
            return this;
        };
        class_1.prototype.unfold = function (nodeIds) {
            return this.fold(nodeIds, false);
        };
        return class_1;
    }(Base));
});
