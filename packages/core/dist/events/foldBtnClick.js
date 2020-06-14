import { FoldFeatures, } from '../interface';
import { inNodeShape, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { getModel, } from '../utils/G6Ext';
export default {
    click: function (evt, options) {
        var model = getModel(evt.item);
        var children = model.folded ? model._foldedChildren : model.children;
        var group = evt.item.get('group');
        if (!model._isNode) {
            return;
        }
        if (children && children.length > 0) {
            if (inNodeShape(options.mindmap, evt, group.getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup))) {
                options.mindmap.commander.addExec({
                    cmd: FoldFeatures.Commands.FoldToggle,
                    opts: {
                        nodeIds: model.id,
                        fold: !model.folded,
                    },
                });
            }
        }
    },
};
