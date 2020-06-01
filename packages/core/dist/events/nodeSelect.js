// import {
//     NODE_SHAPE_INDEX
// }                                   from '../nodes/mindNode';
// import {
//     inNodeShape,
// }                                   from '../base/utils';
export default {
    select: function (evt, options) {
        var model = evt.item.getModel();
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
                }
                else {
                    options.graph.setItemState(evt.item, 'selected', true);
                }
            }
        }
        else {
            options.mindmap.clearSelectedNode();
            if (model._isNode) {
                options.graph.setItemState(evt.item, 'selected', true);
            }
        }
    },
    clear: function (evt, options) {
        options.mindmap.clearSelectedNode();
    },
};
