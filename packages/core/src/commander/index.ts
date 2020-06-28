import {
    FoldFeatures,
    CommanderOptions,
    Command,
    AllCommands,
    CommandHistory,
    CommandExecRes,
    LinkFeatures,
    CommandOptions,
    MarkFeatures,
    NoteFeatures,
    TagFeatures,
    ZoomFeatures,
    DataFeatures,
    NodeFeatures,
    CommandGroup,
}                                               from '../interface';
import * as foldFeatures                        from '../features/fold';
import * as linkFeatures                        from '../features/link';
import * as markFeatures                        from '../features/mark';
import * as noteFeatures                        from '../features/note';
import * as tagFeatures                         from '../features/tag';
import * as zoomFeatures                        from '../features/zoom';
import * as dataFeatures                        from '../features/data';
import * as nodeFeatures                        from '../features/node';

const Commands = {
    ...foldFeatures,
    ...linkFeatures,
    ...markFeatures,
    ...noteFeatures,
    ...tagFeatures,
    ...zoomFeatures,
    ...dataFeatures,
    ...nodeFeatures,
};

export class Commander {

    history: CommandHistory[] = [];
    todo: CommandGroup<AllCommands>[] = [];
    current: number = null;
    options: CommanderOptions;
    groupMode = false;
    groupDeep = 0;
    currentGroupCommands: CommandGroup<AllCommands>;

    constructor (options: CommanderOptions) {

        const _options: CommanderOptions = {
            // eslint-disable-next-line no-magic-numbers
            maxRecordNums : 500,
            ...options,
        };

        this.options = _options;

    }

    // eslint-disable-next-line complexity
    execCommand (commands: Command<AllCommands>|Command<AllCommands>[]): CommandExecRes {

        const mindmap = this.options.mindmap;

        let _commands = commands;
        let execRes;

        if (!Array.isArray(_commands)) {

            _commands = [_commands];

        }

        for (const command of _commands) {

            console.log('EXEC', command);

            const cmdName = command.cmd;

            switch (cmdName) {

                case FoldFeatures.Commands.FoldToggle:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<FoldFeatures.Commands.FoldToggle>,
                    });
                    break;

                case LinkFeatures.Commands.Link:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<LinkFeatures.Commands.Link>,
                    });
                    break;

                case LinkFeatures.Commands.Unlink:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<LinkFeatures.Commands.Unlink>,
                    });
                    break;

                case MarkFeatures.Commands.Mark:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<MarkFeatures.Commands.Mark>,
                    });
                    break;

                case MarkFeatures.Commands.Unmark:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<MarkFeatures.Commands.Unmark>,
                    });
                    break;

                case NoteFeatures.Commands.Note:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<NoteFeatures.Commands.Note>,
                    });
                    break;

                case NoteFeatures.Commands.Unnote:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<NoteFeatures.Commands.Unnote>,
                    });
                    break;

                case TagFeatures.Commands.Tag:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<TagFeatures.Commands.Tag>,
                    });
                    break;

                case TagFeatures.Commands.TagAll:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<TagFeatures.Commands.TagAll>,
                    });
                    break;

                case TagFeatures.Commands.Untag:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<TagFeatures.Commands.Untag>,
                    });
                    break;

                case ZoomFeatures.Commands.Zoom:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<ZoomFeatures.Commands.Zoom>,
                    });
                    break;

                case ZoomFeatures.Commands.FitZoom:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<ZoomFeatures.Commands.FitZoom>,
                    });
                    break;

                case ZoomFeatures.Commands.MoveCanvas:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<ZoomFeatures.Commands.MoveCanvas>,
                    });
                    break;

                case DataFeatures.Commands.ReadData:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<DataFeatures.Commands.ReadData>,
                    });
                    break;

                case NodeFeatures.Commands.SelectNode:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<NodeFeatures.Commands.SelectNode>,
                    });
                    break;

                case NodeFeatures.Commands.UnselectNode:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<NodeFeatures.Commands.UnselectNode>,
                    });
                    break;

                case NodeFeatures.Commands.ClearAllSelectedNode:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<NodeFeatures.Commands.ClearAllSelectedNode>,
                    });
                    break;

                case NodeFeatures.Commands.RemoveNode:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<NodeFeatures.Commands.RemoveNode>,
                    });
                    break;

                case NodeFeatures.Commands.InsertSubNode:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...command.opts as CommandOptions<NodeFeatures.Commands.InsertSubNode>,
                    });
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

        return {
            redoCmd : commands,
            time : Date.now(),
            ...execRes,
        };

    }

    exec (): this {

        const commands = this.todo.shift();
        const cmdRes: CommandExecRes[] = [];

        for (const command of commands.commands) {

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

    }

    add (command: Command<AllCommands>, record = true): this {

        if (this.groupMode === true) {

            this.currentGroupCommands.commands.push(command);

        } else {

            this.todo.push({
                _record : record,
                commands : [command],
            });

        }

        return this;

    }

    // addGroup (commands: Command<AllCommands>[], record = true): this {

    //     this.todo.push({
    //         _record : record,
    //         commands,
    //     });

    //     return this;

    // }

    addExec (command: Command<AllCommands>, record?: boolean): this {

        this.add(command, record);

        if (this.groupMode === false) {

            this.exec();

        }

        return this;

    }

    commandNewGroup (record = true): this {

        this.groupDeep++;

        // 同一时间只能记录一组group
        if (this.groupMode) {

            return this;

        }

        this.groupMode = true;
        this.currentGroupCommands = {
            _record : record,
            commands : [],
        };

        return this;

    }

    commandExecGroup (): this {

        this.groupDeep--;

        if (this.groupDeep > 0) {

            return this;

        }

        const hasCommand = this.currentGroupCommands.commands.length > 0;

        this.groupMode = false;

        if (hasCommand) {

            this.todo.push(this.currentGroupCommands);
            this.exec();

        }

        this.currentGroupCommands = null;

        return this;

    }

    hasUndo (): boolean {

        if (this.current === null || this.current < 0) {

            return false;

        }

        return true;

    }

    hasRedo (): boolean {

        if (this.current === null || this.current + 1 > (this.history.length - 1)) {

            return false;

        }

        return true;

    }

    // 返回可撤销步骤数
    undo (): number {

        if (!this.hasUndo()) {

            return 0;

        }

        const commands = this.history[this.current];

        for (const command of commands) {

            this.execCommand(command.undoCmd);

        }

        this.current -= 1;

        return this.current + 1;

    }

    // 返回可重做步骤数
    redo (): number {

        if (!this.hasRedo()) {

            return 0;

        }

        this.current += 1;

        const commands = Object.assign([], this.history[this.current]);

        commands.reverse();

        for (const command of commands) {

            this.execCommand(command.redoCmd);

        }

        return this.history.length - this.current - 1;

    }

}
