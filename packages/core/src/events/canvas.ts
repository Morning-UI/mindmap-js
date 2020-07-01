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
    focus : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (options.mindmap.focus === false) {

            options.mindmap.focus = true;

        }

    },
    blur : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (options.mindmap.focus === true) {

            options.mindmap.focus = false;

        }

    },
};
