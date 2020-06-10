import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    EventOptions,
    MindmapNodeItem,
}                                               from '../interface';
import {
    inNodeShape,
}                                               from '../base/utils';
import {
    APPENDS_LIST,
}                                               from '../base/const';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';

export default {
    click : (evt: IG6GraphEvent, options: EventOptions): void => {

        const model = evt.item.getModel() as MindmapNodeItem;
        const children = model._isFolded ? model._foldedChildren : model.children;
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

                options.mindmap.fold(model.id, !model._isFolded);

            }

        }

    },
};
