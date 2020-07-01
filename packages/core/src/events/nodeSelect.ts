import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    EventOptions,
}                                               from '../interface';
import {
    inAnnex,
    inNodeShape,
}                                               from '../base/utils';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';
import {
    getModel,
}                                               from '../utils/G6Ext';

export default {
    select : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = getModel(evt.item);
        const children = model.folded ? model._foldedChildren : model.children;
        const group = evt.item.get('group') as IGroup;

        if (children && children.length > 0) {

            if (
                inNodeShape(
                    options.mindmap,
                    evt,
                    group.getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup)
                )
            ) {

                return;

            }

        }

        if (options.mindmap.keydownState.mod) {

            if (model._isNode && inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {

                if (evt.item.getStates().indexOf('selected') !== -1) {

                    options.mindmap.unselectNode(evt.item.get('id'));

                } else {

                    options.mindmap.selectNode(evt.item.get('id'));

                }

            }

        } else if (model._isNode && inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {

            options.mindmap.clearAndSelectNode(evt.item.get('id'));

        }

    },
    clear : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (evt.item === null) {

            options.mindmap.clearAllSelectedNode();

        } else if (!inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {

            options.mindmap.clearAllSelectedNode();

        }

    },
};
