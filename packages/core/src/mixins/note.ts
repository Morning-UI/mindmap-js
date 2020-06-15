import {
    NodeIds,
    MindmapCoreL0Ctor,
    NoteFeatures,
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    getModel,
}                                               from '../utils/G6Ext';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements NoteFeatures.Mixins {

        showEditNote (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = getModel(node);
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

            this.commander.addExec({
                cmd : NoteFeatures.Commands.Note,
                opts : {
                    nodeIds,
                    note,
                },
            } as Command<NoteFeatures.Commands.Note>);

            return this;

        }

        unnote (nodeIds: NodeIds): this {

            this.commander.addExec({
                cmd : NoteFeatures.Commands.Unnote,
                opts : {
                    nodeIds,
                },
            } as Command<NoteFeatures.Commands.Unnote>);

            return this;

        }

    };
