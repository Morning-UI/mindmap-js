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
import { TagFeatures, ContextMenuTypes, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
var cleanTagHoverState = function (graph, node) {
    var states = node.getStates();
    for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
        var state = states_1[_i];
        if ((/^tag-hover/u).test(state)) {
            setItemState(graph, node.get('id'), state, false);
        }
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.menuItemTagEdit = function () {
            this.showEditTag(this.getContextNodeIds());
        };
        class_1.prototype.menuItemTagDelete = function () {
            this.untag(this.getContextNodeIds(), this.getContextData().tag);
            this.hideContextMenu();
        };
        class_1.prototype.showEditTag = function (nodeIds) {
            var _this = this;
            var ids = fillNodeIds(nodeIds);
            var node = this.graph.findById(ids[0]);
            var model = getModel(node);
            var bbox = node.getBBox();
            var _a = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY), x = _a.x, y = _a.y;
            var $boxEditTag = this._options.$boxEditTag;
            var $boxEditTagInput = $boxEditTag.querySelector('textarea');
            var tag = model.tag || [];
            $boxEditTagInput.value = tag.join(',');
            this.showContextMenu({
                type: ContextMenuTypes.TagEditor,
                nodeIds: nodeIds,
                x: x,
                y: y,
                data: tag.join(','),
                hiddenCallback: function (_nodeIds, value) { return _this.tagAll(_nodeIds, value.split(',')); },
            });
            return this;
        };
        class_1.prototype.hideEditTag = function () {
            this.hideContextMenu();
            return this;
        };
        class_1.prototype.tag = function (nodeIds, tags) {
            var ids = fillNodeIds(nodeIds);
            var _tags = typeof tags === 'string' ? [tags] : tags;
            _tags = difference(_tags, ['']);
            this.commander.commandNewGroup();
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                var node = this.graph.findById(id);
                var model = getModel(node);
                var modelTag = Object.assign([], model.tag).concat(_tags);
                this.commander.addExec({
                    cmd: TagFeatures.Commands.TagAll,
                    opts: {
                        nodeIds: id,
                        tags: modelTag,
                    },
                });
            }
            this.commander.commandExecGroup();
            return this;
        };
        class_1.prototype.tagAll = function (nodeIds, tags) {
            this.commander.addExec({
                cmd: TagFeatures.Commands.TagAll,
                opts: {
                    nodeIds: nodeIds,
                    tags: tags,
                },
            });
            return this;
        };
        class_1.prototype.untag = function (nodeIds, tags) {
            var ids = fillNodeIds(nodeIds);
            var _untags = typeof tags === 'string' ? [tags] : tags;
            _untags = difference(_untags, ['']);
            this.commander.commandNewGroup();
            for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
                var id = ids_2[_i];
                var node = this.graph.findById(id);
                var model = getModel(node);
                if (tags === undefined) {
                    // 若tags没有入参，则清除所有tags
                    this.commander.addExec({
                        cmd: TagFeatures.Commands.TagAll,
                        opts: {
                            nodeIds: id,
                            tags: null,
                        },
                    });
                }
                else {
                    this.commander.addExec({
                        cmd: TagFeatures.Commands.TagAll,
                        opts: {
                            nodeIds: id,
                            tags: difference(model.tag, _untags),
                        },
                    });
                }
                cleanTagHoverState(this.graph, node);
            }
            this.commander.commandExecGroup();
            return this;
        };
        return class_1;
    }(Base));
});
