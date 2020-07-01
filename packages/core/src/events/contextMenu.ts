import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    ContextMenuTypes,
    MindmapNodeItems,
    MindmapNodeItem,
}                                               from '../interface';
import {
    inAnnex,
}                                               from '../base/utils';
import {
    APPENDS_LIST,
}                                               from '../base/const';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';
import {
    getModel,
}                                               from '../utils/G6Ext';

export default {
    show : (evt: IG6GraphEvent, options: EventOptions): void => {

        const {
            x : canvasX,
            y : canvasY,
        } = options.graph.getCanvasByPoint(evt.x, evt.y);

        if (evt.item) {

            const model = getModel(evt.item);

            if (!model._isNode) {

                return;

            }

            // 右键链接
            if (model.link !== null) {

                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, APPENDS_LIST.link.index)) {

                    options.mindmap.showContextMenu({
                        type : ContextMenuTypes.Link,
                        nodeIds : model.id,
                        x : canvasX,
                        y : canvasY,
                    });

                }

            }

            if (model.note !== null) {

                const noteIndex = model.link === null
                    ? APPENDS_LIST.link.index
                    : APPENDS_LIST.note.index;

                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, noteIndex)) {

                    options.mindmap.showContextMenu({
                        type : ContextMenuTypes.Note,
                        nodeIds : model.id,
                        x : canvasX,
                        y : canvasY,
                    });

                }

            }

            if (model.tag !== null) {

                let index = (model.tag.length * 2) - 2;

                while (index >= 0) {

                    if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.tagConGroup, index)) {

                        const node = options.mindmap.getNode(model.id) as MindmapNodeItem;

                        options.mindmap.showContextMenu({
                            type : ContextMenuTypes.Tag,
                            nodeIds : model.id,
                            x : canvasX,
                            y : canvasY,
                            data : {
                                tag : node.tag[index / 2],
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
    hide : (evt: IG6GraphEvent, options: EventOptions): void => {

        options.mindmap.hideContextMenu();
        options.mindmap._options.$canvas.querySelector('canvas').style.cursor = 'move';

    },
};
