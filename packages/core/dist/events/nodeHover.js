import { inAnnex, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
export default {
    move: function (evt, options) {
        var model = evt.item.getModel();
        if (model._isNode) {
            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {
                options.graph.setItemState(evt.item, 'hover', true);
            }
            else {
                options.graph.setItemState(evt.item, 'hover', false);
            }
        }
    },
};
