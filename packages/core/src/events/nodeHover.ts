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
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';

export default {
    move : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = evt.item.getModel() as MindmapNodeItem;

        if (model._isNode) {

            if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {

                options.graph.setItemState(evt.item, 'hover', true);

            } else {

                options.graph.setItemState(evt.item, 'hover', false);

            }

        }

    },
};
