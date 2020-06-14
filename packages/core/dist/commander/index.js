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
import { FoldFeatures, LinkFeatures, } from '../interface';
import * as foldFeatures from '../features/fold';
import * as linkFeatures from '../features/link';
var Commands = __assign(__assign({}, foldFeatures), linkFeatures);
var Commander = /** @class */ (function () {
    function Commander(options) {
        this.history = [];
        this.todo = [];
        this.current = null;
        var _options = __assign({ maxRecordNums: 100 }, options);
        this.options = _options;
    }
    Commander.prototype.execCommand = function (commands) {
        var mindmap = this.options.mindmap;
        var _commands = commands;
        var execRes;
        if (!Array.isArray(_commands)) {
            _commands = [_commands];
        }
        for (var _i = 0, _commands_1 = _commands; _i < _commands_1.length; _i++) {
            var command = _commands_1[_i];
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
                default:
                    break;
            }
        }
        return __assign({ redoCmd: commands, time: Date.now() }, execRes);
    };
    Commander.prototype.exec = function () {
        var command = this.todo.shift();
        var cmdRes = this.execCommand(command);
        console.log('EXEC:', cmdRes);
        this.history.splice(this.current + 1);
        this.history.push(cmdRes);
        this.current = this.history.length - 1;
        if (this.history.length > this.options.maxRecordNums) {
            this.history.shift();
            this.current -= 1;
        }
        if (this.todo.length > 0) {
            this.exec();
        }
        return this;
    };
    Commander.prototype.add = function (command) {
        this.todo.push(command);
        return this;
    };
    Commander.prototype.addExec = function (command) {
        this.add(command).exec();
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
    Commander.prototype.undo = function () {
        if (!this.hasUndo()) {
            return;
        }
        var command = this.history[this.current];
        this.execCommand(command.undoCmd);
        this.current -= 1;
        return this;
    };
    Commander.prototype.redo = function () {
        if (!this.hasRedo()) {
            return;
        }
        this.current += 1;
        var command = this.history[this.current];
        this.execCommand(command.redoCmd);
        return this;
    };
    return Commander;
}());
export { Commander };
