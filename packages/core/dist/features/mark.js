import { MarkFeatures, MindMarksTag, MindMarksTask, MindMarksStar, MindMarksFlag, MindMarksPerson, MindMarksPriority, MindMarkTypes, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { getModel, } from '../utils/G6Ext';
var MindMarkTypeMap = {};
var genMindMarkTypeMap = function (type, marks) {
    for (var _i = 0, marks_1 = marks; _i < marks_1.length; _i++) {
        var mark_1 = marks_1[_i];
        MindMarkTypeMap[mark_1] = type;
    }
};
genMindMarkTypeMap(MindMarkTypes.Tag, Object.values(MindMarksTag));
genMindMarkTypeMap(MindMarkTypes.Priority, Object.values(MindMarksPriority));
genMindMarkTypeMap(MindMarkTypes.Task, Object.values(MindMarksTask));
genMindMarkTypeMap(MindMarkTypes.Star, Object.values(MindMarksStar));
genMindMarkTypeMap(MindMarkTypes.Flag, Object.values(MindMarksFlag));
genMindMarkTypeMap(MindMarkTypes.Person, Object.values(MindMarksPerson));
export var mark = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, _mark = options.mark;
    var ids = fillNodeIds(nodeIds);
    var marks = Array.isArray(_mark) ? _mark : [_mark];
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        if (model.mark === null) {
            model.mark = {};
        }
        for (var _a = 0, marks_2 = marks; _a < marks_2.length; _a++) {
            var oneMark = marks_2[_a];
            var markType = MindMarkTypeMap[oneMark];
            switch (markType) {
                case MindMarkTypes.Tag:
                    model.mark.tag = oneMark;
                    break;
                case MindMarkTypes.Priority:
                    model.mark.priority = oneMark;
                    break;
                case MindMarkTypes.Task:
                    model.mark.task = oneMark;
                    break;
                case MindMarkTypes.Star:
                    model.mark.star = oneMark;
                    break;
                case MindMarkTypes.Flag:
                    model.mark.flag = oneMark;
                    break;
                case MindMarkTypes.Person:
                    model.mark.person = oneMark;
                    break;
                default:
                    break;
            }
        }
        // model.mark = arrayUniq(model.mark);
        // traverseNodeUpdateMark(model);
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '添加标签',
        undoCmd: {
            cmd: MarkFeatures.Commands.Unmark,
            opts: {
                nodeIds: nodeIds,
                mark: marks,
            },
        },
    };
};
export var unmark = function (options) {
    var mindmap = options.mindmap, nodeIds = options.nodeIds, _mark = options.mark;
    var ids = fillNodeIds(nodeIds);
    var undoCmds = [];
    var marks = Array.isArray(_mark) ? _mark : [_mark];
    for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
        var id = ids_2[_i];
        var node = mindmap.graph.findById(id);
        var model = getModel(node);
        // const index = model.mark.indexOf(mark);
        if (_mark === undefined) {
            // 若_mark没有入参，则清除所有mark
            var markValues = Object.values(model.mark);
            model.mark = null;
            undoCmds.push({
                cmd: MarkFeatures.Commands.Mark,
                opts: {
                    nodeIds: id,
                    mark: markValues,
                },
            });
        }
        else if (model.mark !== null) {
            // 若原本节点需要有mark数据，才进行删除操作
            for (var _a = 0, marks_3 = marks; _a < marks_3.length; _a++) {
                var oneMark = marks_3[_a];
                var markType = MindMarkTypeMap[oneMark];
                delete model.mark[markType];
            }
            undoCmds.push({
                cmd: MarkFeatures.Commands.Mark,
                opts: {
                    nodeIds: id,
                    mark: _mark,
                },
            });
        }
        // traverseNodeUpdateMark(model);
        node.draw();
    }
    mindmap.graph.layout();
    return {
        note: '删除标签',
        undoCmd: undoCmds,
    };
};
