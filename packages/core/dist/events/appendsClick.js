import { inAnnex, } from '../base/utils';
import { APPENDS_LIST, } from '../base/const';
export default {
    click: function (evt, options) {
        var model = evt.item.getModel();
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
};
