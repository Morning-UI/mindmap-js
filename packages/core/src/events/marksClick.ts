import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    MindmapNodeItem,
    MindMarkTypes,
    MarkSet,
}                                               from '../interface';
import {
    inAnnex,
}                                               from '../base/utils';
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

        const markTypes = Object.keys(model.mark || {}) as (keyof MarkSet)[];

        if (markTypes.length > 0) {

            let index = (markTypes.length * 4) - 4;

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
