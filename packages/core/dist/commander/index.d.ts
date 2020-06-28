import { CommanderOptions, Command, AllCommands, CommandHistory, CommandExecRes, CommandGroup } from '../interface';
export declare class Commander {
    history: CommandHistory[];
    todo: CommandGroup<AllCommands>[];
    current: number;
    options: CommanderOptions;
    groupMode: boolean;
    groupDeep: number;
    currentGroupCommands: CommandGroup<AllCommands>;
    constructor(options: CommanderOptions);
    execCommand(commands: Command<AllCommands> | Command<AllCommands>[]): CommandExecRes;
    exec(): this;
    add(command: Command<AllCommands>, record?: boolean): this;
    addExec(command: Command<AllCommands>, record?: boolean): this;
    commandNewGroup(record?: boolean): this;
    commandExecGroup(): this;
    hasUndo(): boolean;
    hasRedo(): boolean;
    undo(): number;
    redo(): number;
}
