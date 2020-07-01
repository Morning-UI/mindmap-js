import {
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

export const mark: MarkFeatures.Mark = (options) => {

    const {
        mindmap,
        nodeIds,
        mark : _mark,
    } = options;
    const ids = fillNodeIds(nodeIds);
    const marks = Array.isArray(_mark) ? _mark : [_mark];

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        if (model.mark === null) {

            model.mark = {};

        }

        for (const oneMark of marks) {

            const markType = MindMarkTypeMap[oneMark];

            switch (markType) {

                case MindMarkTypes.Tag:
                    model.mark.tag = oneMark as MindMarksTag;
                    break;
                case MindMarkTypes.Priority:
                    model.mark.priority = oneMark as MindMarksPriority;
                    break;
                case MindMarkTypes.Task:
                    model.mark.task = oneMark as MindMarksTask;
                    break;
                case MindMarkTypes.Star:
                    model.mark.star = oneMark as MindMarksStar;
                    break;
                case MindMarkTypes.Flag:
                    model.mark.flag = oneMark as MindMarksFlag;
                    break;
                case MindMarkTypes.Person:
                    model.mark.person = oneMark as MindMarksPerson;
                    break;
                default:
                    break;

            }

        }

        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '设置标签',
        undoCmd : {
            cmd : MarkFeatures.Commands.Unmark,
            opts : {
                nodeIds,
                mark : marks,
            },
        } as Command<MarkFeatures.Commands.Unmark>,
    };

};

export const unmark: MarkFeatures.Unmark = (options) => {

    const {
        mindmap,
        nodeIds,
        mark : _mark,
    } = options;
    const ids = fillNodeIds(nodeIds);
    const undoCmds: Command<MarkFeatures.Commands.Mark>[] = [];
    const marks = Array.isArray(_mark) ? _mark : [_mark];

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);
        // const index = model.mark.indexOf(mark);

        if (_mark === undefined) {

            // 若_mark没有入参，则清除所有mark
            const markValues = Object.values(model.mark);

            model.mark = null;
            undoCmds.push({
                cmd : MarkFeatures.Commands.Mark,
                opts : {
                    nodeIds : id,
                    mark : markValues,
                },
            });

        } else if (model.mark !== null) {

            // 若原本节点需要有mark数据，才进行删除操作
            for (const oneMark of marks) {

                const markType = MindMarkTypeMap[oneMark];

                delete model.mark[markType];

            }

            undoCmds.push({
                cmd : MarkFeatures.Commands.Mark,
                opts : {
                    nodeIds : id,
                    mark : _mark,
                },
            });

        }

        // traverseNodeUpdateMark(model);
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '删除标签',
        undoCmd : undoCmds,
    };

};
