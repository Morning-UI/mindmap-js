import {
    TreeGraph,
}                                               from '@antv/g6';
import {
    Item,
}                                               from '@antv/g6/lib/types';
import {
    NodeIds,
    MarkFeatures,
    MindMarksTag,
    MindMarksTask,
    MindMarksStar,
    MindMarksFlag,
    MindMarksPerson,
    MindMark,
    MindMarksPriority,
    MindMarkTypes,
    Command,
    ContextMenuTypes,
    MindmapCoreL1Ctor,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    markElementBuilder,
}                                               from '../utils/markBuilder';
import {
    getModel,
}                                               from '../utils/G6Ext';

const MindMarkTypeMap: {
    [key in MindMark]?: MindMarkTypes;
} = {};
const genMindMarkTypeMap = (type: MindMarkTypes, marks: MindMark[]): void => {

    for (const mark of marks) {

        MindMarkTypeMap[mark] = type;

    }

};

genMindMarkTypeMap(MindMarkTypes.Tag, Object.values(MindMarksTag));
genMindMarkTypeMap(MindMarkTypes.Priority, Object.values(MindMarksPriority));
genMindMarkTypeMap(MindMarkTypes.Task, Object.values(MindMarksTask));
genMindMarkTypeMap(MindMarkTypes.Star, Object.values(MindMarksStar));
genMindMarkTypeMap(MindMarkTypes.Flag, Object.values(MindMarksFlag));
genMindMarkTypeMap(MindMarkTypes.Person, Object.values(MindMarksPerson));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
    class extends Base implements MarkFeatures.Mixins {

        boxActionMarkEdit (evt: MouseEvent): void {

            const $target = evt.target as HTMLElement;
            const markValue = $target.getAttribute('mark-value') as MindMark;

            this.mark(this.getContextNodeIds(), markValue);

        }

        boxActionMarkDelete (): void {

            this.unmark(this.getContextNodeIds(), this.getContextData());
            this.hideContextMenu();

        }

        showEditMark (nodeIds: NodeIds, markType: MindMarkTypes): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = getModel(node);
            const bbox = node.getBBox();
            const {
                x,
                y,
            } = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY);
            const $boxEditMark = this._options.$boxEditMark;

            let $elements = null;

            switch (markType) {

                case MindMarkTypes.Tag:
                    $elements = markElementBuilder[markType](MindMarksTag);
                    break;
                case MindMarkTypes.Priority:
                    $elements = markElementBuilder[markType](MindMarksPriority);
                    break;
                case MindMarkTypes.Task:
                    $elements = markElementBuilder[markType](MindMarksTask);
                    break;
                case MindMarkTypes.Star:
                    $elements = markElementBuilder[markType](MindMarksStar);
                    break;
                case MindMarkTypes.Flag:
                    $elements = markElementBuilder[markType](MindMarksFlag);
                    break;
                case MindMarkTypes.Person:
                    $elements = markElementBuilder[markType](MindMarksPerson);
                    break;
                default:
                    break;

            }

            $boxEditMark.querySelector('ul').innerHTML = '';
            $boxEditMark.querySelector('ul').append(...$elements);

            this.showContextMenu({
                type : ContextMenuTypes.MarkEditor,
                nodeIds,
                x,
                y,
                data : model.mark[markType],
            });

            return this;

        }

        hideEditMark (): this {

            const $boxEditMark = this._options.$boxEditMark;

            this.currentEditMarkNodeIds = [];
            this.currentEditMarkValue = null;
            $boxEditMark.querySelector('ul').innerHTML = '';
            $boxEditMark.style.display = 'none';

            return this;

        }

        mark (nodeIds: NodeIds, mark: MindMark): this {

            this.commander.addExec({
                cmd : MarkFeatures.Commands.Mark,
                opts : {
                    nodeIds,
                    mark,
                },
            } as Command<MarkFeatures.Commands.Mark>);

            return this;

        }

        unmark (nodeIds: NodeIds, mark: MindMark): this {

            this.commander.addExec({
                cmd : MarkFeatures.Commands.Unmark,
                opts : {
                    nodeIds,
                    mark,
                },
            } as Command<MarkFeatures.Commands.Unmark>);

            return this;

        }

    };
