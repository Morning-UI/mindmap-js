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
import difference from 'lodash.difference';
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
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.showEditTag = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var node = this.graph.findById(ids[0]);
            var model = node.getModel();
            var bbox = node.getBBox();
            var _a = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY), x = _a.x, y = _a.y;
            var $boxEditTag = this._options.$boxEditTag;
            var $boxEditTagInput = $boxEditTag.querySelector('textarea');
            var boxEditTagWidth = 0;
            this.currentEditTagNodeIds = nodeIds;
            $boxEditTag.style.display = 'block';
            boxEditTagWidth = $boxEditTag.clientWidth;
            $boxEditTag.style.left = x - (boxEditTagWidth / 2) + "px";
            $boxEditTag.style.top = y + "px";
            $boxEditTagInput.value = model.tag.join(',');
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
            var ids = fillNodeIds(nodeIds);
            var _tags = typeof tags === 'string' ? [tags] : tags;
            _tags = difference(_tags, ['']);
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                var node = this.graph.findById(id);
                var model = node.getModel();
                model.tag = Object.assign([], _tags);
                node.draw();
            }
            this.graph.layout();
            return this;
        };
        class_1.prototype.tagAdd = function (nodeIds, tags) {
            var ids = fillNodeIds(nodeIds);
            var _tags = typeof tags === 'string' ? [tags] : tags;
            _tags = difference(_tags, ['']);
            for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
                var id = ids_2[_i];
                var node = this.graph.findById(id);
                var model = node.getModel();
                model.tag = Object.assign([], model.tag).concat(_tags);
                node.draw();
            }
            this.graph.layout();
            return this;
        };
        class_1.prototype.untag = function (nodeIds, untags) {
            var ids = fillNodeIds(nodeIds);
            var _untags = typeof untags === 'string' ? [untags] : untags;
            _untags = difference(_untags, ['']);
            for (var _i = 0, ids_3 = ids; _i < ids_3.length; _i++) {
                var id = ids_3[_i];
                var node = this.graph.findById(id);
                var model = node.getModel();
                model.tag = difference(model.tag, _untags);
                cleanTagHoverState(this.graph, node);
                node.draw();
            }
            this.graph.layout();
            return this;
        };
        class_1.prototype.untagByIndex = function (nodeIds, index) {
            var ids = fillNodeIds(nodeIds);
            for (var _i = 0, ids_4 = ids; _i < ids_4.length; _i++) {
                var id = ids_4[_i];
                var node = this.graph.findById(id);
                var model = node.getModel();
                model.tag.splice(index, 1);
                cleanTagHoverState(this.graph, node);
                node.draw();
            }
            this.graph.layout();
            return this;
        };
        return class_1;
    }(Base));
});
