import { inAnnex, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
export default {
    move: function (evt, options) {
        var model = evt.item.getModel();
        if (!model._isNode) {
            return;
        }
        var markTypes = Object.keys(model.mark || {});
        if (markTypes.length > 0) {
            var index = (markTypes.length * 4) - 4;
            while (index >= 0) {
                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.markConGroup, index)) {
                    options.graph.setItemState(evt.item, "mark-hover:" + index / 4, true);
                }
                else {
                    options.graph.setItemState(evt.item, "mark-hover:" + index / 4, false);
                }
                index -= 4;
            }
        }
    },
};
