import { inNodeShape, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
export default {
    move: function (evt, options) {
        var model = evt.item.getModel();
        var children = model._isFolded ? model._foldedChildren : model.children;
        var group = evt.item.get('group');
        if (!model._isNode) {
            return;
        }
        if (children && children.length > 0) {
            if (inNodeShape(options.mindmap, evt, group.getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup))) {
                options.graph.setItemState(evt.item, 'fold-btn-hover', true);
            }
            else {
                options.graph.setItemState(evt.item, 'fold-btn-hover', false);
            }
        }
    },
    stop: function (evt, options) {
        var hoverFoldBtn = options.graph.findAllByState('node', 'fold-btn-hover');
        if (hoverFoldBtn && hoverFoldBtn.length > 0) {
            for (var _i = 0, hoverFoldBtn_1 = hoverFoldBtn; _i < hoverFoldBtn_1.length; _i++) {
                var btn = hoverFoldBtn_1[_i];
                options.graph.setItemState(btn, 'fold-btn-hover', false);
            }
        }
    },
};
