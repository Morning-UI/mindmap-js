var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { FoldFeatures, LinkFeatures, MarkFeatures, NoteFeatures, TagFeatures, ZoomFeatures, DataFeatures, NodeFeatures, } from '../interface';
import * as foldFeatures from '../features/fold';
import * as linkFeatures from '../features/link';
import * as markFeatures from '../features/mark';
import * as noteFeatures from '../features/note';
import * as tagFeatures from '../features/tag';
import * as zoomFeatures from '../features/zoom';
import * as dataFeatures from '../features/data';
import * as nodeFeatures from '../features/node';
var Commands = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, foldFeatures), linkFeatures), markFeatures), noteFeatures), tagFeatures), zoomFeatures), dataFeatures), nodeFeatures);
var Commander = /** @class */ (function () {
    function Commander(options) {
        this.history = [];
        this.todo = [];
        this.current = null;
        this.groupMode = false;
        this.groupDeep = 0;
        var _options = __assign({ 
            // eslint-disable-next-line no-magic-numbers
            maxRecordNums: 500 }, options);
        this.options = _options;
    }
    // eslint-disable-next-line complexity
    Commander.prototype.execCommand = function (commands) {
        var mindmap = this.options.mindmap;
        var _commands = commands;
        var execRes;
        if (!Array.isArray(_commands)) {
            _commands = [_commands];
        }
        for (var _i = 0, _commands_1 = _commands; _i < _commands_1.length; _i++) {
            var command = _commands_1[_i];
            console.log('EXEC', command);
            var cmdName = command.cmd;
            switch (cmdName) {
                case FoldFeatures.Commands.FoldToggle:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case LinkFeatures.Commands.Link:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case LinkFeatures.Commands.Unlink:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case MarkFeatures.Commands.Mark:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case MarkFeatures.Commands.Unmark:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case NoteFeatures.Commands.Note:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case NoteFeatures.Commands.Unnote:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case TagFeatures.Commands.Tag:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case TagFeatures.Commands.TagAll:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case TagFeatures.Commands.Untag:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case ZoomFeatures.Commands.Zoom:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case ZoomFeatures.Commands.FitZoom:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case ZoomFeatures.Commands.MoveCanvas:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case DataFeatures.Commands.ReadData:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case NodeFeatures.Commands.SelectNode:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case NodeFeatures.Commands.UnselectNode:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case NodeFeatures.Commands.ClearAllSelectedNode:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case NodeFeatures.Commands.RemoveNode:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                case NodeFeatures.Commands.InsertSubNode:
                    execRes = Commands[cmdName](__assign({ mindmap: mindmap }, command.opts));
                    break;
                // case NodeFeatures.Commands.RemoveNode:
                //     execRes = Commands[cmdName]({
                //         mindmap,
                //         ...command.opts as CommandOptions<NodeFeatures.Commands.RemoveNode>,
                //     });
                //     break;
                default:
                    break;
            }
        }
        return __assign({ redoCmd: commands, time: Date.now() }, execRes);
    };
    Commander.prototype.exec = function () {
        var commands = this.todo.shift();
        var cmdRes = [];
        for (var _i = 0, _a = commands.commands; _i < _a.length; _i++) {
            var command = _a[_i];
            cmdRes.unshift(this.execCommand(command));
        }
        if (commands._record) {
            this.history.splice(this.current + 1);
            this.history.push(cmdRes);
            this.current = this.history.length - 1;
            if (this.history.length > this.options.maxRecordNums) {
                this.history.shift();
                this.current -= 1;
            }
        }
        if (this.todo.length > 0) {
            this.exec();
        }
        return this;
    };
    Commander.prototype.add = function (command, record) {
        if (record === void 0) { record = true; }
        if (this.groupMode === true) {
            this.currentGroupCommands.commands.push(command);
        }
        else {
            this.todo.push({
                _record: record,
                commands: [command],
            });
        }
        return this;
    };
    // addGroup (commands: Command<AllCommands>[], record = true): this {
    //     this.todo.push({
    //         _record : record,
    //         commands,
    //     });
    //     return this;
    // }
    Commander.prototype.addExec = function (command, record) {
        this.add(command, record);
        if (this.groupMode === false) {
            this.exec();
        }
        return this;
    };
    Commander.prototype.commandNewGroup = function (record) {
        if (record === void 0) { record = true; }
        this.groupDeep++;
        // 同一时间只能记录一组group
        if (this.groupMode) {
            return this;
        }
        this.groupMode = true;
        this.currentGroupCommands = {
            _record: record,
            commands: [],
        };
        return this;
    };
    Commander.prototype.commandExecGroup = function () {
        this.groupDeep--;
        if (this.groupDeep > 0) {
            return this;
        }
        var hasCommand = this.currentGroupCommands.commands.length > 0;
        this.groupMode = false;
        if (hasCommand) {
            this.todo.push(this.currentGroupCommands);
            this.exec();
        }
        this.currentGroupCommands = null;
        return this;
    };
    Commander.prototype.hasUndo = function () {
        if (this.current === null || this.current < 0) {
            return false;
        }
        return true;
    };
    Commander.prototype.hasRedo = function () {
        if (this.current === null || this.current + 1 > (this.history.length - 1)) {
            return false;
        }
        return true;
    };
    // 返回可撤销步骤数
    Commander.prototype.undo = function () {
        if (!this.hasUndo()) {
            return 0;
        }
        var commands = this.history[this.current];
        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
            var command = commands_1[_i];
            this.execCommand(command.undoCmd);
        }
        this.current -= 1;
        return this.current + 1;
    };
    // 返回可重做步骤数
    Commander.prototype.redo = function () {
        if (!this.hasRedo()) {
            return 0;
        }
        this.current += 1;
        var commands = Object.assign([], this.history[this.current]);
        commands.reverse();
        for (var _i = 0, commands_2 = commands; _i < commands_2.length; _i++) {
            var command = commands_2[_i];
            this.execCommand(command.redoCmd);
        }
        return this.history.length - this.current - 1;
    };
    return Commander;
}());
export { Commander };
