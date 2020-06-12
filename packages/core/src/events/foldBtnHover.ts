import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    INode,
}                                               from '@antv/g6/lib/interface/item';
import {
    EventOptions,
}                                               from '../interface';
import {
    inNodeShape,
}                                               from '../base/utils';
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
        const children = model.folded ? model._foldedChildren : model.children;
        const group = evt.item.get('group') as IGroup;

        if (!model._isNode) {

            return;

        }

        if (children && children.length > 0) {

            if (
                inNodeShape(
                    options.mindmap,
                    evt,
                    group.getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup)
                )
            ) {

                setItemState(options.graph, evt.item.get('id'), 'fold-btn-hover', true);

            } else {

                setItemState(options.graph, evt.item.get('id'), 'fold-btn-hover', false);

            }

        }

    },
    stop : (evt: IG6GraphEvent, options: EventOptions): void => {

        const hoverFoldBtn = options.graph.findAllByState<INode>('node', 'fold-btn-hover');

        if (hoverFoldBtn && hoverFoldBtn.length > 0) {

            for (const btn of hoverFoldBtn) {

                setItemState(options.graph, btn.get('id'), 'fold-btn-hover', false);

            }

        }

    },
};
