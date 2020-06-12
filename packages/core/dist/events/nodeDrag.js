import { setItemState, } from '../utils/setItemState';
import { getModel, } from '../utils/G6Ext';
export default {
    start: function (evt, options) {
        if (!evt.item.destroyed
            && !getModel(evt.item)._isRoot
            && getModel(evt.item)._isNode) {
            setItemState(options.graph, evt.item.get('id'), 'drag', true);
        }
    },
    end: function (evt, options) {
        if (!evt.item.destroyed
            && !getModel(evt.item)._isRoot
            && getModel(evt.item)._isNode) {
            setItemState(options.graph, evt.item.get('id'), 'drag', false);
        }
    },
};
