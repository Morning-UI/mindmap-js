import { ContextMenuTypes, } from '../interface';
import { inAnnex, } from '../base/utils';
import { APPENDS_LIST, } from '../base/const';
export default {
    show: function (evt, options) {
        var _a = options.graph.getCanvasByPoint(evt.x, evt.y), canvasX = _a.x, canvasY = _a.y;
        if (evt.item) {
            var model = evt.item.getModel();
            if (!model._isNode) {
                return;
            }
            // 右键链接
            if (model.link) {
                if (inAnnex(options.mindmap, evt, APPENDS_LIST.link.index)) {
                    options.mindmap.showContextMenu({
                        type: ContextMenuTypes.Link,
                        nodeId: model.id,
                        x: canvasX,
                        y: canvasY,
                    });
                }
            }
            else {
                // TODO
                // options.mindmap.showContextMenu(model.id, canvasX, canvasY);
            }
        }
    },
    hide: function (evt, options) {
        options.mindmap.hideContextMenu(ContextMenuTypes.Link);
    }
};
