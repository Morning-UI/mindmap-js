import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    EventOptions,
    Command,
    FoldFeatures,
    CommandOptions,
}                                               from '../interface';
import {
    inNodeShape,
}                                               from '../base/utils';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';
import {
    getModel,
}                                               from '../utils/G6Ext';

export default {
    click : (evt: IG6GraphEvent, options: EventOptions): void => {

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

                options.mindmap.commander.addExec({
                    cmd: FoldFeatures.Commands.FoldToggle,
                    opts : {
                        nodeIds : model.id,
                        fold : !model.folded,
                    },
                } as Command<FoldFeatures.Commands.FoldToggle>);

            }

        }

    },
};
