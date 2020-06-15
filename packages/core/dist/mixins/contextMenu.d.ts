import { ShowContextMenuOptions, ContextMenuTypes, MindmapCoreL1Ctor } from '../interface';
declare const _default: <TBase extends MindmapCoreL1Ctor<any>>(Base: TBase) => {
    new (...args: any[]): {
        [x: string]: any;
        showContextMenu(options: ShowContextMenuOptions): this;
        hideContextMenu(): this;
        hideAllContextMenu(): this;
        getContextNodeId(): string;
        getContextType(): ContextMenuTypes;
        getContextData(): any;
        menuItemLinkEdit(): void;
        menuItemLinkDelete(): void;
        menuItemNoteEdit(): void;
        menuItemNoteDelete(): void;
        menuItemTagEdit(): void;
        menuItemTagDelete(): void;
        menuItemMarkEdit(evt: MouseEvent): void;
        menuItemMarkDelete(): void;
    };
} & TBase;
export default _default;
