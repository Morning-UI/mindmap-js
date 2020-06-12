import { ContextMenuTypes, } from '../interface';
import { inAnnex, } from '../base/utils';
import { APPENDS_LIST, } from '../base/const';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { getModel, } from '../utils/G6Ext';
export default {
    show: function (evt, options) {
        var _a = options.graph.getCanvasByPoint(evt.x, evt.y), canvasX = _a.x, canvasY = _a.y;
        if (evt.item) {
            var model = getModel(evt.item);
            if (!model._isNode) {
                return;
            }
            // 右键链接
            if (model.link !== null) {
                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, APPENDS_LIST.link.index)) {
                    options.mindmap.showContextMenu({
                        type: ContextMenuTypes.Link,
                        nodeId: model.id,
                        x: canvasX,
                        y: canvasY,
                    });
                }
            }
            if (model.note !== null) {
                var noteIndex = model.link === null
                    ? APPENDS_LIST.link.index
                    : APPENDS_LIST.note.index;
                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, noteIndex)) {
                    options.mindmap.showContextMenu({
                        type: ContextMenuTypes.Note,
                        nodeId: model.id,
                        x: canvasX,
                        y: canvasY,
                    });
                }
            }
            if (model.tag !== null) {
                var index = (model.tag.length * 2) - 2;
                while (index >= 0) {
                    if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.tagConGroup, index)) {
                        options.mindmap.showContextMenu({
                            type: ContextMenuTypes.Tag,
                            nodeId: model.id,
                            x: canvasX,
                            y: canvasY,
                            data: {
                                tagIndex: index / 2,
                            },
                        });
                        break;
                        // options.graph.setItemState(evt.item, `${TAG.state}:${index / 2}`, true);
                    }
                    index -= 2;
                }
            }
        }
    },
    hide: function (evt, options) {
        options.mindmap.hideContextMenu();
        options.mindmap._options.$canvas.querySelector('canvas').style.cursor = 'move';
    },
};
