import { inAnnex, } from '../base/utils';
import { APPENDS_LIST, } from '../base/const';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
export default {
    move: function (evt, options) {
        var model = evt.item.getModel();
        if (!model._isNode) {
            return;
        }
        if (model.link !== null) {
            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, APPENDS_LIST.link.index)) {
                options.graph.setItemState(evt.item, APPENDS_LIST.link.state, true);
            }
            else {
                options.graph.setItemState(evt.item, APPENDS_LIST.link.state, false);
            }
        }
        if (model.note !== null) {
            var index = model.link === null
                ? APPENDS_LIST.link.index
                : APPENDS_LIST.note.index;
            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, index)) {
                options.graph.setItemState(evt.item, APPENDS_LIST.note.state, true);
            }
            else {
                options.graph.setItemState(evt.item, APPENDS_LIST.note.state, false);
            }
        }
    },
    stop: function (evt, options) {
        var hoverLinks = options.graph.findAllByState('node', 'link-hover');
        if (hoverLinks && hoverLinks.length > 0) {
            for (var _i = 0, hoverLinks_1 = hoverLinks; _i < hoverLinks_1.length; _i++) {
                var link = hoverLinks_1[_i];
                options.graph.setItemState(link, APPENDS_LIST.link.state, false);
            }
        }
        var hoverNotes = options.graph.findAllByState('node', 'note-hover');
        if (hoverNotes && hoverNotes.length > 0) {
            for (var _a = 0, hoverNotes_1 = hoverNotes; _a < hoverNotes_1.length; _a++) {
                var note = hoverNotes_1[_a];
                options.graph.setItemState(note, APPENDS_LIST.note.state, false);
            }
        }
    },
};
