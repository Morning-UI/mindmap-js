import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    EventOptions,
    ContextMenuTypes,
    // MindmapNodeItem,
}                                               from '../interface';
import {
    inAnnex,
}                                               from '../base/utils';
import {
    APPENDS_LIST,
}                                               from '../base/const';

export default {
    show : (evt: IG6GraphEvent, options: EventOptions): void => {

        const {
            x : canvasX,
            y : canvasY,
        } = options.graph.getCanvasByPoint(evt.x, evt.y);

        if (evt.item) {

            const model = evt.item.getModel();

            if (!model._isNode) {

                return;

            }

            // 右键链接
            if (model.link) {

                if (inAnnex(options.mindmap, evt, APPENDS_LIST.link.index)) {

                    options.mindmap.showContextMenu({
                        type : ContextMenuTypes.Link,
                        nodeId : model.id,
                        x : canvasX,
                        y : canvasY,
                    });

                }

            } else {
                // TODO
                // options.mindmap.showContextMenu(model.id, canvasX, canvasY);

            }

        }

    },
    hide : (evt: IG6GraphEvent, options: EventOptions): void => {

        options.mindmap.hideContextMenu(ContextMenuTypes.Link);

    }
};
