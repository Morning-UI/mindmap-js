// import {
//     NODE_SHAPE_INDEX
// }                                   from '../nodes/mindNode';
// import {
//     inNodeShape,
// }                                   from '../base/utils';
import { inAnnex, inNodeShape, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { setItemState, } from '../utils/setItemState';
import { getModel, } from '../utils/G6Ext';
export default {
    select: function (evt, options) {
        var model = getModel(evt.item);
        var children = model.folded ? model._foldedChildren : model.children;
        var group = evt.item.get('group');
        if (children && children.length > 0) {
            if (inNodeShape(options.mindmap, evt, group.getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup))) {
                return;
            }
        }
        if (options.mindmap.keydownState.mod) {
            if (model._isNode && inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {
                if (evt.item.getStates().indexOf('selected') !== -1) {
                    setItemState(options.graph, evt.item.get('id'), 'selected', false);
                }
                else {
                    setItemState(options.graph, evt.item.get('id'), 'selected', true);
                }
            }
        }
        else {
            options.mindmap.clearSelectedNode();
            if (model._isNode && inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {
                setItemState(options.graph, evt.item.get('id'), 'selected', true);
            }
        }
    },
    clear: function (evt, options) {
        if (evt.item === null) {
            options.mindmap.clearSelectedNode();
        }
        else if (!inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {
            options.mindmap.clearSelectedNode();
        }
    },
};
