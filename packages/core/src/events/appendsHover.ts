import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    // MindmapNodeItem,
}                                               from '../interface';
import {
    inAnnex,
}                                               from '../base/utils';
import {
    APPENDS_LIST,
}                                               from '../base/const';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';

export default {
    move : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = evt.item.getModel();

        if (!model._isNode) {

            return;

        }

        if (model.link !== null) {

            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, APPENDS_LIST.link.index)) {

                options.graph.setItemState(evt.item, APPENDS_LIST.link.state, true);

            } else {

                options.graph.setItemState(evt.item, APPENDS_LIST.link.state, false);

            }

        }

        if (model.note !== null) {

            const index = model.link === null
                ? APPENDS_LIST.link.index
                : APPENDS_LIST.note.index;

            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, index)) {

                options.graph.setItemState(evt.item, APPENDS_LIST.note.state, true);

            } else {

                options.graph.setItemState(evt.item, APPENDS_LIST.note.state, false);

            }

        }

    },
    stop : (evt: IG6GraphEvent, options: EventOptions): void => {

        const hoverLinks = options.graph.findAllByState('node', 'link-hover');

        if (hoverLinks && hoverLinks.length > 0) {

            for (const link of hoverLinks) {

                options.graph.setItemState(link, APPENDS_LIST.link.state, false);

            }

        }

        const hoverNotes = options.graph.findAllByState('node', 'note-hover');

        if (hoverNotes && hoverNotes.length > 0) {

            for (const note of hoverNotes) {

                options.graph.setItemState(note, APPENDS_LIST.note.state, false);

            }

        }

    },
};