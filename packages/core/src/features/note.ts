import {
    NodeIds,
    MindmapNodeItem,
    MindmapCoreL0Ctor,
    NoteFeatures,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements NoteFeatures {

        showEditNote (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = node.getModel() as MindmapNodeItem;
            const bbox = node.getBBox();
            const {
                x,
                y,
            } = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY);
            const $boxEditNote = this._options.$boxEditNote;
            const $boxEditNoteInput = $boxEditNote.querySelector('textarea');

            let boxEditNoteWidth = 0;

            this.currentEditNoteNodeIds = nodeIds;
            $boxEditNote.style.display = 'block';
            boxEditNoteWidth = $boxEditNote.clientWidth;
            $boxEditNote.style.left = `${x - (boxEditNoteWidth / 2)}px`;
            $boxEditNote.style.top = `${y}px`;
            $boxEditNoteInput.value = model.note;
            // this.data.currentEditLinkValue = model.link;
            // this.data.$editLinkDialog.toggle(true);
            // this.data.mouseOnCanvas = false;
            return this;

        }

        hideEditNote (): this {

            const $boxEditNote = this._options.$boxEditNote;

            this.currentEditNoteNodeIds = [];
            $boxEditNote.style.display = 'none';
            return this;

        }

        getCurrentEditNoteNodeIds (): NodeIds {

            return this.currentEditNoteNodeIds;

        }

        note (nodeIds: NodeIds, note: string): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                model.note = note;
                // TODO: 启用draw后编辑链接后，appends宽度会改变
                // node.draw();

            }

            this.graph.layout();
            return this;

        }

        unnote (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                model.note = null;
                node.draw();

            }

            this.graph.layout();
            return this;

        }

    };
