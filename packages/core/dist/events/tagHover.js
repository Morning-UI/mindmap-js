import { inAnnex, } from '../base/utils';
import { TAG, } from '../base/const';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
export default {
    move: function (evt, options) {
        var model = evt.item.getModel();
        if (!model._isNode) {
            return;
        }
        if (model.tag !== null) {
            var index = (model.tag.length * 2) - 2;
            while (index >= 0) {
                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.tagConGroup, index)) {
                    options.graph.setItemState(evt.item, TAG.state + ":" + index / 2, true);
                }
                else {
                    options.graph.setItemState(evt.item, TAG.state + ":" + index / 2, false);
                }
                index -= 2;
            }
        }
    },
};
