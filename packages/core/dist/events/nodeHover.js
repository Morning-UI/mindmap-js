export default {
    in: function (evt, options) {
        var model = evt.item.getModel();
        if (model._isNode) {
            options.graph.setItemState(evt.item, 'hover', true);
        }
    },
    out: function (evt, options) {
        var model = evt.item.getModel();
        if (model._isNode) {
            options.graph.setItemState(evt.item, 'hover', false);
        }
    },
};
