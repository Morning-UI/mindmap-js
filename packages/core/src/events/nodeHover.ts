import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    MindmapNodeItem,
}                                               from '../interface';

export default {
    in : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = evt.item.getModel() as MindmapNodeItem;
        if (model._isNode) {

            options.graph.setItemState(evt.item, 'hover', true);

        }

    },
    out : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = evt.item.getModel() as MindmapNodeItem;
        if (model._isNode) {

            options.graph.setItemState(evt.item, 'hover', false);

        }

    },
};
