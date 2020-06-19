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
}                                               from '../interface';
import * as foldFeatures                        from '../features/fold';
import * as linkFeatures                        from '../features/link';
import * as markFeatures                        from '../features/mark';
import * as noteFeatures                        from '../features/note';
import * as tagFeatures                         from '../features/tag';
import * as zoomFeatures                        from '../features/zoom';
import * as dataFeatures                        from '../features/data';

const Commands = {
    ...foldFeatures,
    ...linkFeatures,
    ...markFeatures,
    ...noteFeatures,
    ...tagFeatures,
    ...zoomFeatures,
    ...dataFeatures,
};

export class Commander {

    history: CommandHistory[] = [];
    todo: Command<AllCommands>[] = [];
    current: number = null;
    options: CommanderOptions;

    constructor (options: CommanderOptions) {

        const _options: CommanderOptions = {
            maxRecordNums : 100,
            ...options,
        };

        this.options = _options;

    }

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

        const command = this.todo.shift();
        const cmdRes = this.execCommand(command);

        if (command._record) {

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

        this.todo.push({
            _record : record,
            ...command,
        });

        return this;

    }

    addExec (command: Command<AllCommands>, record: boolean): this {

        this.add(command, record).exec();

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

        const command = this.history[this.current];

        this.execCommand(command.undoCmd);
        this.current -= 1;

        return this.current + 1;

    }

    // 返回可重做步骤数
    redo (): number {

        if (!this.hasRedo()) {

            return 0;

        }

        this.current += 1;

        const command = this.history[this.current];
        this.execCommand(command.redoCmd);

        return this.history.length - this.current - 1;

    }

}
