// import {
//     NODE_SHAPE_INDEX
// }                                   from '../nodes/mindNode';
// import {
//     inNodeShape,
// }                                   from '../base/utils';

import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    MindmapNodeItem,
}                                               from '../interface';

export default {
    select : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = evt.item.getModel() as MindmapNodeItem;
        // const children = model._collapsed ? model._collapsedChildren : model.children;

        // if (children && children.length > 0) {

        //     if (inNodeShape(options.vm, evt, evt.item.get('group').getChildByIndex(NODE_SHAPE_INDEX.collapseBtnGroup))) {

        //         return;

        //     }

        // }

        if (options.mindmap.keydownState.mod) {

            if (model._isNode) {

                if (evt.item.getStates().indexOf('selected') !== -1) {

                    options.graph.setItemState(evt.item, 'selected', false);

                } else {

                    options.graph.setItemState(evt.item, 'selected', true);

                }

            }

        } else {

            options.mindmap.clearSelectedNode();

            if (model._isNode) {

                options.graph.setItemState(evt.item, 'selected', true);

            }

        }

    },
    clear : (evt: IG6GraphEvent, options: EventOptions): void => {

        options.mindmap.clearSelectedNode();

    },
};
