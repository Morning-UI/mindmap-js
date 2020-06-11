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
                console.log(123, evt.item, APPENDS_LIST.link.state);
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
        // const hoverLinks = options.graph.findAllByState('node', 'link-hover');
        // if (hoverLinks && hoverLinks.length > 0) {
        //     for (const link of hoverLinks) {
        //         options.graph.setItemState(link, APPENDS_LIST.link.state, false);
        //     }
        // }
        // const hoverNotes = options.graph.findAllByState('node', 'note-hover');
        // if (hoverNotes && hoverNotes.length > 0) {
        //     for (const note of hoverNotes) {
        //         options.graph.setItemState(note, APPENDS_LIST.note.state, false);
        //     }
        // }
    },
};
