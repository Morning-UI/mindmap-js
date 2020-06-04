import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    MindmapNodeItem,
}                                               from '../interface';
import {
    inAnnex,
}                                               from '../base/utils';
import {
    APPENDS_LIST,
    TAG,
}                                               from '../base/const';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';

export default {
    move : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = evt.item.getModel() as MindmapNodeItem;

        if (!model._isNode) {

            return;

        }

        if (model.tag !== null) {

            let index = (model.tag.length * 2) - 2;

            while (index >= 0) {

                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.tagConGroup, index)) {

                    options.graph.setItemState(evt.item, `${TAG.state}:${index / 2}`, true);

                } else {

                    options.graph.setItemState(evt.item, `${TAG.state}:${index / 2}`, false);

                }

                index -= 2;

            }

        }

    },
    // stop : (evt: IG6GraphEvent, options: EventOptions): void => {

    //     const hoverLinks = options.graph.findAllByState('node', 'link-hover');

    //     if (hoverLinks && hoverLinks.length > 0) {

    //         for (const link of hoverLinks) {

    //             options.graph.setItemState(link, APPENDS_LIST.link.state, false);

    //         }

    //     }

    //     const hoverNotes = options.graph.findAllByState('node', 'note-hover');

    //     if (hoverNotes && hoverNotes.length > 0) {

    //         for (const note of hoverNotes) {

    //             options.graph.setItemState(note, APPENDS_LIST.note.state, false);

    //         }

    //     }

    // },
};