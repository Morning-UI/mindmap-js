import { inNodeShape, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
export default {
    click: function (evt, options) {
        var model = evt.item.getModel();
        var children = model._isFolded ? model._foldedChildren : model.children;
        var group = evt.item.get('group');
        if (!model._isNode) {
            return;
        }
        if (children && children.length > 0) {
            if (inNodeShape(options.mindmap, evt, group.getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup))) {
                options.mindmap.fold(model.id, !model._isFolded);
            }
        }
    },
};
