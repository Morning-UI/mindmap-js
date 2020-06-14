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
import { MindMarksTag, MindMarksTask, MindMarksStar, MindMarksFlag, MindMarksPerson, MindMarksPriority, MindMarkTypes, } from '../interface';
import { fillNodeIds, } from '../base/utils';
import { markElementBuilder, } from '../utils/markBuilder';
import { setItemState, } from '../utils/setItemState';
import { getModel, } from '../utils/G6Ext';
var cleanTagHoverState = function (graph, node) {
    var states = node.getStates();
    for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
        var state = states_1[_i];
        if ((/^tag-hover/u).test(state)) {
            setItemState(graph, node.get('id'), state, false);
        }
    }
};
var MindMarkTypeMap = {};
var genMindMarkTypeMap = function (type, marks) {
    for (var _i = 0, marks_1 = marks; _i < marks_1.length; _i++) {
        var mark = marks_1[_i];
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
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.showEditMark = function (nodeIds, markType) {
            var _a;
            var ids = fillNodeIds(nodeIds);
            var node = this.graph.findById(ids[0]);
            var model = getModel(node);
            var bbox = node.getBBox();
            var _b = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY), x = _b.x, y = _b.y;
            var $boxEditMark = this._options.$boxEditMark;
            var $elements = null;
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
            var boxEditMarkWidth = 0;
            this.currentEditMarkNodeIds = nodeIds;
            this.currentEditMarkValue = model.mark[markType];
            (_a = $boxEditMark.querySelector('ul')).append.apply(_a, $elements);
            $boxEditMark.style.display = 'block';
            boxEditMarkWidth = $boxEditMark.clientWidth;
            $boxEditMark.style.left = x - (boxEditMarkWidth / 2) + "px";
            $boxEditMark.style.top = y + "px";
            return this;
        };
        class_1.prototype.hideEditMark = function () {
            var $boxEditMark = this._options.$boxEditMark;
            this.currentEditMarkNodeIds = [];
            this.currentEditMarkValue = null;
            $boxEditMark.querySelector('ul').innerHTML = '';
            $boxEditMark.style.display = 'none';
            return this;
        };
        class_1.prototype.getCurrentEditMarkNodeIds = function () {
            return this.currentEditMarkNodeIds;
        };
        class_1.prototype.getCurrentEditMarkValue = function () {
            return this.currentEditMarkValue;
        };
        class_1.prototype.mark = function (nodeIds, mark) {
            var ids = fillNodeIds(nodeIds);
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                var node = this.graph.findById(id);
                var model = getModel(node);
                if (model.mark === null) {
                    model.mark = {};
                }
                var markType = MindMarkTypeMap[mark];
                switch (markType) {
                    case MindMarkTypes.Tag:
                        model.mark.tag = mark;
                        break;
                    case MindMarkTypes.Priority:
                        model.mark.priority = mark;
                        break;
                    case MindMarkTypes.Task:
                        model.mark.task = mark;
                        break;
                    case MindMarkTypes.Star:
                        model.mark.star = mark;
                        break;
                    case MindMarkTypes.Flag:
                        model.mark.flag = mark;
                        break;
                    case MindMarkTypes.Person:
                        model.mark.person = mark;
                        break;
                    default:
                        break;
                }
                // model.mark = arrayUniq(model.mark);
                // traverseNodeUpdateMark(model);
                node.draw();
            }
            this.graph.layout();
            return this;
        };
        class_1.prototype.unmark = function (nodeIds, mark) {
            var ids = fillNodeIds(nodeIds);
            for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
                var id = ids_2[_i];
                var node = this.graph.findById(id);
                var model = getModel(node);
                var markType = MindMarkTypeMap[mark];
                // const index = model.mark.indexOf(mark);
                if (model.mark !== null) {
                    delete model.mark[markType];
                }
                // traverseNodeUpdateMark(model);
                node.draw();
            }
            this.graph.layout();
            return this;
        };
        return class_1;
    }(Base));
});
