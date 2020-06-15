import {
    TreeGraph,
}                                               from '@antv/g6';
import {
    Item,
}                                               from '@antv/g6/lib/types';
import {
    NodeIds,
    MindmapCoreL0Ctor,
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
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements MarkFeatures.Mixins {

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

            let boxEditMarkWidth = 0;

            this.currentEditMarkNodeIds = nodeIds;
            this.currentEditMarkValue = model.mark[markType];
            $boxEditMark.querySelector('ul').append(...$elements);
            $boxEditMark.style.display = 'block';
            boxEditMarkWidth = $boxEditMark.clientWidth;
            $boxEditMark.style.left = `${x - (boxEditMarkWidth / 2)}px`;
            $boxEditMark.style.top = `${y}px`;

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

        getCurrentEditMarkNodeIds (): NodeIds {

            return this.currentEditMarkNodeIds;

        }

        getCurrentEditMarkValue (): MindMark {

            return this.currentEditMarkValue;

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
