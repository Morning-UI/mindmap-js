import {
    NodeIds,
    NoteFeatures,
    Command,
    MindmapCoreL1Ctor,
    ContextMenuTypes,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    getModel,
}                                               from '../utils/G6Ext';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
    class extends Base implements NoteFeatures.Mixins {

        menuItemNoteEdit (): void {

            this.showEditNote(this.getContextNodeIds());

        }

        menuItemNoteDelete (): void {

            this.unnote(this.getContextNodeIds());
            this.hideContextMenu();

        }

        showEditNote (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = getModel(node);
            const bbox = node.getBBox();
            const {
                x,
                y,
            } = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY);

            this.showContextMenu({
                type : ContextMenuTypes.NoteEditor,
                nodeIds,
                x,
                y,
                data : model.note,
                hiddenCallback : this.note,
            });

            return this;

        }

        hideEditNote (): this {

            return this.hideContextMenu();

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
                cmd : NoteFeatures.Commands.Note,
                opts : {
                    nodeIds,
                    note : null,
                },
            } as Command<NoteFeatures.Commands.Note>);

            return this;

        }

    };
