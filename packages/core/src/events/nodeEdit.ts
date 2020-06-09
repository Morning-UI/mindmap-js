import {
    IG6GraphEvent,
}                                               from '@antv/g6/lib/types';
import {
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    EventOptions,
}                                               from '../interface';
import {
    inNodeShape,
}                                               from '../base/utils';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';
import {
    refreshTextEditorPosition,
}                                               from '../base/editor';

export default {
    edit : (evt: IG6GraphEvent, options: EventOptions): void => {

        const group = evt.item.get('group') as IGroup;

        // 如果点击非text区域不进入编辑
        if (
            !inNodeShape(
                options.mindmap,
                evt,
                group.getChildByIndex(NODE_SHAPE_INDEX.text),
            )
        ) {

            return;

        }

        group.toFront();
        console.log(123555);
        options.mindmap.focusNodeTextEditor(evt.item.getModel().id);

    },
    refresh : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (options.mindmap.editting) {

            refreshTextEditorPosition(options.mindmap);

        }

    },
    cancel : (evt: IG6GraphEvent, options: EventOptions): void => {

        if (options.mindmap.editting
            && options.mindmap.editNode !== evt.item) {

            options.mindmap.blurNodeTextEditor();

        }

    },
    zoom : (evt: IG6GraphEvent, options: EventOptions): void => {

        options.mindmap._options.$editor.style.transform = `scale(${options.mindmap.editZoom})`;

    },
};
