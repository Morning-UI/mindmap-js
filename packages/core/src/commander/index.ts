import {
    NodeIds,
    MindmapNodeItem,
    MindmapCoreL0Ctor,
    FoldFeatures,
    MindmapCoreL0Type,
    CommanderOptions,
    Command,
    AllCommands,
    CommandHistory,
    CommandExecRes,
    AllCommandFOMap,
    LinkFeatures,
    CommandOptions,
    MarkFeatures,
    NoteFeatures,
    TagFeatures,
    ZoomFeatures,
}                                               from '../interface';
import * as foldFeatures                        from '../features/fold';
import * as linkFeatures                        from '../features/link';
import * as markFeatures                        from '../features/mark';
import * as noteFeatures                        from '../features/note';
import * as tagFeatures                         from '../features/tag';
import * as zoomFeatures                        from '../features/zoom';

const Commands = {
    ...foldFeatures,
    ...linkFeatures,
    ...markFeatures,
    ...noteFeatures,
    ...tagFeatures,
    ...zoomFeatures,
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
                        ...(command.opts as CommandOptions<FoldFeatures.Commands.FoldToggle>),
                    });
                    break;

                case LinkFeatures.Commands.Link:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<LinkFeatures.Commands.Link>),
                    });
                    break;

                case LinkFeatures.Commands.Unlink:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<LinkFeatures.Commands.Unlink>),
                    });
                    break;

                case MarkFeatures.Commands.Mark:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<MarkFeatures.Commands.Mark>),
                    });
                    break;

                case MarkFeatures.Commands.Unmark:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<MarkFeatures.Commands.Unmark>),
                    });
                    break;

                case NoteFeatures.Commands.Note:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<NoteFeatures.Commands.Note>),
                    });
                    break;

                case NoteFeatures.Commands.Unnote:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<NoteFeatures.Commands.Unnote>),
                    });
                    break;

                case TagFeatures.Commands.Tag:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<TagFeatures.Commands.Tag>),
                    });
                    break;

                case TagFeatures.Commands.TagAll:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<TagFeatures.Commands.TagAll>),
                    });
                    break;

                case TagFeatures.Commands.Untag:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<TagFeatures.Commands.Untag>),
                    });
                    break;

                case TagFeatures.Commands.UntagByIndex:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<TagFeatures.Commands.UntagByIndex>),
                    });
                    break;

                case ZoomFeatures.Commands.Zoom:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<ZoomFeatures.Commands.Zoom>),
                    });
                    break;

                case ZoomFeatures.Commands.FitZoom:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<ZoomFeatures.Commands.FitZoom>),
                    });
                    break;

                case ZoomFeatures.Commands.MoveCanvas:
                    execRes = Commands[cmdName]({
                        mindmap,
                        ...(command.opts as CommandOptions<ZoomFeatures.Commands.MoveCanvas>),
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

    }

    add (command: Command<AllCommands>): this {

        this.todo.push(command);

        return this;
        
    }

    addExec (command: Command<AllCommands>): this {

        this.add(command).exec();

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

    undo (): this {

        if (!this.hasUndo()) {

            return;

        }
        
        const command = this.history[this.current];

        this.execCommand(command.undoCmd);
        this.current -= 1;

        return this;

    }

    redo (): this {

        if (!this.hasRedo()) {

            return;

        }
        
        this.current += 1;

        const command = this.history[this.current];
        this.execCommand(command.redoCmd);

        return this;

    }

}
