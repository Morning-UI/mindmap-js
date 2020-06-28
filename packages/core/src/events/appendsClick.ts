import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
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
import {
    getModel,
}                                               from '../utils/G6Ext';

export default {
    click : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = getModel(evt.item);

        if (!model._isNode) {

            return;

        }

        if (model.link !== null) {

            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, APPENDS_LIST.link.index)) {

                options.mindmap.openLink(model.id);

            }

        }

        if (model.note !== null) {

            const index = model.link === null
                ? APPENDS_LIST.link.index
                : APPENDS_LIST.note.index;

            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, index)) {

                options.mindmap.showEditNote(model.id);

            }

        }

    },
    // stop : (evt, options) => {

    //     if (options.vm.data.nodeNoteShow) {

    //         options.vm.data.nodeNoteShow = false;
    //         options.vm.data.$notePopover.toggle(false);

    //     }

    // },
    // resize : (evt, options) => {

    //     options.vm.data.$nodeNote.style.transform = `scale(${options.vm.data.nodeNoteZoom})`;

    // },
    // noteShow : (evt, options) => {

    //     options.vm.data.$nodeNote.style.pointerEvents = (options.vm.data.nodeNoteShow ? 'default' : 'none');

    // }
};
