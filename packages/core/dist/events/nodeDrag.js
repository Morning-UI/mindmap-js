export default {
    start: function (evt, options) {
        if (!evt.item.destroyed
            && !evt.item.getModel()._isRoot
            && evt.item.getModel()._isNode) {
            options.graph.setItemState(evt.item, 'drag', true);
        }
    },
    end: function (evt, options) {
        if (!evt.item.destroyed
            && !evt.item.getModel()._isRoot
            && evt.item.getModel()._isNode) {
            options.graph.setItemState(evt.item, 'drag', false);
        }
    },
};
