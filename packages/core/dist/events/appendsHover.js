import { inAnnex, } from '../base/utils';
import { APPENDS_LIST, } from '../base/const';
export default {
    move: function (evt, options) {
        var model = evt.item.getModel();
        if (!model._isNode) {
            return;
        }
        if (model.link !== null) {
            if (inAnnex(options.mindmap, evt, APPENDS_LIST.link.index)) {
                options.graph.setItemState(evt.item, APPENDS_LIST.link.state, true);
            }
            else {
                options.graph.setItemState(evt.item, APPENDS_LIST.link.state, false);
            }
        }
        // if (model.note) {
        //     let index = APPENDS_LIST.note.index;
        //     if (!model.link) {
        //         index = 0;
        //     }
        //     if (inAnnex(options.vm, evt, index)) {
        //         options.graph.setItemState(evt.item, APPENDS_LIST.note.state, true);
        //     } else {
        //         options.graph.setItemState(evt.item, APPENDS_LIST.note.state, false);
        //     }
        // }
    },
    // TODO : stop note
    stop: function (evt, options) {
        var hoverLinks = options.graph.findAllByState('node', 'link-hover');
        if (hoverLinks && hoverLinks.length > 0) {
            for (var _i = 0, hoverLinks_1 = hoverLinks; _i < hoverLinks_1.length; _i++) {
                var link = hoverLinks_1[_i];
                options.graph.setItemState(link, APPENDS_LIST.link.state, false);
            }
        }
        // let hoverNotes = options.graph.findAllByState('node', 'note-hover');
        // if (hoverNotes && hoverNotes.length > 0) {
        //     for (let note of hoverNotes) {
        //         options.graph.setItemState(note, APPENDS_LIST.note.state, false);
        //     }
        // }
    }
};
