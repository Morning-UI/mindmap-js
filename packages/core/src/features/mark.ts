import difference                               from 'lodash.difference';
import {
    TreeGraph,
}                                               from '@antv/g6';
import {
    Item,
}                                               from '@antv/g6/lib/types';
import {
    NodeIds,
    MindmapNodeItem,
    MindmapCoreL0Ctor,
    MarkFeatures,
    MarkSet,
    MindMarksTag,
    MindMarksTask,
    MindMarksStar,
    MindMarksFlag,
    MindMarksPerson,
    MindMarks,
    MindMarksPriority,
    MindMarkTypes,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    markElementBuilder,
}                                               from '../utils/markBuilder';

const cleanTagHoverState = (graph: TreeGraph, node: Item): void => {

    const states = node.getStates();

    for (const state of states) {

        if ((/^tag-hover/u).test(state)) {

            graph.setItemState(node, state, false);

        }

    }

};

const MindMarkTypeMap: {
    [key in MindMarks]?: MindMarkTypes;
} = {};
const genMindMarkTypeMap = (type: MindMarkTypes, marks: MindMarks[]) => {

    for (const mark of marks) {

        MindMarkTypeMap[mark] = type;

    }

};

genMindMarkTypeMap('tag', Object.values(MindMarksTag));
genMindMarkTypeMap('priority', Object.values(MindMarksPriority));
genMindMarkTypeMap('task', Object.values(MindMarksTask));
genMindMarkTypeMap('star', Object.values(MindMarksStar));
genMindMarkTypeMap('flag', Object.values(MindMarksFlag));
genMindMarkTypeMap('person', Object.values(MindMarksPerson));

export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements MarkFeatures {

        showEditMark (nodeIds: NodeIds, markType: MindMarkTypes): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = node.getModel() as MindmapNodeItem;
            const bbox = node.getBBox();
            const {
                x,
                y,
            } = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY);
            const $boxEditMark = this._options.$boxEditMark;

            let $elements = null;
            
            switch (markType) {
                case MindMarkTypes.Tag :
                    $elements = markElementBuilder[markType](MindMarksTag);
                    break;
                case MindMarkTypes.Priority :
                    $elements = markElementBuilder[markType](MindMarksPriority);
                    break;
                case MindMarkTypes.Task :
                    $elements = markElementBuilder[markType](MindMarksTask);
                    break;
                case MindMarkTypes.Star :
                    $elements = markElementBuilder[markType](MindMarksStar);
                    break;
                case MindMarkTypes.Flag :
                    $elements = markElementBuilder[markType](MindMarksFlag);
                    break;
                case MindMarkTypes.Person :
                    $elements = markElementBuilder[markType](MindMarksPerson);
                    break;
            }

            let boxEditMarkWidth = 0;

            this.currentEditMarkNodeIds = nodeIds;
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
            $boxEditMark.querySelector('ul').innerHTML = '';
            $boxEditMark.style.display = 'none';

            return this;

        }

        getCurrentEditMarkNodeIds (): NodeIds {

            return this.currentEditMarkNodeIds;

        }

        mark (nodeIds: NodeIds, mark: MindMarks): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                if (model.mark === null) {

                    model.mark = {};

                }

                const markType = MindMarkTypeMap[mark];

                switch (markType) {
                    case MindMarkTypes.Tag :
                        model.mark.tag = mark as MindMarksTag;
                        break;
                    case MindMarkTypes.Priority :
                        model.mark.priority = mark as MindMarksPriority;
                        break;
                    case MindMarkTypes.Task :
                        model.mark.task = mark as MindMarksTask;
                        break;
                    case MindMarkTypes.Star :
                        model.mark.star = mark as MindMarksStar;
                        break;
                    case MindMarkTypes.Flag :
                        model.mark.flag = mark as MindMarksFlag;
                        break;
                    case MindMarkTypes.Person :
                        model.mark.person = mark as MindMarksPerson;
                        break;
                }

                // model.mark = arrayUniq(model.mark);
                // traverseNodeUpdateMark(model);
                node.draw();

            }

            this.graph.layout();

            return this;

        },

        // tagAdd (nodeIds: NodeIds, tags: string[]|string): this {

        //     const ids = fillNodeIds(nodeIds);

        //     let _tags = typeof tags === 'string' ? [tags] : tags;

        //     _tags = difference(_tags, ['']);

        //     for (const id of ids) {

        //         const node = this.graph.findById(id);
        //         const model = node.getModel() as MindmapNodeItem;

        //         model.tag = Object.assign([], model.tag).concat(_tags);
        //         node.draw();

        //     }

        //     this.graph.layout();
        //     return this;

        // }

        // untag (nodeIds: NodeIds, untags: string[]|string): this {

        //     const ids = fillNodeIds(nodeIds);

        //     let _untags = typeof untags === 'string' ? [untags] : untags;

        //     _untags = difference(_untags, ['']);

        //     for (const id of ids) {

        //         const node = this.graph.findById(id);
        //         const model = node.getModel() as MindmapNodeItem;

        //         model.tag = difference(model.tag, _untags);
        //         cleanTagHoverState(this.graph, node);
        //         node.draw();

        //     }

        //     this.graph.layout();
        //     return this;

        // }

        // untagByIndex (nodeIds: NodeIds, index: number): this {

        //     const ids = fillNodeIds(nodeIds);

        //     for (const id of ids) {

        //         const node = this.graph.findById(id);
        //         const model = node.getModel() as MindmapNodeItem;

        //         model.tag.splice(index, 1);
        //         cleanTagHoverState(this.graph, node);
        //         node.draw();

        //     }

        //     this.graph.layout();
        //     return this;

        // }

    };
