import { CommanderOptions, Command, AllCommands, CommandHistory, CommandExecRes } from '../interface';
export declare class Commander {
    history: CommandHistory[];
    todo: Command<AllCommands>[];
    current: number;
    options: CommanderOptions;
    constructor(options: CommanderOptions);
    execCommand(commands: Command<AllCommands> | Command<AllCommands>[]): CommandExecRes;
    exec(): this;
    add(command: Command<AllCommands>): this;
    addExec(command: Command<AllCommands>): this;
    hasUndo(): boolean;
    hasRedo(): boolean;
    undo(): number;
    redo(): number;
}
