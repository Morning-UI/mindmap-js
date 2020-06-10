import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    ContextMenuTypes,
    MindmapNodeItem,
    // MindmapNodeItem,
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

export default {
    show : (evt: IG6GraphEvent, options: EventOptions): void => {

        const {
            x : canvasX,
            y : canvasY,
        } = options.graph.getCanvasByPoint(evt.x, evt.y);

        if (evt.item) {

            const model = evt.item.getModel() as MindmapNodeItem;

            if (!model._isNode) {

                return;

            }

            // 右键链接
            if (model.link !== null) {

                if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.appendConGroup, APPENDS_LIST.link.index)) {

                    options.mindmap.showContextMenu({
                        type : ContextMenuTypes.Link,
                        nodeId : model.id,
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
                        nodeId : model.id,
                        x : canvasX,
                        y : canvasY,
                    });

                }

            }

            if (model.tag !== null) {

                let index = (model.tag.length * 2) - 2;

                while (index >= 0) {

                    if (inAnnex(options.mindmap, evt, NODE_SHAPE_INDEX.tagConGroup, index)) {

                        options.mindmap.showContextMenu({
                            type : ContextMenuTypes.Tag,
                            nodeId : model.id,
                            x : canvasX,
                            y : canvasY,
                            data : {
                                tagIndex : index / 2,
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
