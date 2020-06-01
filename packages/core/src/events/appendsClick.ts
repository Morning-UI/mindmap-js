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

export default {
    click : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = evt.item.getModel();

        if (!model._isNode) {

            return;

        }

        if (model.link) {

            if (inAnnex(options.mindmap, evt, APPENDS_LIST.link.index)) {

                options.mindmap.showLink(model.id);

            }

        }

        // if (model.note) {

        //     let indexOfAppends = model.link ? APPENDS_LIST.note.index : APPENDS_LIST.link.index;

        //     if (inAnnex(options.vm, evt, indexOfAppends)) {

        //         options.vm.showNote(model.id);

        //     } else {

        //         options.vm.hideNote(model.id);

        //     }

        // }

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
