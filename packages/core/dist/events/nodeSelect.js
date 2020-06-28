import { inAnnex, inNodeShape, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
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
                    options.mindmap.unselectNode(evt.item.get('id'));
                }
                else {
                    options.mindmap.selectNode(evt.item.get('id'));
                }
            }
        }
        else if (model._isNode && inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {
            options.mindmap
                .commandNewGroup()
                .clearAllSelectedNode()
                .selectNode(evt.item.get('id'))
                .commandExecGroup();
        }
    },
    clear: function (evt, options) {
        if (evt.item === null) {
            options.mindmap.clearAllSelectedNode();
        }
        else if (!inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.con, null)) {
            options.mindmap.clearAllSelectedNode();
        }
    },
};
