import { inNodeShape, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { setItemState, } from '../utils/setItemState';
import { getModel, } from '../utils/G6Ext';
export default {
    move: function (evt, options) {
        var model = getModel(evt.item);
        var children = model.folded ? model._foldedChildren : model.children;
        var group = evt.item.get('group');
        if (!model._isNode) {
            return;
        }
        if (children && children.length > 0) {
            if (inNodeShape(options.mindmap, evt, group.getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup))) {
                setItemState(options.graph, evt.item.get('id'), 'fold-btn-hover', true);
            }
            else {
                setItemState(options.graph, evt.item.get('id'), 'fold-btn-hover', false);
            }
        }
    },
    stop: function (evt, options) {
        var hoverFoldBtn = options.graph.findAllByState('node', 'fold-btn-hover');
        if (hoverFoldBtn && hoverFoldBtn.length > 0) {
            for (var _i = 0, hoverFoldBtn_1 = hoverFoldBtn; _i < hoverFoldBtn_1.length; _i++) {
                var btn = hoverFoldBtn_1[_i];
                setItemState(options.graph, btn.get('id'), 'fold-btn-hover', false);
            }
        }
    },
};
