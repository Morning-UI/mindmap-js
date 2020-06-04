import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
}                                               from '../interface';

export default {
    start : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (
            !evt.item.destroyed
            && !evt.item.getModel()._isRoot
            && evt.item.getModel()._isNode
        ) {

            options.graph.setItemState(evt.item, 'drag', true);

        }

    },
    end : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (
            !evt.item.destroyed
            && !evt.item.getModel()._isRoot
            && evt.item.getModel()._isNode) {

            options.graph.setItemState(evt.item, 'drag', false);

        }

    },
};
