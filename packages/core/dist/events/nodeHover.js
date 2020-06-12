import { inAnnex, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { setItemState, } from '../utils/setItemState';
import { getModel, } from '../utils/G6Ext';
export default {
    move: function (evt, options) {
        var model = getModel(evt.item);
        if (model._isNode) {
            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {
                setItemState(options.graph, evt.item.get('id'), 'hover', true);
            }
            else {
                setItemState(options.graph, evt.item.get('id'), 'hover', false);
            }
        }
    },
};
