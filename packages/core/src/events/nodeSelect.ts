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
import {
    inAnnex,
}                                               from '../base/utils';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';

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

            if (model._isNode && inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {

                if (evt.item.getStates().indexOf('selected') !== -1) {

                    options.graph.setItemState(evt.item, 'selected', false);

                } else {

                    options.graph.setItemState(evt.item, 'selected', true);

                }

            }

        } else {

            options.mindmap.clearSelectedNode();

            if (model._isNode && inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {

                options.graph.setItemState(evt.item, 'selected', true);

            }

        }

    },
    clear : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (evt.item === null) {

            options.mindmap.clearSelectedNode();

        } else if (!inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {

            options.mindmap.clearSelectedNode();

        }

    },
};
