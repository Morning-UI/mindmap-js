import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
}                                               from '../interface';
import {
    setItemState,
}                                               from '../utils/setItemState';
import {
    getModel,
}                                               from '../utils/G6Ext';

export default {
    start : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (
            !evt.item.destroyed
            && !getModel(evt.item)._isRoot
            && getModel(evt.item)._isNode
        ) {

            setItemState(options.graph, evt.item.get('id'), 'drag', true);

        }

    },
    end : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (
            !evt.item.destroyed
            && !getModel(evt.item)._isRoot
            && getModel(evt.item)._isNode
        ) {

            setItemState(options.graph, evt.item.get('id'), 'drag', false);

        }

    },
};
