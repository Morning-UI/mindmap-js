import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    MindmapNodeItem,
    MarkSet,
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
    setItemState,
}                                               from '../utils/setItemState';
import {
    getModel,
}                                               from '../utils/G6Ext';

export default {
    move : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = getModel(evt.item);

        if (!model._isNode) {

            return;

        }

        const markTypes = Object.keys(model.mark || {}) as (keyof MarkSet)[];

        if (markTypes.length > 0) {

            let index = (markTypes.length * 4) - 4;

            while (index >= 0) {

                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.markConGroup, index)) {

                    setItemState(options.graph, evt.item.get('id'), `mark-hover:${index / 4}`, true);

                } else {

                    setItemState(options.graph, evt.item.get('id'), `mark-hover:${index / 4}`, false);

                }

                index -= 4;

            }

        }

    },
};
