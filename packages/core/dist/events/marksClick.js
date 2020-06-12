import { inAnnex, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { getModel, } from '../utils/G6Ext';
export default {
    click: function (evt, options) {
        var model = getModel(evt.item);
        if (!model._isNode) {
            return;
        }
        var markTypes = Object.keys(model.mark || {});
        if (markTypes.length > 0) {
            var index = (markTypes.length * 4) - 4;
            while (index >= 0) {
                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.markConGroup, index)) {
                    options.mindmap.showEditMark(model.id, markTypes[index / 4]);
                    break;
                }
                index -= 4;
            }
        }
    },
};
