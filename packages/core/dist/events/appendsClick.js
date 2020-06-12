import { inAnnex, } from '../base/utils';
import { APPENDS_LIST, } from '../base/const';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { getModel, } from '../utils/G6Ext';
export default {
    click: function (evt, options) {
        var model = getModel(evt.item);
        if (!model._isNode) {
            return;
        }
        if (model.link !== null) {
            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, APPENDS_LIST.link.index)) {
                options.mindmap.showLink(model.id);
            }
        }
        if (model.note !== null) {
            var index = model.link === null
                ? APPENDS_LIST.link.index
                : APPENDS_LIST.note.index;
            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, index)) {
                options.mindmap.showEditNote(model.id);
            }
        }
    },
};
