import { inAnnex, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { setItemState, } from '../utils/setItemState';
import { getModel, } from '../utils/G6Ext';
export default {
    move: function (evt, options) {
        var model = getModel(evt.item);
        if (!model._isNode) {
            return;
        }
        var markTypes = Object.keys(model.mark || {});
        if (markTypes.length > 0) {
            var index = (markTypes.length * 4) - 4;
            while (index >= 0) {
                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.markConGroup, index)) {
                    setItemState(options.graph, evt.item.get('id'), "mark-hover:" + index / 4, true);
                }
                else {
                    setItemState(options.graph, evt.item.get('id'), "mark-hover:" + index / 4, false);
                }
                index -= 4;
            }
        }
    },
};
