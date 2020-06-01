import { inNodeShape, } from '../base/utils';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { refreshTextEditorPosition, } from '../base/editor';
export default {
    edit: function (evt, options) {
        var group = evt.item.get('group');
        // 如果点击非text区域不进入编辑
        if (!inNodeShape(options.mindmap, evt, group.getChildByIndex(NODE_SHAPE_INDEX.text))) {
            return;
        }
        group.toFront();
        options.mindmap.focusNodeTextEditor(evt.item.getModel().id);
    },
    refresh: function (evt, options) {
        if (options.mindmap.editting) {
            refreshTextEditorPosition(options.mindmap);
        }
    },
    cancel: function (evt, options) {
        if (options.mindmap.editting
            && options.mindmap.editNode !== evt.item) {
            options.mindmap.blurNodeTextEditor();
        }
    },
    zoom: function (evt, options) {
        options.mindmap._options.$editor.style.transform = "scale(" + options.mindmap.editZoom + ")";
    },
};
