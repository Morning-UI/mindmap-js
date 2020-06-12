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
    TAG,
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

        if (model.tag !== null) {

            let index = (model.tag.length * 2) - 2;

            while (index >= 0) {

                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.tagConGroup, index)) {

                    setItemState(options.graph, evt.item.get('id'), `${TAG.state}:${index / 2}`, true);

                } else {

                    setItemState(options.graph, evt.item.get('id'), `${TAG.state}:${index / 2}`, false);

                }

                index -= 2;

            }

        }

    },
};