var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { NoteFeatures, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.showEditNote = function (nodeIds) {
            var ids = fillNodeIds(nodeIds);
            var node = this.graph.findById(ids[0]);
            var model = getModel(node);
            var bbox = node.getBBox();
            var _a = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY), x = _a.x, y = _a.y;
            var $boxEditNote = this._options.$boxEditNote;
            var $boxEditNoteInput = $boxEditNote.querySelector('textarea');
            var boxEditNoteWidth = 0;
            this.currentEditNoteNodeIds = nodeIds;
            $boxEditNote.style.display = 'block';
            boxEditNoteWidth = $boxEditNote.clientWidth;
            $boxEditNote.style.left = x - (boxEditNoteWidth / 2) + "px";
            $boxEditNote.style.top = y + "px";
            $boxEditNoteInput.value = model.note;
            // this.data.currentEditLinkValue = model.link;
            // this.data.$editLinkDialog.toggle(true);
            // this.data.mouseOnCanvas = false;
            return this;
        };
        class_1.prototype.hideEditNote = function () {
            var $boxEditNote = this._options.$boxEditNote;
            this.currentEditNoteNodeIds = [];
            $boxEditNote.style.display = 'none';
            return this;
        };
        class_1.prototype.getCurrentEditNoteNodeIds = function () {
            return this.currentEditNoteNodeIds;
        };
        class_1.prototype.note = function (nodeIds, note) {
            this.commander.addExec({
                cmd: NoteFeatures.Commands.Note,
                opts: {
                    nodeIds: nodeIds,
                    note: note,
                },
            });
            return this;
        };
        class_1.prototype.unnote = function (nodeIds) {
            this.commander.addExec({
                cmd: NoteFeatures.Commands.Unnote,
                opts: {
                    nodeIds: nodeIds,
                },
            });
            return this;
        };
        return class_1;
    }(Base));
});
